import { fetchReddit } from './reddit'
import { fetchHackerNews } from './hackernews'
import { fetchDevTo } from './devto'
import { fetchTabnews } from './tabnews'
import { fetchYouTube } from './youtube'

function matchesTopic(item, terms) {
  const haystack = `${item.title || ''} ${item.body || ''} ${item.author || ''} ${item.sub || ''} ${item.source || ''}`.toLowerCase()
  return terms.every(term => haystack.includes(term))
}

function toTerms(topicQuery = '') {
  return topicQuery
    .toLowerCase()
    .split(/[,\s]+/)
    .map(t => t.trim())
    .filter(Boolean)
}

export async function fetchAll(config = {}, onProgress = () => { }) {
  const {
    subreddits = 'ProgrammerHumor, webdev, MachineLearning, backend, golang',
    redditSort = 'hot',
    redditLimit = 15,
    hnLimit = 20,
    devtoTags = [],
    tabnewsLimit = 20,
    youtubeKey = '',
    youtubeQueries = [],
    excludeKeywords = [],
    topicQuery = '',
  } = config
  const terms = toTerms(topicQuery)
  const hasTopic = terms.length > 0

  const sources = [
    { label: 'Reddit', fn: () => fetchReddit(subreddits, redditSort, redditLimit, topicQuery) },
    { label: 'Hacker News', fn: () => fetchHackerNews(hnLimit, topicQuery) },
    { label: 'Dev.to', fn: () => fetchDevTo(devtoTags, 20, topicQuery) },
    { label: 'Tabnews', fn: () => fetchTabnews(tabnewsLimit, hasTopic ? 'new' : 'relevant') },
    { label: 'YouTube', fn: () => fetchYouTube(youtubeKey, hasTopic ? [topicQuery, ...youtubeQueries] : youtubeQueries) },
  ]

  let all = []

  for (const source of sources) {
    onProgress(`→ A carregar ${source.label}...`)
    try {
      const items = await source.fn()
      all.push(...items)
      onProgress(`✓ ${source.label}: ${items.length} itens`)
    } catch (e) {
      onProgress(`✗ ${source.label}: erro`)
    }
  }

  // deduplicação por id
  const seen = new Set()
  all = all.filter(item => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })

  // filtrar palavras excluídas
  if (excludeKeywords.length > 0) {
    const rx = new RegExp(excludeKeywords.join('|'), 'i')
    all = all.filter(item => !rx.test(item.title + ' ' + item.body))
  }

  // filtrar por tema/pesquisa quando definido
  if (hasTopic) {
    const strict = all.filter(item => matchesTopic(item, terms))
    if (strict.length > 0) {
      all = strict
      onProgress(`✓ Filtro por tema: ${all.length} itens`)
    } else {
      const broad = all.filter(item => terms.some(term => matchesTopic(item, [term])))
      if (broad.length > 0) {
        all = broad
        onProgress(`⚠ Tema sem match exato, aplicado match parcial: ${all.length} itens`)
      } else {
        onProgress('⚠ Tema sem resultados diretos. A mostrar conteúdo relevante geral.')
      }
    }
  }

  // ordenar por upvotes
  all.sort((a, b) => b.upvotes - a.upvotes)

  return all
}

export async function fetchTabnewsDaily(limit = 30) {
  const items = await fetchTabnews(limit, 'new')
  const today = new Date().toLocaleDateString('pt')
  const todayItems = items.filter(item => item.date === today)
  return todayItems.length > 0 ? todayItems : items.slice(0, 12)
}
