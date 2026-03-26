import { useEffect, useState } from 'react'
import ContentModal from './ContentModal'

const fmt = n => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n)

const typeEmoji = { meme: '🤣', article: '📄', doc: '📚', discussion: '💬' }
const typeLabel = { meme: 'Meme', article: 'Artigo', doc: 'Documentação', discussion: 'Discussão' }
const sourceBadge = { reddit: '▲ Reddit', hackernews: '◆ HN', devto: '◎ Dev.to', tabnews: '◉ Tabnews', youtube: '▶ YouTube' }
const sourceColor = { reddit: '#ff4500', hackernews: '#ff6600', devto: '#08a2c8', tabnews: 'var(--teal)', youtube: '#ff0000' }

const FILTERS = [
  { id: 'all',        label: 'Todos' },
  { id: 'meme',       label: '🤣 Memes' },
  { id: 'article',    label: '📄 Artigos' },
  { id: 'doc',        label: '📚 Docs' },
  { id: 'discussion', label: '💬 Discussões' },
  { id: 'reddit',     label: '▲ Reddit' },
  { id: 'hackernews', label: '◆ HN' },
  { id: 'devto',      label: '◎ Dev.to' },
  { id: 'tabnews',    label: '◉ Tabnews' },
  { id: 'youtube',    label: '▶ YouTube' },
]

const SORTS = [
  { id: 'upvotes',  label: '🔥 Mais viral' },
  { id: 'recent',   label: '🕐 Mais recente' },
  { id: 'comments', label: '💬 Mais comentado' },
]

