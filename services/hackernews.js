const BASE = 'https://hacker-news.firebaseio.com/v0'
const ALGOLIA = 'https://hn.algolia.com/api/v1/search'

export async function fetchHackerNews(limit = 20, topicQuery = '') {
  const query = topicQuery.trim()
  if (query) {
    try {
      const url = new URL(ALGOLIA)
      url.searchParams.set('query', query)
      url.searchParams.set('tags', 'story')
      url.searchParams.set('hitsPerPage', String(limit))
      const res = await fetch(url.toString())
      if (!res.ok) throw new Error('HN search ' + res.status)
      const data = await res.json()
      return (data.hits || []).map(mapAlgoliaHN).filter(i => i.title && i.url)
    } catch (e) {
      console.warn('HackerNews search:', e.message)
    }
  }

  try {
    const res = await fetch(`${BASE}/topstories.json`)
    const ids = await res.json()
    const top = ids.slice(0, limit)

    const items = await Promise.allSettled(
      top.map(id => fetch(`${BASE}/item/${id}.json`).then(r => r.json()))
    )

    return items
      .filter(r => r.status === 'fulfilled' && r.value?.title)
      .map(r => mapHN(r.value))
  } catch (e) {
    console.warn('HackerNews:', e.message)
    return []
  }
}

function mapAlgoliaHN(item) {
  return {
    id: 'hn_' + (item.objectID || item.story_id || Math.random()),
    source: 'hackernews',
    type: classifyHN(item.title || item.story_title || '', item.url || item.story_url || ''),
    title: item.title || item.story_title || '—',
    body: '',
    url: item.url || item.story_url || `https://news.ycombinator.com/item?id=${item.objectID}`,
    permalink: `https://news.ycombinator.com/item?id=${item.objectID}`,
    image: null,
    upvotes: item.points || 0,
    comments: item.num_comments || 0,
    sub: '',
    author: item.author || '',
    date: item.created_at ? new Date(item.created_at).toLocaleDateString('pt') : '—',
    language: 'en',
  }
}

function mapHN(item) {
  return {
    id: 'hn_' + item.id,
    source: 'hackernews',
    type: classifyHN(item.title, item.url || ''),
    title: item.title || '—',
    body: '',
    url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
    permalink: `https://news.ycombinator.com/item?id=${item.id}`,
    image: null,
    upvotes: item.score || 0,
    comments: item.descendants || 0,
    sub: '',
    author: item.by || '',
    date: new Date((item.time || 0) * 1000).toLocaleDateString('pt'),
    language: 'en',
  }
}

function classifyHN(title = '', url = '') {
  const t = title.toLowerCase()
  const u = url.toLowerCase()
  if (/show hn|i built|i made|launch/i.test(t)) return 'article'
  if (/ask hn|who is|what is|why does/i.test(t)) return 'discussion'
  if (/github\.com|docs\.|spec\.|rfc\./i.test(u)) return 'doc'
  return 'article'
}
