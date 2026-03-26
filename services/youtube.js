const BASE = 'https://www.googleapis.com/youtube/v3'

export async function fetchYouTube(apiKey, queries = [], maxResults = 10) {
  if (!apiKey) return []
  const results = []
  const defaultQueries = ['programação tutorial', 'backend desenvolvimento', 'inteligência artificial programação']
  const searchTerms = queries.length > 0 ? queries : defaultQueries

  for (const q of searchTerms.slice(0, 3)) {
    try {
      const url = new URL(`${BASE}/search`)
      url.searchParams.set('part', 'snippet')
      url.searchParams.set('q', q)
      url.searchParams.set('type', 'video')
      url.searchParams.set('maxResults', maxResults)
      url.searchParams.set('relevanceLanguage', 'pt')
      url.searchParams.set('order', 'relevance')
      url.searchParams.set('key', apiKey)

      const res = await fetch(url.toString())
      if (!res.ok) continue
      const data = await res.json()
      results.push(...(data.items || []).map(mapYouTube))
    } catch (e) {
      console.warn(`YouTube "${q}":`, e.message)
    }
  }
  return results
}

function mapYouTube(item) {
  const s = item.snippet || {}
  return {
    id: 'yt_' + item.id?.videoId,
    source: 'youtube',
    type: 'article',
    title: s.title || '—',
    body: s.description?.slice(0, 300) || '',
    url: `https://youtube.com/watch?v=${item.id?.videoId}`,
    permalink: `https://youtube.com/watch?v=${item.id?.videoId}`,
    image: s.thumbnails?.medium?.url || null,
    upvotes: 0,
    comments: 0,
    sub: s.channelTitle || '',
    author: s.channelTitle || '',
    date: s.publishedAt
      ? new Date(s.publishedAt).toLocaleDateString('pt')
      : '—',
    language: 'pt',
  }
}
