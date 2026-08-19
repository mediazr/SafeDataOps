import { Shield, Map, BarChart2 } from 'lucide-react'

const NAV = [
  { id: 'dashboard', label: 'Inicio',          Icon: Shield },
  { id: 'mapa',      label: 'Mapa de riesgo',  Icon: Map },
  { id: 'metricas',  label: 'Métricas NUSE',   Icon: BarChart2 },
]

export default function Header({ vista, setVista }) {
  return (
    <header style={{
      background: '#1F3864', color: '#fff',
      padding: '0 24px', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      height: '64px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Shield size={28} color="#60a5fa" />
        <div>
          <div style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '0.5px' }}>
            SafeData Ops
          </div>
          <div style={{ fontSize: '11px', color: '#93c5fd', marginTop: '-2px' }}>
            Analítica de riesgo urbano · Bogotá D.C.
          </div>
        </div>
      </div>

      <nav style={{ display: 'flex', gap: '4px' }}>
        {NAV.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setVista(id)} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '8px', border: 'none',
            cursor: 'pointer', fontSize: '14px', fontWeight: 500,
            background: vista === id ? '#2E5496' : 'transparent',
            color: vista === id ? '#fff' : '#93c5fd',
            transition: 'all 0.2s'
          }}>
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      <div style={{ fontSize: '12px', color: '#93c5fd', textAlign: 'right' }}>
        <div>Fuente: NUSE 123 · IDECA</div>
        <div>Datos Abiertos Bogotá</div>
      </div>
    </header>
  )
}
