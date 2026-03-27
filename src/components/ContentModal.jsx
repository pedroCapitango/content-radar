import { useEffect } from 'react'

const fmt = n => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n)

const typeEmoji = { meme: '🤣', article: '📄', doc: '📚', discussion: '💬' }
const typeLabel = { meme: 'Meme', article: 'Artigo', doc: 'Documentação', discussion: 'Discussão' }

export default function ContentModal({ item, saved, onSave, onClose, onToLinkedIn }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(26,26,46,0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--cream)', borderRadius: 20,
          border: '1px solid var(--border)',
          width: '100%', maxWidth: 600, maxHeight: '85vh',
          overflow: 'auto', boxShadow: '0 24px 60px rgba(26,26,46,0.2)',
        }}
      >
        {/* Modal header */}
        <div style={{
          padding: '20px 24px 0',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '3px 9px', borderRadius: 4, fontWeight: 500,
              background: 'rgba(26,158,143,0.1)', color: 'var(--teal)',
              border: '1px solid rgba(26,158,143,0.2)',
            }}>
              {typeEmoji[item.type]} {typeLabel[item.type]}
            </span>
            <span style={{
              fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '3px 9px', borderRadius: 4,
              background: 'var(--paper2)', color: 'var(--muted)',
            }}>
              {item.source}
            </span>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: 20,
            color: 'var(--muted)', cursor: 'pointer', flexShrink: 0, lineHeight: 1,
          }}>×</button>
        </div>

        {/* Imagem */}
        {item.image && (
          <img src={item.image} alt="" style={{ width: '100%', maxHeight: 280, objectFit: 'cover', marginTop: 16 }} />
        )}

        {/* Conteúdo */}
        <div style={{ padding: '20px 24px 24px' }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 900, color: 'var(--text)', lineHeight: 1.3, marginBottom: 12 }}>
            {item.title}
          </h2>

          {item.body && (
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 16 }}>
              {item.body}
            </p>
          )}

          {/* Stats */}
          <div style={{
            display: 'flex', gap: 20, padding: '14px 16px',
            background: 'var(--paper)', borderRadius: 10,
            border: '1px solid var(--border)', marginBottom: 20,
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 900, color: 'var(--gold)' }}>▲ {fmt(item.upvotes)}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>upvotes</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 900, color: 'var(--text)' }}>💬 {fmt(item.comments)}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>comentários</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginTop: 4 }}>
                {item.sub ? `r/${item.sub}` : `@${item.author}`}
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>fonte</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginTop: 4 }}>{item.date}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>data</div>
            </div>
          </div>

          {/* Acções */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onSave} style={{
              flex: 1, padding: '11px 0', borderRadius: 10,
              border: `1px solid ${saved ? 'var(--teal)' : 'var(--border2)'}`,
              background: saved ? 'var(--teal)' : 'transparent',
              color: saved ? '#fff' : 'var(--muted)',
              fontFamily: 'var(--mono)', fontSize: 12, cursor: 'pointer',
              transition: 'all 0.15s',
            }}>
              {saved ? '★ Guardado' : '☆ Guardar'}
            </button>
            <a href={item.url} target="_blank" rel="noreferrer" style={{
              flex: 1, padding: '11px 0', borderRadius: 10,
              border: '1px solid var(--border2)', color: 'var(--muted)',
              fontFamily: 'var(--mono)', fontSize: 12, cursor: 'pointer',
              textAlign: 'center', textDecoration: 'none', display: 'block',
            }}>
              ↗ Abrir original
            </a>
            <button onClick={onToLinkedIn} style={{
              flex: 1, padding: '11px 0', borderRadius: 10,
              border: '1px solid var(--ink)', background: 'var(--ink)',
              color: 'var(--gold2)', fontFamily: 'var(--mono)', fontSize: 12, cursor: 'pointer',
            }}>
              in Criar post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}