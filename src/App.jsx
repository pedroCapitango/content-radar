import { useState, useEffect } from 'react'
import './index.css'
import { useStore } from './hooks/useStore'
import Dashboard from './components/Dashboard'
import Loading from './components/Loading'
import ContentGrid from './components/ContentGrid'
import Saved from './components/Saved'
import LinkedInHelper from './components/LinkedInHelper'
import Setup from './components/Setup'
import Onboarding from './components/Onboarding'
import Recommendations from './components/Recommendations'
import { Analytics } from '@vercel/analytics/react';
import useIsCompact from './hooks/useIsCompact'

const panelTitles = {
  setup: 'Configuração', dashboard: 'Dashboard',
  content: 'Conteúdo', saved: 'Guardados', linkedin: 'LinkedIn Helper', recommendations: 'Indicações',
}

const navItems = [
  { id: 'setup', icon: '⚙', label: 'Configuração' },
  { id: 'dashboard', icon: '◈', label: 'Dashboard' },
  { id: 'content', icon: '◫', label: 'Conteúdo' },
  { id: 'recommendations', icon: '◉', label: 'Indicações' },
  { id: 'saved', icon: '★', label: 'Guardados' },
  { id: 'linkedin', icon: 'in', label: 'LinkedIn Helper' },
]

