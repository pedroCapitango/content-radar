const BASE = 'https://www.tabnews.com.br/api/v1'

export async function fetchTabnews(limit = 20, strategy = 'relevant') {
  try {
    const res = await fetch(
      `${BASE}/contents?strategy=${encodeURIComponent(strategy)}&per_page=${limit}&page=1`
    )
    if (!res.ok) throw new Error('Tabnews ' + res.status)
    const items = await res.json()
    return items.map(mapTabnews)
  } catch (e) {
    console.warn('Tabnews:', e.message)
    return []
  }
}

function mapTabnews(item) {
  return {
    id: 'tn_' + item.id,
    source: 'tabnews',
    type: classifyTabnews(item.title || '', item.body || ''),
    title: item.title || '—',
    body: item.body?.slice(0, 300) || '',
    url: `https://www.tabnews.com.br/${item.owner_username}/${item.slug}`,
    permalink: `https://www.tabnews.com.br/${item.owner_username}/${item.slug}`,
    image: null,
    upvotes: item.tabcoins || 0,
    comments: item.children_deep_count || 0,
    sub: '',
    author: item.owner_username || '',
    date: item.published_at
      ? new Date(item.published_at).toLocaleDateString('pt')
      : '—',
    language: 'pt',
  }
}

function classifyTabnews(title = '', body = '') {
  const t = title.toLowerCase()
  if (/tutorial|como|guia|aprend/i.test(t)) return 'article'
  if (/opinião|discussão|pergunta|debate|o que vocês/i.test(t)) return 'discussion'
  if (/docs|documentação|referência|api/i.test(t)) return 'doc'
  return 'article'
}
