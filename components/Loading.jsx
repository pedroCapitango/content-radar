export default function Loading({ log }) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(9,12,18,0.72)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 20,
      }}>
        <div style={{
          width: 44, height: 44,
          border: '2px solid var(--border2)',
          borderTopColor: 'var(--gold)',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
        <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
          A recolher conteúdo...
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', lineHeight: 2.2, maxWidth: 360 }}>
          {log.map((line, i) => (
            <div key={i} style={{
              opacity: 0, animation: 'fadeup 0.4s forwards',
              animationDelay: `${i * 0.1}s`,
              color: line.startsWith('✓') ? 'var(--teal)' : line.startsWith('✗') ? 'var(--coral)' : 'var(--muted)',
            }}>
              {line}
            </div>
          ))}
        </div>
      </div>
    )
  }