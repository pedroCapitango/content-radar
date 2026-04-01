const fmt = n => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n)

export default function Recommendations({ items, onRefresh }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 900, color: 'var(--text)' }}>
            Indicações da Tabnews
          </h2>
          <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
            Feed diário com os conteúdos novos/relevantes para hoje.
          </p>
        </div>
        <button
          onClick={() => onRefresh(true)}
          style={{
            padding: '9px 14px', borderRadius: 8,
            border: '1px solid var(--border2)', background: 'var(--paper)',
            color: 'var(--text)', fontSize: 11, cursor: 'pointer',
          }}
        >
          ↻ Atualizar indicações
        </button>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
          Ainda sem indicações da Tabnews.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 16 }}>
          {items.map(item => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              style={{
                textDecoration: 'none',
                background: 'var(--cream)', border: '1px solid var(--border)',
                borderRadius: 'var(--card-r)', padding: 14, display: 'block',
              }}
            >
              <div style={{ fontSize: 10, color: 'var(--teal)', marginBottom: 8, letterSpacing: '0.08em' }}>
                ◉ TABNEWS
              </div>
              <div style={{ fontFamily: 'var(--serif)', color: 'var(--text)', fontSize: 15, lineHeight: 1.35, marginBottom: 8 }}>
                {item.title}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 10 }}>
                {(item.body || '').slice(0, 140)}{(item.body || '').length > 140 ? '…' : ''}
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)', display: 'flex', gap: 10 }}>
                <span>▲ {fmt(item.upvotes)}</span>
                <span>💬 {fmt(item.comments)}</span>
                <span>@{item.author}</span>
                <span>{item.date}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
