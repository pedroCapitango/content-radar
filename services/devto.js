const BASE = 'https://dev.to/api'

function termsToTags(topicQuery = '') {
  return topicQuery
    .toLowerCase()
    .split(/[,\s]+/)
    .map(t => t.trim())
    .filter(Boolean)
    .slice(0, 4)
}

export async function fetchDevTo(tags = [], limit = 20, topicQuery = '') {
  const results = []
  const fromTopic = termsToTags(topicQuery)
  const queries = fromTopic.length > 0
    ? fromTopic
    : tags.length > 0
      ? tags
      : ['programming', 'webdev', 'backend', 'ai']

  for (const tag of queries.slice(0, 4)) {
    try {
      const res = await fetch(
        `${BASE}/articles?tag=${encodeURIComponent(tag)}&per_page=${Math.ceil(limit / queries.length)}&top=7`
      )
      if (!res.ok) continue
      const articles = await res.json()
      results.push(...articles.map(mapDevTo))
    } catch (e) {
      console.warn(`Dev.to tag ${tag}:`, e.message)
    }
  }
  return results
}

function mapDevTo(a) {
  return {
    id: 'dt_' + a.id,
    source: 'devto',
    type: 'article',
    title: a.title || '—',
    body: a.description || '',
    url: a.url || '',
    permalink: a.url || '',
    image: a.cover_image || a.social_image || null,
    upvotes: a.positive_reactions_count || 0,
    comments: a.comments_count || 0,
    sub: a.tag_list?.[0] || '',
    author: a.user?.username || '',
    date: a.published_at
      ? new Date(a.published_at).toLocaleDateString('pt')
      : '—',
    language: 'en',
  }
}
