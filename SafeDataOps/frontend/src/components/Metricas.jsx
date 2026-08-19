import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts'
import { Database, TrendingUp } from 'lucide-react'

const API = import.meta.env.PROD ? '' : 'http://localhost:8000'

const LOCALIDADES = [
  'SAN CRISTOBAL','KENNEDY','SUBA','CIUDAD BOLIVAR','BOSA',
  'ENGATIVA','USAQUEN','CHAPINERO','USME','FONTIBON',
  'RAFAEL URIBE URIBE','BARRIOS UNIDOS'
]

export default function Metricas() {
  const [datos2021, setDatos2021] = useState(null)
  const [datos2022, setDatos2022] = useState(null)
  const [datos2023, setDatos2023] = useState(null)
  const [localidad, setLocalidad] = useState('SAN CRISTOBAL')
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`${API}/api/resumen?anio=2021&localidad=${localidad}`).then(r => r.json()),
      fetch(`${API}/api/resumen?anio=2022&localidad=${localidad}`).then(r => r.json()),
      fetch(`${API}/api/resumen?anio=2023&localidad=${localidad}`).then(r => r.json()),
    ]).then(([d1, d2, d3]) => {
      setDatos2021(d1); setDatos2022(d2); setDatos2023(d3)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [localidad])

  // Construir serie mensual comparativa
  const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
  const serieMensual = MESES.map((mes, i) => {
    const getVal = (d) => d?.por_mes?.find(m => m.mes === i+1)?.incidentes || 0
    return {
      mes,
      '2021': getVal(datos2021),
      '2022': getVal(datos2022),
      '2023': getVal(datos2023),
    }
  })

  // Top tipos comparativo
  const tiposComparado = datos2023?.por_tipo?.slice(0,6).map(t => ({
    tipo: t.tipo.split(' ').slice(0,2).join(' '),
    '2021': datos2021?.por_tipo?.find(x => x.tipo === t.tipo)?.incidentes || 0,
    '2022': datos2022?.por_tipo?.find(x => x.tipo === t.tipo)?.incidentes || 0,
    '2023': t.incidentes,
  })) || []

  const pct = (a, b) => b > 0 ? (((a - b) / b) * 100).toFixed(1) : 0

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1F3864' }}>
            Métricas NUSE 123 — Análisis comparativo
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            Comparación anual 2021–2023 por localidad y tipo de incidente
          </p>
        </div>
        <select value={localidad} onChange={e => setLocalidad(e.target.value)} style={{
          padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1',
          background: '#fff', fontSize: '14px', color: '#1F3864'
        }}>
          {LOCALIDADES.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
          Consultando NUSE 123 (2021–2023)...
        </div>
      ) : (
        <>
          {/* Tarjetas resumen */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[[datos2021, '2021', '#64748b'], [datos2022, '2022', '#2E5496'], [datos2023, '2023', '#1F3864']].map(([d, año, color]) => (
              <div key={año} style={{
                background: '#fff', borderRadius: '12px', padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderTop: `4px solid ${color}`
              }}>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Total incidentes {año}</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color }}>
                  {d?.total_incidentes?.toLocaleString('es-CO') || '—'}
                </div>
                {año !== '2021' && d && (
                  <div style={{ fontSize: '12px', marginTop: '6px', color: '#64748b' }}>
                    vs {parseInt(año)-1}:
                    <span style={{
                      marginLeft: '4px', fontWeight: 600,
                      color: pct(d.total_incidentes, (año==='2022'?datos2021:datos2022)?.total_incidentes) < 0 ? '#16a34a' : '#dc2626'
                    }}>
                      {pct(d.total_incidentes, (año==='2022'?datos2021:datos2022)?.total_incidentes) > 0 ? '+' : ''}
                      {pct(d.total_incidentes, (año==='2022'?datos2021:datos2022)?.total_incidentes)}%
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tendencia mensual comparativa */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <TrendingUp size={18} color="#1F3864" />
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1F3864' }}>
                Tendencia mensual 2021–2023 — {localidad.charAt(0) + localidad.slice(1).toLowerCase()}
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={serieMensual}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={v => v.toLocaleString('es-CO')} />
                <Legend />
                <Line type="monotone" dataKey="2021" stroke="#94a3b8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="2022" stroke="#2E5496" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="2023" stroke="#1F3864" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tipos comparativo */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1F3864', marginBottom: '16px' }}>
              Principales tipos de incidente por año
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={tiposComparado}>
                <XAxis dataKey="tipo" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={v => v.toLocaleString('es-CO')} />
                <Legend />
                <Bar dataKey="2021" fill="#94a3b8" radius={[2,2,0,0]} />
                <Bar dataKey="2022" fill="#2E5496" radius={[2,2,0,0]} />
                <Bar dataKey="2023" fill="#1F3864" radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Fuente */}
          <div style={{
            padding: '12px 16px', background: '#eff6ff',
            borderRadius: '8px', border: '1px solid #bfdbfe',
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1e40af'
          }}>
            <Database size={14} />
            <span>
              <strong>Fuente oficial:</strong> Incidentes Tramitados en el C4 — NUSE 123, Secretaría Distrital de Seguridad, Convivencia y Justicia ·
              <a href="https://datosabiertos.bogota.gov.co/dataset/incidentes"
                target="_blank" rel="noreferrer" style={{ color: '#1e40af', marginLeft: '4px' }}>
                Datos Abiertos Bogotá
              </a> · CC-BY-SA 4.0
            </span>
          </div>
        </>
      )}
    </div>
  )
}
