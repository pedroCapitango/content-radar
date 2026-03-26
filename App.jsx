import { useState } from 'react'
import './index.css'

// panels (vamos construir cada um no passo seguinte)
const PANELS = ['dashboard', 'content', 'saved', 'linkedin', 'setup']

const panelTitles = {
  setup: 'Configuração',
  dashboard: 'Dashboard',
  content: 'Conteúdo',
  saved: 'Guardados',
  linkedin: 'LinkedIn Helper',
}

const navItems = [
  { id: 'setup', icon: '⚙', label: 'Configuração' },
  { id: 'dashboard', icon: '◈', label: 'Dashboard' },
  { id: 'content', icon: '◫', label: 'Conteúdo' },
  { id: 'saved', icon: '★', label: 'Guardados' },
  { id: 'linkedin', icon: 'in', label: 'LinkedIn Helper' },
]

export default function App() {
  const [activePanel, setActivePanel] = useState('dashboard')
  const [savedCount, setSavedCount] = useState(0)

  const today = new Date().toLocaleDateString('pt', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* SIDEBAR */}
      <aside style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, width: 220,
        background: 'var(--ink)', display: 'flex', flexDirection: 'column',
        zIndex: 200, borderRight: '1px solid rgba(255,255,255,0.06)'
      }}>
        {/* Brand */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 900, color: 'var(--gold2)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Content<br />Radar
          </div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 4 }}>
            PRO · LinkedIn Edition
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {navItems.map(item => (
            <div
              key={item.id}
              onClick={() => setActivePanel(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '11px 20px',
                color: activePanel === item.id ? 'var(--gold2)' : 'rgba(255,255,255,0.45)',
                cursor: 'pointer',
                fontSize: 12, letterSpacing: '0.04em',
                borderLeft: activePanel === item.id ? '2px solid var(--gold)' : '2px solid transparent',
                background: activePanel === item.id ? 'rgba(232,160,32,0.08)' : 'transparent',
                transition: 'all 0.15s',
                userSelect: 'none',
              }}
            >
              <span style={{ width: 16, textAlign: 'center', fontSize: 14 }}>{item.icon}</span>
              {item.label}
              {item.id === 'saved' && savedCount > 0 && (
                <span style={{
                  marginLeft: 'auto', background: 'var(--coral)', color: '#fff',
                  fontSize: 9, padding: '2px 7px', borderRadius: 10
                }}>{savedCount}</span>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom status */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em', lineHeight: 1.8 }}>
            <span style={{
              display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
              background: 'var(--teal)', boxShadow: '0 0 6px var(--teal)',
              marginRight: 6, animation: 'blink 2.5s infinite'
            }} />
            MODO: AUTOMÁTICO<br />
            FONTES: 5 activas
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ marginLeft: 220, flex: 1 }}>

        {/* Topbar */}
        <div style={{
          background: 'var(--cream)', borderBottom: '1px solid var(--border)',
          padding: '14px 32px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100
        }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.03em' }}>
            {panelTitles[activePanel]}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              fontSize: 10, letterSpacing: '0.08em', color: 'var(--muted)',
              background: 'var(--paper2)', padding: '5px 12px',
              borderRadius: 20, border: '1px solid var(--border)'
            }}>
              {today}
            </div>
            <button style={{
              padding: '9px 22px', background: 'var(--ink)', color: 'var(--gold2)',
              border: 'none', borderRadius: 8, fontSize: 11,
              fontWeight: 500, letterSpacing: '0.08em',
            }}>
              ▶ Buscar Agora
            </button>
          </div>
        </div>

        {/* Panel placeholder */}
        <div style={{ padding: '28px 32px' }}>
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: 44, marginBottom: 16 }}>🛰️</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>
              Passo 1 completo!
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.8 }}>
              Fundação pronta — layout, design system e navegação a funcionar.<br />
              No passo 2 construímos os serviços de dados e o dashboard.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
