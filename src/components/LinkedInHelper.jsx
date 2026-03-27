import { useState, useEffect } from 'react'

const drafts = {
  opinion: t => `🔥 ${t}\n\nEsta foi a discussão mais quente esta semana — e ela diz muito sobre para onde o mercado tech está a ir.\n\nA minha perspectiva como dev:\n\n1️⃣ [ponto 1]\n2️⃣ [ponto 2]\n3️⃣ [ponto 3]\n\nO que é que vocês acham? 👇\n\n#programação #backend #angola #tech`,
  tutorial: t => `📚 ${t}\n\nAntes de ler, aprendi estes 3 conceitos que ninguém te ensina na faculdade:\n\n→ [conceito 1 com exemplo]\n→ [conceito 2 com exemplo]\n→ [conceito 3 com exemplo]\n\nLink nos comentários.\n\n#programação #backend #learnprogramming #Angola`,
  meme: t => `😂 "${t}"\n\nSe isto te fez rir, és definitivamente um dev.\n\nMas a verdade por trás do meme:\n\n▶ [insight real]\n▶ [como evitar este problema]\n\nO humor na programação existe por uma razão 😅\n\n#ProgrammerHumor #dev #backend #Angola`,
  angola: t => `🇦🇴 ${t}\n\nEsta tendência global está a chegar a Angola — e quem se preparar agora vai sair à frente.\n\n✅ [mudança 1]\n✅ [mudança 2]\n✅ [oportunidade para devs angolanos]\n\n#AngolaDigital #TechAngola #backend #IA`,
  thread: t => `🧵 Thread: ${t}\n\n1/ Este tópico está a explodir esta semana. Vou resumir em 5 pontos:\n\n2/ [ponto 1]\n\n3/ [ponto 2]\n\n4/ [ponto 3]\n\n5/ [conclusão]\n\nSalva este post 🔖\n\n#programação #backend #IA #Angola`,
}

const calendarDays = [
  { day: 'S', type: '🛠 Tutorial técnico',    hint: 'Usa artigos e docs guardados',       color: 'var(--teal)' },
  { day: 'T', type: '🔥 Opinião / Hot take',  hint: 'Inspira-te nas discussões do Reddit', color: 'var(--coral)' },
  { day: 'Q', type: '🤣 Meme + insight',      hint: 'Meme viral + perspectiva local',      color: 'var(--gold)' },
  { day: 'Q', type: '🇦🇴 Angola Tech',        hint: 'Tech local + tendência global',       color: 'var(--lavender)' },
  { day: 'S', type: '📦 Ferramenta da semana',hint: 'Baseado nos docs recolhidos',         color: 'var(--ink3)' },
]

