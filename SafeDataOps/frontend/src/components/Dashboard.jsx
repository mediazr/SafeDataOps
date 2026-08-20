import { useState, useEffect } from 'react'
import { AlertTriangle, MapPin, TrendingDown, Clock, Database, Info } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
         PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#1F3864','#2E5496','#4472C4','#70AD47','#ED7D31','#FFC000','#FF0000','#7030A0']
const API = import.meta.env.PROD ? '' : 'http://localhost:8000'

export default function Dashboard() {
  const [resumen, setResumen]     = useState(null)
  const [loading, setLoading]     = useState(true)
  const [anio, setAnio]           = useState('2023')
  const [localidad, setLocalidad] = useState('')

  const isMobile = window.innerWidth < 768

  useEffect(() => {
    setLoading(true)
    const url = `${API}/api/resumen?anio=${anio}${localidad ? `&localidad=${localidad}` : ''}`
    fetch(url)
      .then(r => r.json())
      .then(d => { setResumen(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [anio, localidad])

  const LOCALIDADES = [
    'SAN CRISTOBAL','KENNEDY','SUBA','CIUDAD BOLIVAR','BOSA',
    'ENGATIVA','USAQUEN','CHAPINERO','USME','FONTIBON',
    'RAFAEL URIBE URIBE','BARRIOS UNIDOS','TEUSAQUILLO'
  ]

  const statCard = (label, value, Icon, color) => (
    <div style={{
      background: '#fff', borderRadius: '12px', padding: '18px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      display: 'flex', alignItems: 'center', gap: '14px', flex: 1,
      minWidth: isMobile ? '100%' : '180px'
    }}>
      <div style={{ background: color + '18', borderRadius: '10px', padding: '10px', display: 'flex' }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <div style={{ fontSize: '22px', fontWeight: 700, color: '#1F3864' }}>{value}</div>
        <div style={{ fontSize: '12px', color: '#64748b' }}>{label}</div>
      </div>
    </div>
  )

  return (
    <div>
      {/* Hero — propuesta de valor nueva */}
      <div style={{
        background: 'linear-gradient(135deg, #1F3864 0%, #2E5496 100%)',
        borderRadius: '16px', padding: isMobile ? '20px' : '28px 32px',
        color: '#fff', marginBottom: '20px'
      }}>
        <div style={{ fontSize: isMobile ? '10px' : '11px', color: '#93c5fd',
                      textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          Sistema de inteligencia geoespacial
        </div>
        <h1 style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: 700,
                     lineHeight: '1.3', marginBottom: '12px' }}>
          Estimación y visualización de riesgo urbano
        </h1>
        <p style={{ fontSize: isMobile ? '12px' : '14px', color: '#bfdbfe',
                    lineHeight: '1.7', maxWidth: '680px', marginBottom: '20px' }}>
          SafeData transforma datos históricos y geoespaciales heterogéneos en estimaciones
          explicables de riesgo por zona, proporcionando información para apoyar la
          priorización de recursos y la toma de decisiones de seguridad.
        </p>
        {/* Métricas clave del modelo */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { label: 'R² del modelo',       value: '0.953' },
            { label: 'Registros NUSE 123',  value: '1.51M' },
            { label: 'Período de análisis', value: '2015–2026' },
            { label: 'UPZs analizadas',     value: '8 UPZs' },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.12)', borderRadius: '10px',
              padding: '10px 16px', backdropFilter: 'blur(4px)'
            }}>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>{value}</div>
              <div style={{ fontSize: '11px', color: '#93c5fd' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cómo funciona — ciclo explicable */}
      <div style={{
        background: '#fff', borderRadius: '14px', padding: '18px 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px'
      }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#1F3864', marginBottom: '14px' }}>
          Cómo genera la estimación de riesgo
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
          gap: '12px'
        }}>
          {[
            { n: '01', title: 'Ingesta de datos', desc: 'NUSE 123 + Luminarias IDECA + Estratificación DANE', color: '#2E5496' },
            { n: '02', title: 'Integración geoespacial', desc: 'Spatial Join real por coordenadas WGS84 — cada incidente hereda su contexto de manzana', color: '#0F6E56' },
            { n: '03', title: 'Estimación estadística', desc: 'XGBoost con 32 features: lags históricos, IVL lumínico, estacionalidad y tipo de incidente', color: '#92400E' },
            { n: '04', title: 'Visualización explicable', desc: 'Riesgo compuesto por UPZ con importancia de variables — interpretable para el operador', color: '#1F3864' },
          ].map(({ n, title, desc, color }) => (
            <div key={n} style={{
              padding: '14px', borderRadius: '10px',
              background: '#f8fafc', borderLeft: `3px solid ${color}`
            }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color, marginBottom: '4px',
                            letterSpacing: '1px' }}>{n}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F3864',
                            marginBottom: '6px' }}>{title}</div>
              <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filtros y KPIs */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#1F3864' }}>
          Incidentes NUSE 123 — datos reales
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select value={anio} onChange={e => setAnio(e.target.value)} style={{
            padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1',
            background: '#fff', fontSize: '13px', color: '#1F3864'
          }}>
            {['2021','2022','2023'].map(a => <option key={a}>{a}</option>)}
          </select>
          <select value={localidad} onChange={e => setLocalidad(e.target.value)} style={{
            padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1',
            background: '#fff', fontSize: '13px', color: '#1F3864'
          }}>
            <option value=''>Todas las localidades</option>
            {LOCALIDADES.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>
          Consultando NUSE 123...
        </div>
      ) : resumen && (
        <>
          {/* KPIs */}
          <div style={{ display: 'flex', gap: '14px', marginBottom: '18px', flexWrap: 'wrap' }}>
            {statCard('Total incidentes', resumen.total_incidentes?.toLocaleString('es-CO'), AlertTriangle, '#1F3864')}
            {statCard('Localidades', resumen.por_localidad?.length, MapPin, '#2E5496')}
            {statCard('Tipo más frecuente', resumen.por_tipo?.[0]?.tipo?.split(' ')[0], TrendingDown, '#ED7D31')}
            {statCard('Meses con datos', resumen.por_mes?.length, Clock, '#70AD47')}
          </div>

          {/* Gráficas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '16px', marginBottom: '16px'
          }}>
            {/* Por localidad */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '18px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F3864', marginBottom: '14px' }}>
                Incidentes por localidad
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={resumen.por_localidad?.slice(0,8)} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="localidad" type="category" tick={{ fontSize: 9 }} width={100} />
                  <Tooltip formatter={v => v.toLocaleString('es-CO')} />
                  <Bar dataKey="incidentes" fill="#2E5496" radius={[0,4,4,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Por tipo */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '18px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F3864', marginBottom: '14px' }}>
                Distribución por tipo de incidente
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={resumen.por_tipo?.slice(0,6)} dataKey="incidentes" nameKey="tipo"
                    cx="50%" cy="50%" outerRadius={85}
                    label={({ tipo, percent }) =>
                      `${tipo?.split(' ')[0]} ${(percent*100).toFixed(0)}%`
                    } labelLine={false}>
                    {resumen.por_tipo?.slice(0,6).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={v => v.toLocaleString('es-CO')} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tendencia mensual */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '18px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F3864', marginBottom: '14px' }}>
              Tendencia mensual — {anio}
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={resumen.por_mes?.map(m => ({
                mes: ['Ene','Feb','Mar','Abr','May','Jun',
                      'Jul','Ago','Sep','Oct','Nov','Dic'][m.mes-1],
                incidentes: m.incidentes
              }))}>
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={v => v.toLocaleString('es-CO')} />
                <Bar dataKey="incidentes" fill="#1F3864" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Fuente oficial */}
          <div style={{
            padding: '12px 16px', background: '#eff6ff',
            borderRadius: '8px', border: '1px solid #bfdbfe',
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '12px', color: '#1e40af'
          }}>
            <Database size={13} />
            <span>
              <strong>Fuente oficial:</strong> {resumen.fuente} ·
              <a href="https://datosabiertos.bogota.gov.co/dataset/incidentes"
                target="_blank" rel="noreferrer"
                style={{ color: '#1e40af', marginLeft: '4px' }}>
                Datos Abiertos Bogotá
              </a> · Licencia CC-BY-SA 4.0
            </span>
          </div>
        </>
      )}
    </div>
  )
}