export default function App() {
  const [activePanel, setActivePanel] = useState('dashboard')
  const [linkedInItem, setLinkedInItem] = useState(null)
  const [topicQuery, setTopicQuery] = useState('')
  const [activeTopic, setActiveTopic] = useState('')
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem('cr_onboarded')
  )

  const THEME_KEY = 'cr_theme'
  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') return 'dark'
    const t = document.documentElement?.dataset?.theme
    return t === 'light' || t === 'dark' ? t : 'dark'
  })

  useEffect(() => {
    try {
      document.documentElement.dataset.theme = theme
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      // Ignore write failures and keep UI functional.
    }
  }, [theme])

  const {
    items, savedIds, history, lastSync, loading, loadingLog,
    runFetch, toggleSave, config, saveConfig, recommendedItems, refreshRecommendations,
  } = useStore()
  const isCompact = useIsCompact()

  const today = new Date().toLocaleDateString('pt', { weekday: 'long', day: 'numeric', month: 'long' })

  function dismissOnboarding() {
    localStorage.setItem('cr_onboarded', '1')
    setShowOnboarding(false)
  }

  function goToLinkedIn(item) {
    setLinkedInItem(item)
    setActivePanel('linkedin')
  }

  function handleFetch() {
    const query = topicQuery.trim()
    setActiveTopic(query)
    runFetch(query)
    if (query) setActivePanel('content')
  }

  function toggleTheme() {
    setTheme(current => (current === 'light' ? 'dark' : 'light'))
  }

  return (
    <>
      <Analytics />
      <div style={{ display: isCompact ? 'block' : 'flex', minHeight: '100vh' }}>
        {showOnboarding && <Onboarding onDismiss={dismissOnboarding} />}
        {loading && <Loading log={loadingLog} />}

        {/* SIDEBAR */}
        <aside style={{
          position: isCompact ? 'relative' : 'fixed',
          left: 0,
          top: 0,
          bottom: isCompact ? 'auto' : 0,
          width: isCompact ? '100%' : 220,
          background: 'var(--ink)', display: 'flex', flexDirection: 'column',
          zIndex: 200,
          borderRight: isCompact ? 'none' : '1px solid var(--border2)',
          borderBottom: isCompact ? '1px solid var(--border2)' : 'none',
        }}>
          <div style={{ padding: isCompact ? '14px 16px' : '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 900, color: 'var(--gold2)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Content<br />Radar
            </div>
            <div style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 4 }}>
              PRO · LinkedIn Edition
            </div>
          </div>

          <nav style={{
            flex: 1,
            padding: isCompact ? '8px 10px' : '16px 0',
            display: 'flex',
            flexDirection: isCompact ? 'row' : 'column',
            gap: isCompact ? 6 : 0,
            overflowX: isCompact ? 'auto' : 'visible',
          }}>
            {navItems.map(item => (
              <div key={item.id} onClick={() => setActivePanel(item.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: isCompact ? '9px 12px' : '11px 20px',
                color: activePanel === item.id ? 'var(--gold2)' : 'var(--muted)',
                cursor: 'pointer', fontSize: 12, letterSpacing: '0.04em',
                borderLeft: isCompact ? 'none' : activePanel === item.id ? '2px solid var(--gold)' : '2px solid transparent',
                borderBottom: isCompact ? activePanel === item.id ? '2px solid var(--gold)' : '2px solid transparent' : 'none',
                background: activePanel === item.id ? 'rgba(232,160,32,0.08)' : 'transparent',
                transition: 'all 0.15s', userSelect: 'none', whiteSpace: 'nowrap',
              }}>
                <span style={{ width: 16, textAlign: 'center', fontSize: 14 }}>{item.icon}</span>
                {item.label}
                {item.id === 'saved' && savedIds.size > 0 && (
                  <span style={{ marginLeft: 'auto', background: 'var(--coral)', color: '#fff', fontSize: 9, padding: '2px 7px', borderRadius: 10 }}>
                    {savedIds.size}
                  </span>
                )}
              </div>
            ))}
          </nav>

          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--border)',
            display: isCompact ? 'none' : 'block',
          }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.05em', lineHeight: 1.8 }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', boxShadow: '0 0 6px var(--teal)', marginRight: 6, animation: 'blink 2.5s infinite' }} />
              5 FONTES ACTIVAS<br />
              ÚLTIMA SYNC: {lastSync ? lastSync.split(',')[1]?.trim() || '—' : '—'}
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div style={{ marginLeft: isCompact ? 0 : 220, flex: 1 }}>
          <div style={{
            background: 'var(--cream)', borderBottom: '1px solid var(--border)',
            padding: isCompact ? '12px 14px' : '14px 32px',
            display: 'flex',
            alignItems: isCompact ? 'stretch' : 'center',
            flexDirection: isCompact ? 'column' : 'row',
            justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100,
            gap: isCompact ? 10 : 0,
          }}>
            <div style={{
              fontFamily: 'var(--serif)', fontSize: isCompact ? 18 : 20, fontWeight: 700,
              color: 'var(--text)', letterSpacing: '-0.03em', width: isCompact ? '100%' : 'auto',
            }}>
              {panelTitles[activePanel]}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: isCompact ? '100%' : 'auto', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Alternar tema"
                title="Alternar tema"
                style={{
                  padding: '9px 12px',
                  background: 'var(--paper2)',
                  color: 'var(--text)',
                  borderRadius: 10,
                  border: '1px solid var(--border2)',
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
              >
                {theme === 'light' ? '☀ Luz' : '☾ Escuro'}
              </button>
              <input
                value={topicQuery}
                onChange={e => setTopicQuery(e.target.value)}
                placeholder="Tema da busca (ex: IA, react, backend)..."
                style={{
                  width: isCompact ? '100%' : 270, flex: isCompact ? '1 1 100%' : 'none', padding: '8px 12px',
                  borderRadius: 8, border: '1px solid var(--border2)',
                  background: 'var(--paper)', color: 'var(--text)',
                  fontSize: 11, outline: 'none',
                }}
              />
              <div style={{ fontSize: 10, letterSpacing: '0.08em', color: 'var(--muted)', background: 'var(--paper2)', padding: '5px 12px', borderRadius: 20, border: '1px solid var(--border)' }}>
                {today}
              </div>
              <button onClick={handleFetch} disabled={loading} style={{
                padding: '9px 22px', background: 'var(--ink)', color: 'var(--gold2)',
                border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 500,
                letterSpacing: '0.08em', opacity: loading ? 0.4 : 1, cursor: loading ? 'not-allowed' : 'pointer',
              }}>
                ▶ Buscar Agora
              </button>
            </div>
          </div>

          <div style={{ padding: isCompact ? '16px 14px 20px' : '28px 32px' }}>
            {activePanel === 'dashboard' && (
              <Dashboard items={items} savedIds={savedIds} history={history} isCompact={isCompact} />
            )}
            {activePanel === 'content' && (
              <ContentGrid items={items} savedIds={savedIds} toggleSave={toggleSave} onToLinkedIn={goToLinkedIn} externalSearch={activeTopic} />
            )}
            {activePanel === 'recommendations' && (
              <Recommendations items={recommendedItems} onRefresh={refreshRecommendations} />
            )}
            {activePanel === 'saved' && (
              <Saved items={items} savedIds={savedIds} toggleSave={toggleSave} onToLinkedIn={goToLinkedIn} />
            )}
            {activePanel === 'linkedin' && (
              <LinkedInHelper items={items} initialItem={linkedInItem} isCompact={isCompact} />
            )}
            {activePanel === 'setup' && (
              <Setup config={config} saveConfig={saveConfig} isCompact={isCompact} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
