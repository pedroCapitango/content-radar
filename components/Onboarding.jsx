export default function Onboarding({ onDismiss }) {
    const steps = [
      { icon: '🛰️', title: 'Bem-vindo ao Content Radar PRO', desc: 'Recolhe automaticamente os melhores conteúdos de programação do Reddit, Hacker News, Dev.to, Tabnews e YouTube — tudo em português e inglês.' },
      { icon: '▶', title: 'Clica em "Buscar Agora"', desc: 'No canto superior direito. As primeiras 4 fontes funcionam sem qualquer registo ou token. Em segundos tens centenas de posts e artigos.' },
      { icon: '★', title: 'Guarda o que te interessa', desc: 'Clica em "Guardar" em qualquer card. Os itens ficam guardados localmente e podes exportar em JSON ou CSV.' },
      { icon: 'in', title: 'Cria posts para o LinkedIn', desc: 'Usa o LinkedIn Helper para gerar rascunhos prontos a publicar com base no conteúdo que encontraste.' },
    ]
  
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 600,
        background: 'rgba(26,26,46,0.7)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}>
        <div style={{
          background: 'var(--cream)', borderRadius: 24,
          border: '1px solid var(--border)', width: '100%', maxWidth: 560,
          padding: '40px 40px 32px', boxShadow: '0 32px 80px rgba(26,26,46,0.25)',
        }}>
          {/* Brand */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 4 }}>
              Content Radar
            </div>
            <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              PRO · LinkedIn Edition
            </div>
          </div>
  
          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--ink)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 16, color: 'var(--gold2)',
                  fontFamily: 'var(--serif)', fontWeight: 900,
                }}>
                  {step.icon}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 3 }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.7 }}>
                    {step.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
  
          {/* CTA */}
          <button onClick={onDismiss} style={{
            width: '100%', padding: '14px 0',
            background: 'var(--ink)', color: 'var(--gold2)',
            border: 'none', borderRadius: 12,
            fontFamily: 'var(--mono)', fontSize: 13,
            fontWeight: 500, letterSpacing: '0.08em', cursor: 'pointer',
          }}>
            ▶ Começar a usar
          </button>
  
          <p style={{ textAlign: 'center', fontSize: 10, color: 'var(--muted)', marginTop: 14 }}>
            Todos os dados ficam guardados localmente no teu browser. Sem conta, sem servidor.
          </p>
        </div>
      </div>
    )
  }