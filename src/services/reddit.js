const BASE = 'https://www.reddit.com'

export async function fetchReddit(subreddits, sort = 'hot', limit = 15, topicQuery = '') {
  const subs = subreddits.split(',').map(s => s.trim()).filter(Boolean)
  const results = []
  const query = topicQuery.trim()

  for (const sub of subs) {
    try {
      const endpoint = query
        ? `${BASE}/r/${sub}/search.json?q=${encodeURIComponent(query)}&restrict_sr=1&sort=relevance&limit=${limit}&raw_json=1`
        : `${BASE}/r/${sub}/${sort}.json?limit=${limit}&raw_json=1`
      const res = await fetch(
        endpoint,
        { headers: { 'Accept': 'application/json' } }
      )
      if (!res.ok) continue
      const data = await res.json()
      const posts = data?.data?.children?.map(c => c.data) || []
      results.push(...posts.map(mapReddit))
    } catch (e) {
      console.warn(`Reddit r/${sub}:`, e.message)
    }
  }
  return results
}

function mapReddit(r) {
  return {
    id: 'r_' + r.id,
    source: 'reddit',
    type: classify(r.title, r.url || ''),
    title: r.title || '—',
    body: r.selftext?.slice(0, 300) || '',
    url: r.url || `https://reddit.com${r.permalink}`,
    permalink: `https://reddit.com${r.permalink}`,
    image: r.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, '&') || null,
    upvotes: r.score || 0,
    comments: r.num_comments || 0,
    sub: r.subreddit || '',
    author: r.author || '',
    date: new Date((r.created_utc || 0) * 1000).toLocaleDateString('pt'),
    language: 'en',
  }
}

function classify(title = '', url = '') {
  const t = title.toLowerCase()
  const u = url.toLowerCase()
  if (/\.(jpg|jpeg|png|gif|webp)/i.test(u) || /meme|lol|😂|💀|🤣|humor|funny|when you|me:|pov:/i.test(t)) return 'meme'
  if (/github\.com|docs\.|documentation|readme|spec|rfc\./i.test(u) || /documentation|docs|reference|spec|guide/i.test(t)) return 'doc'
  if (/medium\.com|dev\.to|hashnode|substack|blog|tutorial|how.to|article/i.test(u + ' ' + t)) return 'article'
  return 'discussion'
}