export default function LinkedInHelper({ items, initialItem }) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState('opinion')
  const [draft, setDraft] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (initialItem) {
      setTitle(initialItem.title.slice(0, 80))
      setType(initialItem.type === 'meme' ? 'meme' : initialItem.type === 'discussion' ? 'opinion' : 'tutorial')
    }
  }, [initialItem])

  const memes = items.filter(i => i.type === 'meme').slice(0, 2)
  const articles = items.filter(i => i.type === 'article').slice(0, 2)
  const discussions = items.filter(i => i.type === 'discussion').slice(0, 1)

  const ideas = [
    memes[0] && `😄 Gancho com meme: "${memes[0].title.slice(0, 55)}…" — liga ao contexto local`,
    articles[0] && `📖 Resume em 3 pontos: "${articles[0].title.slice(0, 55)}…"`,
    discussions[0] && `🔥 Hot take baseado em: "${discussions[0].title.slice(0, 55)}…"`,
    '🇦🇴 Perspectiva única: compara tendência global com Angola/Luanda',
    '📌 "Esta semana no Reddit de programação — 3 coisas que deves saber"',
  ].filter(Boolean)

  function generate() {
    const t = title || 'Tendência tech desta semana'
    setDraft((drafts[type] || drafts.opinion)(t))
  }

  function copy() {
    if (!draft.trim()) return
    navigator.clipboard.writeText(draft).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const field = (label, children) => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  )

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'var(--paper)', border: '1px solid var(--border2)',
    borderRadius: 8, color: 'var(--text)', fontFamily: 'var(--mono)',
    fontSize: 12, outline: 'none',
  }

  const card = (title, children) => (
    <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 'var(--card-r)', padding: 20 }}>
      <h3 style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 700, marginBottom: 14, color: 'var(--text)' }}>{title}</h3>
      {children}
    </div>
  )

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'var(--ink)', borderRadius: 'var(--card-r)',
        padding: '28px 32px', marginBottom: 24, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--serif)', fontSize: 120, fontWeight: 900, color: 'rgba(255,255,255,0.03)', lineHeight: 1, userSelect: 'none' }}>
          in
        </div>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 900, color: 'var(--gold2)', marginBottom: 8, letterSpacing: '-0.03em' }}>
          LinkedIn Content Helper
        </h2>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', maxWidth: 500, lineHeight: 1.7 }}>
          Transforma os memes e artigos que encontraste em posts de alta performance. Foco em programação, Backend, IA e o mercado tech angolano.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* Ideias */}
        {card('💡 Ideias de Posts da Semana',
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ideas.map((idea, i) => (
              <div key={i} onClick={() => setTitle(idea.replace(/^[^ ]+ /, '').split('"')[1] || idea)} style={{
                padding: '10px 14px', background: 'var(--paper)',
                border: '1px solid var(--border)', borderLeft: '3px solid var(--gold)',
                borderRadius: 8, fontSize: 11, color: 'var(--text)',
                lineHeight: 1.6, cursor: 'pointer', transition: 'all 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderLeftColor = 'var(--coral)'}
                onMouseLeave={e => e.currentTarget.style.borderLeftColor = 'var(--gold)'}
              >
                {idea}
              </div>
            ))}
          </div>
        )}

        {/* Calendário */}
        {card('📅 Calendário Editorial',
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {calendarDays.map((d, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 8,
                border: '1px solid var(--border)', background: 'var(--paper)',
              }}>
                <span style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 900, color: 'var(--paper2)', width: 20, flexShrink: 0 }}>{d.day}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)' }}>{d.type}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>{d.hint}</div>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gerador */}
      <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 'var(--card-r)', padding: 20 }}>
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>
          ✍ Gerador de Rascunho
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            {field('Título / Tema',
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Vibe coding está a matar as soft skills?" style={inputStyle} />
            )}
            {field('Tipo de post',
              <select value={type} onChange={e => setType(e.target.value)} style={inputStyle}>
                <option value="opinion">Opinião / Hot take</option>
                <option value="tutorial">Tutorial / Aprendizagem</option>
                <option value="meme">Meme + Insight</option>
                <option value="angola">Angola Tech</option>
                <option value="thread">Thread / Carrossel</option>
              </select>
            )}
            <button onClick={generate} style={{
              width: '100%', padding: 11, background: 'var(--ink)', color: 'var(--gold2)',
              border: 'none', borderRadius: 8, fontFamily: 'var(--mono)',
              fontSize: 11, cursor: 'pointer', letterSpacing: '0.08em',
            }}>
              ✦ Gerar Rascunho
            </button>
          </div>
          <div>
            {field('Rascunho gerado',
              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder="O rascunho aparece aqui..."
                rows={7}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }}
              />
            )}
            <button onClick={copy} style={{
              width: '100%', marginTop: 8, padding: 9,
              border: '1px solid var(--border2)', background: copied ? 'var(--teal)' : 'transparent',
              color: copied ? '#fff' : 'var(--text)',
              fontFamily: 'var(--mono)', fontSize: 11, borderRadius: 8, cursor: 'pointer',
              transition: 'all 0.2s',
            }}>
              {copied ? '✓ Copiado!' : '⎘ Copiar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}