export default function ContentGrid({ items, savedIds, toggleSave, onToLinkedIn, externalSearch = '' }) {
  const [filter, setFilter]   = useState('all')
  const [sort, setSort]       = useState('upvotes')
  const [search, setSearch]   = useState('')
  const [modal, setModal]     = useState(null)

  useEffect(() => {
    setSearch(externalSearch || '')
  }, [externalSearch])

  const filtered = items
    .filter(item => {
      if (filter === 'all') return true
      if (['meme','article','doc','discussion'].includes(filter)) return item.type === filter
      return item.source === filter
    })
    .filter(item => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return item.title.toLowerCase().includes(q) || item.body?.toLowerCase().includes(q)
    })
    .sort((a, b) => {
      if (sort === 'upvotes')  return b.upvotes - a.upvotes
      if (sort === 'comments') return b.comments - a.comments
      return 0
    })

  return (
    <div>
      {modal && (
        <ContentModal
          item={modal}
          saved={savedIds.has(modal.id)}
          onSave={() => toggleSave(modal.id)}
          onClose={() => setModal(null)}
          onToLinkedIn={() => { onToLinkedIn(modal); setModal(null) }}
        />
      )}

      {/* BARRA DE CONTROLO */}
      <div style={{ marginBottom: 20 }}>

        {/* Pesquisa */}
        <div style={{ marginBottom: 12, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--muted)' }}>
            🔍
          </span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Pesquisar títulos e descrições..."
            style={{
              width: '100%', padding: '10px 14px 10px 38px',
              background: 'var(--cream)', border: '1px solid var(--border2)',
              borderRadius: 10, color: 'var(--text)', fontFamily: 'var(--mono)',
              fontSize: 12, outline: 'none',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', color: 'var(--muted)', fontSize: 16, cursor: 'pointer',
            }}>×</button>
          )}
        </div>

        {/* Filtros + ordenação */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding: '6px 14px', borderRadius: 20,
              border: `1px solid ${filter === f.id ? 'var(--ink)' : 'var(--border2)'}`,
              background: filter === f.id ? 'var(--ink)' : 'transparent',
              color: filter === f.id ? 'var(--gold2)' : 'var(--muted)',
              fontFamily: 'var(--mono)', fontSize: 11, cursor: 'pointer',
              transition: 'all 0.15s',
            }}>
              {f.label}
            </button>
          ))}

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, color: 'var(--muted)' }}>{filtered.length} itens</span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{
                padding: '6px 12px', background: 'var(--cream)',
                border: '1px solid var(--border2)', borderRadius: 8,
                fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text)',
                cursor: 'pointer', outline: 'none',
              }}
            >
              {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* GRID */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>
            {search ? '🔍' : '🛰️'}
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.8 }}>
            {search
              ? `Nenhum resultado para "${search}"`
              : 'Clica em ▶ Buscar Agora para recolher conteúdo'}
          </p>
        </div>
      ) : (
        <div style={{ columns: '3 300px', columnGap: 16 }}>
          {filtered.map(item => (
            <ContentCard
              key={item.id}
              item={item}
              saved={savedIds.has(item.id)}
              onSave={() => toggleSave(item.id)}
              onOpen={() => setModal(item)}
              onToLinkedIn={() => onToLinkedIn(item)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ContentCard({ item, saved, onSave, onOpen, onToLinkedIn }) {
  const ph = { meme: '😂', article: '📄', doc: '📚', discussion: '💬' }

  return (
    <div
      style={{
        breakInside: 'avoid', background: 'var(--cream)',
        border: '1px solid var(--border)', borderRadius: 'var(--card-r)',
        overflow: 'hidden', marginBottom: 16, cursor: 'pointer',
        transition: 'transform 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
      onClick={onOpen}
    >
      {/* Header */}
      <div style={{ padding: '10px 14px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Badge type={item.type} />
        <SourceBadge source={item.source} />
      </div>

      {/* Imagem ou placeholder */}
      {item.image ? (
        <img
          src={item.image} alt=""
          style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block', marginTop: 10 }}
          onError={e => { e.target.style.display = 'none' }}
        />
      ) : (
        <div style={{ width: '100%', height: 70, background: 'var(--paper2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginTop: 10 }}>
          {ph[item.type] || '📌'}
        </div>
      )}

      {/* Body */}
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 14, fontWeight: 700, lineHeight: 1.3, color: 'var(--text)', marginBottom: 6 }}>
          {item.title.slice(0, 90)}{item.title.length > 90 ? '…' : ''}
        </div>
        {item.body && (
          <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {item.body}
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, fontSize: 10, color: 'var(--muted)', marginBottom: 10 }}>
          <span>▲ {fmt(item.upvotes)}</span>
          <span>💬 {fmt(item.comments)}</span>
          <span>{item.sub ? `r/${item.sub}` : `@${item.author}`}</span>
          <span>{item.date}</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
          <button onClick={onSave} style={{
            flex: 1, padding: 7, borderRadius: 7,
            border: `1px solid ${saved ? 'var(--teal)' : 'var(--border2)'}`,
            background: saved ? 'var(--teal)' : 'transparent',
            color: saved ? '#fff' : 'var(--muted)',
            fontFamily: 'var(--mono)', fontSize: 10, cursor: 'pointer',
            transition: 'all 0.15s',
          }}>
            {saved ? '★ Guardado' : '☆ Guardar'}
          </button>
          <a href={item.url} target="_blank" rel="noreferrer" style={{
            flex: 1, padding: 7, borderRadius: 7, border: '1px solid var(--border2)',
            color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 10,
            cursor: 'pointer', textAlign: 'center', textDecoration: 'none',
            transition: 'all 0.15s',
          }}>
            ↗ Ver
          </a>
          <button onClick={onToLinkedIn} style={{
            flex: 1, padding: 7, borderRadius: 7,
            border: '1px solid var(--ink)', background: 'var(--ink)',
            color: 'var(--gold2)', fontFamily: 'var(--mono)', fontSize: 10, cursor: 'pointer',
          }}>
            in Post
          </button>
        </div>
      </div>
    </div>
  )
}

function Badge({ type }) {
  const colors = {
    meme:       { bg: 'rgba(232,80,42,0.12)',   color: 'var(--coral)',   border: 'rgba(232,80,42,0.2)' },
    article:    { bg: 'rgba(26,158,143,0.1)',   color: 'var(--teal)',    border: 'rgba(26,158,143,0.2)' },
    doc:        { bg: 'rgba(123,104,238,0.1)',  color: 'var(--lavender)',border: 'rgba(123,104,238,0.2)' },
    discussion: { bg: 'rgba(232,160,32,0.1)',   color: 'var(--gold)',    border: 'rgba(232,160,32,0.25)' },
  }
  const c = colors[type] || colors.discussion
  return (
    <span style={{
      fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
      padding: '3px 9px', borderRadius: 4, fontWeight: 500,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }}>
      {typeEmoji[type]} {typeLabel[type]}
    </span>
  )
}

function SourceBadge({ source }) {
  return (
    <span style={{
      fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase',
      padding: '3px 9px', borderRadius: 4,
      background: `${sourceColor[source]}18`,
      color: sourceColor[source],
      border: `1px solid ${sourceColor[source]}33`,
    }}>
      {sourceBadge[source] || source}
    </span>
  )
}