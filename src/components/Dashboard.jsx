import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import KpiCard from './KpiCard'

Chart.register(...registerables)

const fmt = n => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n)

const typeEmoji = { meme: '🤣', article: '📄', doc: '📚', discussion: '💬' }
const typeLabel = { meme: 'Meme', article: 'Artigo', doc: 'Doc', discussion: 'Discussão' }

export default function Dashboard({ items, savedIds, history }) {
  const trendRef = useRef(null)
  const sourceRef = useRef(null)
  const typeRef = useRef(null)
  const trendChart = useRef(null)
  const sourceChart = useRef(null)
  const typeChart = useRef(null)

  const memes = items.filter(i => i.type === 'meme').length
  const articles = items.filter(i => i.type === 'article' || i.type === 'doc').length
  const topUpvotes = items.reduce((a, b) => b.upvotes > a ? b.upvotes : a, 0)
  const topItems = [...items].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5)

  // dados reais do histórico para o gráfico de tendências
  const last7 = (() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const label = d.toLocaleDateString('pt', { weekday: 'short' })
      const entry = history.find(h => h.date === d.toLocaleDateString('pt'))
      days.push({
        label,
        memes: entry?.memes || 0,
        articles: entry?.articles || 0,
        docs: entry?.docs || 0,
        discussions: entry?.discussions || 0,
      })
    }
    return days
  })()

  useEffect(() => {
    if (!trendRef.current) return
    if (trendChart.current) trendChart.current.destroy()
    trendChart.current = new Chart(trendRef.current, {
      type: 'bar',
      data: {
        labels: last7.map(d => d.label),
        datasets: [
          { label: 'Memes', data: last7.map(d => d.memes), backgroundColor: 'rgba(232,80,42,0.7)', borderRadius: 4 },
          { label: 'Artigos', data: last7.map(d => d.articles), backgroundColor: 'rgba(26,158,143,0.7)', borderRadius: 4 },
          { label: 'Docs', data: last7.map(d => d.docs), backgroundColor: 'rgba(123,104,238,0.7)', borderRadius: 4 },
          { label: 'Discussões', data: last7.map(d => d.discussions), backgroundColor: 'rgba(232,160,32,0.6)', borderRadius: 4 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'DM Mono', size: 11 }, color: '#8f9ab2' } },
          y: { grid: { color: 'rgba(159,175,201,0.18)' }, ticks: { font: { family: 'DM Mono', size: 11 }, color: '#8f9ab2' } },
        },
      },
    })
    return () => trendChart.current?.destroy()
  }, [history])

  useEffect(() => {
    if (!sourceRef.current) return
    if (sourceChart.current) sourceChart.current.destroy()

    const sources = ['reddit', 'hackernews', 'devto', 'tabnews', 'youtube']
    const labels = ['Reddit', 'Hacker News', 'Dev.to', 'Tabnews', 'YouTube']
    const colors = ['#ff4500', '#ff6600', '#08a2c8', '#1a9e8f', '#ff0000']
    const counts = sources.map(s => items.filter(i => i.source === s).length)

    sourceChart.current = new Chart(sourceRef.current, {
      type: 'doughnut',
      data: { labels, datasets: [{ data: counts, backgroundColor: colors, borderWidth: 0 }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { font: { family: 'DM Mono', size: 11 }, color: '#c9d2e3', padding: 12 } } },
      },
    })
    return () => sourceChart.current?.destroy()
  }, [items])

  useEffect(() => {
    if (!typeRef.current) return
    if (typeChart.current) typeChart.current.destroy()

    const types = ['meme', 'article', 'doc', 'discussion']
    const typeLabels = ['Memes', 'Artigos', 'Docs', 'Discussões']
    const typeColors = ['#e8502a', '#1a9e8f', '#7b68ee', '#e8a020']
    const counts = types.map(t => items.filter(i => i.type === t).length)

    typeChart.current = new Chart(typeRef.current, {
      type: 'doughnut',
      data: { labels: typeLabels, datasets: [{ data: counts, backgroundColor: typeColors, borderWidth: 0 }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { font: { family: 'DM Mono', size: 11 }, color: '#c9d2e3', padding: 12 } } },
      },
    })
    return () => typeChart.current?.destroy()
  }, [items])

  const card = (children) => ({
    background: 'var(--cream)', border: '1px solid var(--border)',
    borderRadius: 'var(--card-r)', padding: 20,
  })

  return (
    <div>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginBottom: 28 }}>
        <KpiCard label="Total recolhido" value={items.length} delta="itens na base de dados" color="var(--text)" />
        <KpiCard label="🤣 Memes" value={memes} color="var(--coral)" />
        <KpiCard label="📄 Artigos + Docs" value={articles} color="var(--teal)" />
        <KpiCard label="★ Guardados" value={savedIds.size} delta="na base de dados" color="var(--lavender)" />
        <KpiCard label="🔥 Top upvotes" value={fmt(topUpvotes)} color="var(--gold)" />
      </div>

      {/* Trend + Top viral */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
        <div style={card()}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>
            Volume por tipo (últimos 7 dias)
          </h3>
          <div style={{ position: 'relative', height: 220 }}>
            <canvas ref={trendRef} />
          </div>
          {history.length === 0 && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 11 }}>
              Executa uma sync para ver dados reais
            </div>
          )}
        </div>

        <div style={card()}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>
            🔥 Mais viral hoje
          </h3>
          {topItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)', fontSize: 11 }}>
              Nenhum conteúdo ainda
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {topItems.map((item, i) => (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', background: 'var(--paper)',
                  border: '1px solid var(--border)', borderRadius: 10,
                }}>
                  <span style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 900, color: 'var(--paper2)', width: 20, flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                      {typeEmoji[item.type]} {typeLabel[item.type]} · {item.source}
                    </div>
                  </div>
                  <span style={{ fontFamily: 'var(--serif)', fontSize: 13, fontWeight: 700, color: 'var(--gold)', flexShrink: 0 }}>
                    ▲{fmt(item.upvotes)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Donuts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={card()}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>
            Distribuição por fonte
          </h3>
          <div style={{ position: 'relative', height: 180 }}>
            <canvas ref={sourceRef} />
          </div>
        </div>
        <div style={card()}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>
            Distribuição por tipo
          </h3>
          <div style={{ position: 'relative', height: 180 }}>
            <canvas ref={typeRef} />
          </div>
        </div>
      </div>
    </div>
  )
}