const fmt = n => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n)
const typeEmoji = { meme: '🤣', article: '📄', doc: '📚', discussion: '💬' }
const typeLabel = { meme: 'Meme', article: 'Artigo', doc: 'Documentação', discussion: 'Discussão' }

export default function Saved({ items, savedIds, toggleSave, onToLinkedIn }) {
  const saved = items.filter(i => savedIds.has(i.id))

  function exportJSON() {
    const blob = new Blob([JSON.stringify(saved, null, 2)], { type: 'application/json' })
    dl(blob, 'content-radar-saved.json')
  }

  function exportCSV() {
    const headers = ['source', 'type', 'title', 'url', 'upvotes', 'comments', 'author', 'date']
    const rows = saved.map(r => headers.map(h => `"${String(r[h] || '').replace(/"/g, '""')}"`).join(','))
    dl(new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' }), 'content-radar.csv')
  }

  function copyForLinkedIn() {
    const text = saved.map(i =>
      `[${i.type.toUpperCase()}] ${i.title}\n▲ ${fmt(i.upvotes)} · ${i.source}\n${i.url}`
    ).join('\n\n')
    navigator.clipboard.writeText(text).then(() => alert('✓ Copiado!'))
  }

  function dl(blob, name) {
    const u = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = u; a.download = name; a.click()
    URL.revokeObjectURL(u)
  }

  function clearAll() {
    if (!confirm('Remover todos os itens guardados?')) return
    saved.forEach(i => toggleSave(i.id))
  }

  const btn = (label, onClick, danger = false) => (
    <button onClick={onClick} style={{
      padding: '8px 18px', borderRadius: 8,
      border: `1px solid ${danger ? 'var(--coral)' : 'var(--border2)'}`,
      background: 'transparent', fontFamily: 'var(--mono)', fontSize: 11,
      color: danger ? 'var(--coral)' : 'var(--text)', cursor: 'pointer',
      transition: 'all 0.15s',
    }}>{label}</button>
  )

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 900, color: 'var(--text)' }}>
            Base de Dados Pessoal
          </h2>
          <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
            {saved.length} {saved.length === 1 ? 'item guardado' : 'itens guardados'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {btn('↓ JSON', exportJSON)}
          {btn('↓ CSV', exportCSV)}
          {btn('⎘ Copiar para LinkedIn', copyForLinkedIn)}
          {btn('✕ Limpar tudo', clearAll, true)}
        </div>
      </div>

      {/* Grid */}
      {saved.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted)' }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>★</div>
          <p style={{ fontSize: 12, lineHeight: 1.8 }}>
            Guarda itens no separador Conteúdo<br />para os ver aqui e exportar.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 16 }}>
          {saved.map(item => (
            <div key={item.id} style={{
              background: 'var(--cream)', border: '1px solid var(--border)',
              borderRadius: 'var(--card-r)', overflow: 'hidden',
            }}>
              <div style={{ padding: '10px 14px 0', display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 4, background: 'rgba(26,158,143,0.1)', color: 'var(--teal)', border: '1px solid rgba(26,158,143,0.2)' }}>
                  {typeEmoji[item.type]} {typeLabel[item.type]}
                </span>
                <span style={{ fontSize: 9, padding: '3px 9px', borderRadius: 4, background: 'var(--paper2)', color: 'var(--muted)' }}>
                  {item.source}
                </span>
              </div>
              <div style={{ padding: '12px 14px 14px' }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 14, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, marginBottom: 8 }}>
                  {item.title.slice(0, 80)}{item.title.length > 80 ? '…' : ''}
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: 10, color: 'var(--muted)', marginBottom: 12 }}>
                  <span>▲ {fmt(item.upvotes)}</span>
                  <span>💬 {fmt(item.comments)}</span>
                  <span>{item.date}</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => toggleSave(item.id)} style={{
                    flex: 1, padding: 7, borderRadius: 7,
                    border: '1px solid var(--teal)', background: 'var(--teal)',
                    color: '#fff', fontFamily: 'var(--mono)', fontSize: 10, cursor: 'pointer',
                  }}>★ Remover</button>
                  <a href={item.url} target="_blank" rel="noreferrer" style={{
                    flex: 1, padding: 7, borderRadius: 7, border: '1px solid var(--border2)',
                    color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 10,
                    textAlign: 'center', textDecoration: 'none', display: 'block',
                  }}>↗ Ver</a>
                  <button onClick={() => onToLinkedIn(item)} style={{
                    flex: 1, padding: 7, borderRadius: 7,
                    border: '1px solid var(--ink)', background: 'var(--ink)',
                    color: 'var(--gold2)', fontFamily: 'var(--mono)', fontSize: 10, cursor: 'pointer',
                  }}>in Post</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}