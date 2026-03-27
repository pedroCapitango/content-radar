export default function KpiCard({ label, value, delta, color = 'var(--text)' }) {
    return (
      <div style={{
        background: 'var(--cream)', border: '1px solid var(--border)',
        borderRadius: 'var(--card-r)', padding: '18px 20px',
      }}>
        <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
          {label}
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, color }}>
          {value}
        </div>
        {delta && (
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>
            {delta}
          </div>
        )}
      </div>
    )
  }