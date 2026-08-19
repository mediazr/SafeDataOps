import { useState } from 'react'
import { Shield, Map, BarChart2, Users, Menu, X } from 'lucide-react'

const NAV = [
  { id: 'dashboard',  label: 'Inicio',         Icon: Shield },
  { id: 'mapa',       label: 'Mapa de riesgo', Icon: Map },
  { id: 'metricas',   label: 'Métricas NUSE',  Icon: BarChart2 },
  { id: 'segmentos',  label: 'Clientes',        Icon: Users },
]

export default function Header({ vista, setVista }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header style={{
      background: '#1F3864', color: '#fff',
      padding: '0 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      position: 'sticky', top: 0, zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1400px', margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: '60px'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={26} color="#60a5fa" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '0.3px' }}>
              SafeData Ops
            </div>
            <div style={{ fontSize: '10px', color: '#93c5fd', marginTop: '-2px' }}>
              Analítica de riesgo urbano · Bogotá D.C.
            </div>
          </div>
        </div>

        {/* Nav desktop */}
        <nav style={{ display: 'flex', gap: '4px' }}
             className="desktop-nav">
          {NAV.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setVista(id)} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', borderRadius: '8px', border: 'none',
              cursor: 'pointer', fontSize: '13px', fontWeight: 500,
              background: vista === id ? '#2E5496' : 'transparent',
              color: vista === id ? '#fff' : '#93c5fd',
              transition: 'all 0.2s'
            }}>
              <Icon size={15} />{label}
            </button>
          ))}
        </nav>

        {/* Fuente tag */}
        <div style={{ fontSize: '11px', color: '#93c5fd', textAlign: 'right',
                      display: 'none' }} className="source-tag">
          NUSE 123 · IDECA
        </div>

        {/* Hamburger mobile */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          background: 'transparent', border: 'none', color: '#93c5fd',
          cursor: 'pointer', display: 'none', padding: '4px'
        }} className="hamburger">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: '#1a3158', padding: '8px 0 12px',
          borderTop: '1px solid #2E5496'
        }}>
          {NAV.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => { setVista(id); setMenuOpen(false) }} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              width: '100%', padding: '12px 20px', border: 'none',
              background: vista === id ? '#2E5496' : 'transparent',
              color: vista === id ? '#fff' : '#93c5fd',
              cursor: 'pointer', fontSize: '14px', fontWeight: 500,
              textAlign: 'left'
            }}>
              <Icon size={16} />{label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
        @media (min-width: 769px) {
          .source-tag { display: block !important; }
        }
      `}</style>
    </header>
  )
}
