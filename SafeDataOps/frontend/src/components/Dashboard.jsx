import { useState, useEffect } from 'react'
import { AlertTriangle, TrendingDown, Users, MapPin, Clock, Database } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#1F3864','#2E5496','#4472C4','#70AD47','#ED7D31','#FFC000','#FF0000','#7030A0']

const API = import.meta.env.PROD ? '' : 'http://localhost:8000'

export default function Dashboard() {
  const [resumen, setResumen]     = useState(null)
  const [loading, setLoading]     = useState(true)
  const [anio, setAnio]           = useState('2023')
  const [localidad, setLocalidad] = useState('')

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
      background: '#fff', borderRadius: '12px', padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex',
      alignItems: 'center', gap: '16px', flex: 1
    }}>
      <div style={{
        background: color + '18', borderRadius: '10px',
        padding: '12px', display: 'flex'
      }}>
        <Icon size={24} color={color} />
      </div>
      <div>
        <div style={{ fontSize: '24px', fontWeight: 700, color: '#1F3864' }}>
          {value}
        </div>
        <div style={{ fontSize: '13px', color: '#64748b' }}>{label}</div>
      </div>
    </div>
  )

  return (
    <div>
      {/* Título y filtros */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1F3864' }}>
            Panel de control — Incidentes NUSE 123
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            Fuente: Secretaría Distrital de Seguridad · Datos Abiertos Bogotá
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select value={anio} onChange={e => setAnio(e.target.value)} style={{
            padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1',
            background: '#fff', fontSize: '14px', color: '#1F3864'
          }}>
            {['2021','2022','2023'].map(a => <option key={a}>{a}</option>)}
          </select>
          <select value={localidad} onChange={e => setLocalidad(e.target.value)} style={{
            padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1',
            background: '#fff', fontSize: '14px', color: '#1F3864'
          }}>
            <option value=''>Todas las localidades</option>
            {LOCALIDADES.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
          Consultando NUSE 123...
        </div>
      ) : resumen && (
        <>
          {/* KPIs */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {statCard('Total incidentes', resumen.total_incidentes?.toLocaleString('es-CO'), AlertTriangle, '#1F3864')}
            {statCard('Localidades', resumen.por_localidad?.length, MapPin, '#2E5496')}
            {statCard('Tipo más frecuente', resumen.por_tipo?.[0]?.tipo?.split(' ').slice(0,1).join(''), TrendingDown, '#ED7D31')}
            {statCard('Meses con datos', resumen.por_mes?.length, Clock, '#70AD47')}
          </div>

          {/* Gráficas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            {/* Por localidad */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1F3864', marginBottom: '16px' }}>
                Incidentes por localidad
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={resumen.por_localidad?.slice(0,8)} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="localidad" type="category" tick={{ fontSize: 10 }} width={110} />
                  <Tooltip formatter={v => v.toLocaleString('es-CO')} />
                  <Bar dataKey="incidentes" fill="#2E5496" radius={[0,4,4,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Por tipo */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1F3864', marginBottom: '16px' }}>
                Distribución por tipo de incidente
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={resumen.por_tipo?.slice(0,6)} dataKey="incidentes" nameKey="tipo"
                    cx="50%" cy="50%" outerRadius={90} label={({ tipo, percent }) =>
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
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1F3864', marginBottom: '16px' }}>
              Tendencia mensual de incidentes — {anio}
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={resumen.por_mes?.map(m => ({
                mes: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][m.mes-1],
                incidentes: m.incidentes
              }))}>
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={v => v.toLocaleString('es-CO')} />
                <Bar dataKey="incidentes" fill="#1F3864" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Fuente */}
          <div style={{
            marginTop: '16px', padding: '12px 16px', background: '#eff6ff',
            borderRadius: '8px', border: '1px solid #bfdbfe',
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1e40af'
          }}>
            <Database size={14} />
            <span>
              <strong>Fuente oficial:</strong> {resumen.fuente} ·
              <a href="https://datosabiertos.bogota.gov.co/dataset/incidentes"
                target="_blank" rel="noreferrer" style={{ color: '#1e40af', marginLeft: '4px' }}>
                Datos Abiertos Bogotá
              </a> · Licencia CC-BY-SA 4.0
            </span>
          </div>
        </>
      )}
    </div>
  )
}
