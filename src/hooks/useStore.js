import { useState, useCallback, useEffect } from 'react'
import { fetchAll, fetchTabnewsDaily } from '../services/index'

const STORAGE_KEY = 'cr_items'
const SAVED_KEY = 'cr_saved'
const HISTORY_KEY = 'cr_history'
const SYNC_KEY = 'cr_last_sync'
const RECOMMENDED_KEY = 'cr_recommended_tabnews'
const RECOMMENDED_SYNC_KEY = 'cr_recommended_sync'

function storageGet(key) {
  try { return JSON.parse(localStorage.getItem(key)) } catch { return null }
}
function storageSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

export function useStore() {
  const [items, setItems] = useState(() => storageGet(STORAGE_KEY) || [])
  const [savedIds, setSavedIds] = useState(() => new Set(storageGet(SAVED_KEY) || []))
  const [history, setHistory] = useState(() => storageGet(HISTORY_KEY) || [])
  const [lastSync, setLastSync] = useState(() => localStorage.getItem(SYNC_KEY) || null)
  const [loading, setLoading] = useState(false)
  const [loadingLog, setLoadingLog] = useState([])
  const [recommendedItems, setRecommendedItems] = useState(() => storageGet(RECOMMENDED_KEY) || [])
  const [config, setConfig] = useState(() => storageGet('cr_config') || {
    subreddits: 'ProgrammerHumor, webdev, MachineLearning, backend, golang',
    redditSort: 'hot',
    redditLimit: 15,
    hnLimit: 20,
    tabnewsLimit: 20,
    youtubeKey: '',
    excludeKeywords: [],
  })

  const saveConfig = useCallback((newConfig) => {
    setConfig(newConfig)
    storageSet('cr_config', newConfig)
  }, [])

  const refreshRecommendations = useCallback(async (force = false) => {
    const today = new Date().toLocaleDateString('pt')
    const lastSync = localStorage.getItem(RECOMMENDED_SYNC_KEY)
    if (!force && lastSync === today && recommendedItems.length > 0) return
    try {
      const items = await fetchTabnewsDaily(config.tabnewsLimit || 20)
      setRecommendedItems(items)
      storageSet(RECOMMENDED_KEY, items)
      localStorage.setItem(RECOMMENDED_SYNC_KEY, today)
    } catch {}
  }, [config.tabnewsLimit, recommendedItems.length])

  useEffect(() => {
    refreshRecommendations(false)
  }, [refreshRecommendations])

  const runFetch = useCallback(async (topicQuery = '') => {
    setLoading(true)
    setLoadingLog([])

    const onProgress = (msg) => {
      setLoadingLog(prev => [...prev, msg])
    }

    try {
      const query = topicQuery.trim()
      const fetchConfig = query ? { ...config, topicQuery: query } : config
      if (query) onProgress(`🔎 Tema selecionado: "${query}"`)

      const fetched = await fetchAll(fetchConfig, onProgress)

      // merge com existentes, deduplicando
      const existingIds = new Set(items.map(i => i.id))
      const newItems = fetched.filter(i => !existingIds.has(i.id))
      const merged = [...newItems, ...items].slice(0, 500)

      setItems(merged)
      storageSet(STORAGE_KEY, merged)

      // guardar histórico diário
      const today = new Date().toLocaleDateString('pt')
      const entry = {
        date: today,
        total: merged.length,
        memes: merged.filter(i => i.type === 'meme').length,
        articles: merged.filter(i => i.type === 'article').length,
        docs: merged.filter(i => i.type === 'doc').length,
        discussions: merged.filter(i => i.type === 'discussion').length,
      }
      const newHistory = [...history.filter(h => h.date !== today), entry].slice(-14)
      setHistory(newHistory)
      storageSet(HISTORY_KEY, newHistory)

      const syncTime = new Date().toLocaleString('pt')
      setLastSync(syncTime)
      localStorage.setItem(SYNC_KEY, syncTime)

      onProgress('✓ Concluído — ' + fetched.length + ' itens recolhidos!')
    } catch (e) {
      onProgress('✗ Erro: ' + e.message)
    }

    setTimeout(() => setLoading(false), 800)
  }, [config, items, history])

  const toggleSave = useCallback((id) => {
    setSavedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      storageSet(SAVED_KEY, [...next])
      return next
    })
  }, [])

  return {
    items, savedIds, history, lastSync,
    loading, loadingLog,
    recommendedItems, refreshRecommendations,
    config, saveConfig,
    runFetch, toggleSave,
  }
}