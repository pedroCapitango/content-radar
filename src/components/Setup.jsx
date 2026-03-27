export default function Setup({ config, saveConfig }) {
    function handleSubmit(e) {
      e.preventDefault()
      const fd = new FormData(e.target)
      saveConfig({
        subreddits: fd.get('subreddits'),
        redditSort: fd.get('redditSort'),
        redditLimit: parseInt(fd.get('redditLimit')) || 15,
        hnLimit: parseInt(fd.get('hnLimit')) || 20,
        tabnewsLimit: parseInt(fd.get('tabnewsLimit')) || 20,
        youtubeKey: fd.get('youtubeKey'),
        excludeKeywords: fd.get('excludeKeywords').split(',').map(s => s.trim()).filter(Boolean),
      })
      alert('✓ Configuração guardada!')
    }
  
    const field = (label, children) => (
      <div style={{ marginBottom: 14 }}>
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
      fontSize: 12, outline: 'none', resize: 'vertical',
    }
  
    const card = (title, children) => (
      <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 'var(--card-r)', padding: 20 }}>
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>{title}</h3>
        {children}
      </div>
    )
  
    return (
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
  
          {card('📡 Reddit', <>
            {field('Subreddits (separados por vírgula)',
              <textarea name="subreddits" rows={3} defaultValue={config.subreddits} style={inputStyle} />
            )}
            {field('Ordenar por',
              <select name="redditSort" defaultValue={config.redditSort} style={inputStyle}>
                <option value="hot">Hot (trending agora)</option>
                <option value="top">Top (melhor de sempre)</option>
                <option value="new">New (mais recente)</option>
              </select>
            )}
            {field('Máx. posts por subreddit',
              <input name="redditLimit" type="number" defaultValue={config.redditLimit} min={5} max={50} style={inputStyle} />
            )}
          </>)}
  
          {card('🎬 YouTube API', <>
            <div style={{ background: 'rgba(123,104,238,0.08)', border: '1px solid rgba(123,104,238,0.2)', borderRadius: 10, padding: '12px 14px', marginBottom: 14, fontSize: 11, color: 'var(--lavender)', lineHeight: 1.7 }}>
              Opcional. Sem key o YouTube fica desactivado mas as outras 4 fontes funcionam na mesma.{' '}
              <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" style={{ color: 'var(--lavender)', fontWeight: 500 }}>
                → Obter key gratuita
              </a>
            </div>
            {field('Google API Key',
              <input name="youtubeKey" type="password" defaultValue={config.youtubeKey} placeholder="AIzaSy..." style={inputStyle} />
            )}
            {field('Máx. itens do HN',
              <input name="hnLimit" type="number" defaultValue={config.hnLimit} min={5} max={50} style={inputStyle} />
            )}
            {field('Máx. itens do Tabnews',
              <input name="tabnewsLimit" type="number" defaultValue={config.tabnewsLimit} min={5} max={50} style={inputStyle} />
            )}
          </>)}
  
          {card('🔖 Filtros', <>
            {field('Palavras a excluir (separadas por vírgula)',
              <input name="excludeKeywords" type="text" defaultValue={config.excludeKeywords?.join(', ')} placeholder="crypto, nft, spam..." style={inputStyle} />
            )}
            <div style={{ background: 'rgba(26,158,143,0.08)', border: '1px solid rgba(26,158,143,0.25)', borderRadius: 10, padding: '14px 16px', marginTop: 8, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0, marginTop: 3, animation: 'blink 2s infinite' }} />
              <p style={{ fontSize: 11, color: 'var(--text)', lineHeight: 1.6 }}>
                Reddit, HN, Dev.to e Tabnews funcionam <strong style={{ color: 'var(--teal)' }}>sem qualquer token</strong>. Apenas o YouTube precisa de API key.
              </p>
            </div>
          </>)}
  
          {card('ℹ️ Sobre as fontes', <>
            {[
              { name: 'Reddit', desc: 'API pública · sem registo', color: '#ff4500' },
              { name: 'Hacker News', desc: 'API Firebase · sem registo', color: '#ff6600' },
              { name: 'Dev.to', desc: 'API pública · sem registo', color: '#08a2c8' },
              { name: 'Tabnews', desc: 'API pública · português BR', color: 'var(--teal)' },
              { name: 'YouTube', desc: 'Requer API key Google', color: '#ff0000' },
            ].map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{s.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </>)}
        </div>
  
        <button type="submit" style={{
          padding: '12px 32px', background: 'var(--ink)', color: 'var(--gold2)',
          border: 'none', borderRadius: 8, fontFamily: 'var(--mono)',
          fontSize: 13, cursor: 'pointer', letterSpacing: '0.08em',
        }}>
          💾 Guardar Configuração
        </button>
      </form>
    )
  }