import { useState, useEffect, useRef } from 'react'
import { Info, Database, Cpu } from 'lucide-react'
import L from 'leaflet'

const API = import.meta.env.PROD ? '' : 'http://localhost:8000'
const MESES = ['','Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function getColor(riesgo) {
  if (riesgo >= 0.65) return '#dc2626'
  if (riesgo >= 0.45) return '#ea580c'
  if (riesgo >= 0.25) return '#f59e0b'
  return '#22c55e'
}

export default function MapaRiesgo() {
  const mapRef     = useRef(null)
  const leafletRef = useRef(null)
  const heatRef    = useRef(null)
  const markersRef = useRef([])

  const [datos,    setDatos]    = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [selected, setSelected] = useState(null)
  const [anio,     setAnio]     = useState(2025)
  const [mes,      setMes]      = useState(7)
  const [modo,     setModo]     = useState('calor') // 'calor' | 'puntos'

  // Init mapa
  useEffect(() => {
    if (leafletRef.current || !mapRef.current) return
    const map = L.map(mapRef.current, { center: [4.5526, -74.0838], zoom: 13 })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap | IDECA Bogotá', maxZoom: 18
    }).addTo(map)
    leafletRef.current = map
    return () => { if (leafletRef.current) { leafletRef.current.remove(); leafletRef.current = null } }
  }, [])

  // Cargar datos
  useEffect(() => {
    setLoading(true)
    fetch(`${API}/api/riesgo/san-cristobal?anio=${anio}&mes=${mes}`)
      .then(r => r.json())
      .then(d => { setDatos(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [anio, mes])

  // Dibujar mapa de calor o puntos
  useEffect(() => {
    if (!leafletRef.current || !datos?.upzs) return
    const map = leafletRef.current

    // Limpiar todo
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []
    if (heatRef.current) { map.removeLayer(heatRef.current); heatRef.current = null }

    map.setView([4.5526, -74.0838], 13)

    if (modo === 'calor') {
      // Mapa de calor: expandir cada UPZ en múltiples puntos según riesgo
      const puntos = []
      datos.upzs.forEach(upz => {
        const intensidad = upz.riesgo
        const n = Math.max(3, Math.round(intensidad * 20))
        for (let i = 0; i < n; i++) {
          const dlat = (Math.random() - 0.5) * 0.018
          const dlng = (Math.random() - 0.5) * 0.018
          puntos.push([upz.lat + dlat, upz.lng + dlng, intensidad])
        }
        // Punto central con peso máximo
        puntos.push([upz.lat, upz.lng, intensidad * 1.5])
      })

      // Usar Canvas para mapa de calor sin plugin externo
      const canvas = document.createElement('canvas')
      canvas.width = 400; canvas.height = 400
      const ctx = canvas.getContext('2d')

      // Crear gradiente de color
      const grad = ctx.createRadialGradient(200, 200, 0, 200, 200, 200)
      grad.addColorStop(0.0, 'rgba(220,38,38,0.9)')
      grad.addColorStop(0.3, 'rgba(234,88,12,0.7)')
      grad.addColorStop(0.6, 'rgba(245,158,11,0.5)')
      grad.addColorStop(1.0, 'rgba(34,197,94,0.0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 400, 400)

      // Dibujar círculos de calor por UPZ
      datos.upzs.forEach(upz => {
        const latLng = L.latLng(upz.lat, upz.lng)
        const radius = 400 + upz.riesgo * 600
        const color  = getColor(upz.riesgo)

        const circle = L.circle(latLng, {
          radius,
          fillColor: color,
          color: 'transparent',
          fillOpacity: 0.35,
          interactive: false
        }).addTo(map)
        markersRef.current.push(circle)

        // Círculo interior más intenso
        const inner = L.circle(latLng, {
          radius: radius * 0.4,
          fillColor: color,
          color: 'transparent',
          fillOpacity: 0.5,
          interactive: false
        }).addTo(map)
        markersRef.current.push(inner)

        // Marcador clickeable encima
        const marker = L.circleMarker(latLng, {
          radius: 8,
          fillColor: color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        })
        .bindTooltip(`<strong>${upz.upz}</strong><br/>
          Riesgo: <b>${(upz.riesgo*100).toFixed(0)}%</b> — ${upz.nivel_riesgo}<br/>
          Predicción: <b>${upz.prediccion_incidentes?.toLocaleString('es-CO')}</b> incidentes<br/>
          IVL: ${upz.ivl?.toLocaleString('es-CO')}`, { sticky: true })
        .on('click', () => setSelected(upz))
        .addTo(map)
        markersRef.current.push(marker)
      })

    } else {
      // Modo puntos clásico
      datos.upzs.forEach(upz => {
        const color  = getColor(upz.riesgo)
        const radius = 8 + upz.riesgo * 18
        const m = L.circleMarker([upz.lat, upz.lng], {
          radius, fillColor: color, color: '#fff', weight: 2,
          opacity: 0.95, fillOpacity: 0.8
        })
        .bindTooltip(`<strong>${upz.upz}</strong><br/>
          Riesgo: ${(upz.riesgo*100).toFixed(0)}% — ${upz.nivel_riesgo}`, { sticky: true })
        .on('click', () => setSelected(upz))
        .addTo(map)
        markersRef.current.push(m)
      })
    }
  }, [datos, modo])

  const isMobile = window.innerWidth < 768

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: 700, color: '#1F3864' }}>
          Mapa de riesgo — San Cristóbal
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px',
                      flexWrap: 'wrap' }}>
          <Cpu size={13} color="#2E5496" />
          <span style={{ color: '#2E5496', fontSize: '12px', fontWeight: 600 }}>
            Modelo XGBoost · R²=0.953 · 1.5M registros NUSE 123
          </span>
        </div>
      </div>

      {/* Controles */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <select value={mes} onChange={e => setMes(+e.target.value)} style={{
          padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1',
          background: '#fff', fontSize: '13px', color: '#1F3864'
        }}>
          {MESES.slice(1).map((m,i) => <option key={i+1} value={i+1}>{m}</option>)}
        </select>
        <select value={anio} onChange={e => setAnio(+e.target.value)} style={{
          padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1',
          background: '#fff', fontSize: '13px', color: '#1F3864'
        }}>
          {[2024,2025,2026].map(a => <option key={a}>{a}</option>)}
        </select>
        <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden',
                      border: '1px solid #cbd5e1' }}>
          {['calor','puntos'].map(m => (
            <button key={m} onClick={() => setModo(m)} style={{
              padding: '8px 14px', border: 'none', cursor: 'pointer', fontSize: '13px',
              background: modo === m ? '#1F3864' : '#fff',
              color: modo === m ? '#fff' : '#64748b',
              fontWeight: modo === m ? 600 : 400
            }}>
              {m === 'calor' ? '🌡 Calor' : '⬤ Puntos'}
            </button>
          ))}
        </div>
      </div>

      {/* Layout responsivo */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 280px',
        gap: '16px'
      }}>
        {/* Mapa */}
        <div style={{ borderRadius: '12px', overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'relative' }}>
          {loading && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(255,255,255,0.88)', zIndex: 999,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '10px'
            }}>
              <Cpu size={26} color="#2E5496" />
              <span style={{ fontSize: '14px', color: '#1F3864', fontWeight: 600 }}>
                Calculando estimación de riesgo...
              </span>
            </div>
          )}
          <div ref={mapRef} style={{ height: isMobile ? '320px' : '500px', width: '100%' }} />
        </div>

        {/* Panel lateral */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Leyenda */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '14px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#1F3864', marginBottom: '10px' }}>
              Nivel de riesgo
            </div>
            <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '8px' }}>
              70% predicción · 30% IVL luminarias
            </div>
            {[
              { label: 'Alto ≥65%',      color: '#dc2626' },
              { label: 'Medio-alto 45%', color: '#ea580c' },
              { label: 'Moderado 25%',   color: '#f59e0b' },
              { label: 'Bajo <25%',      color: '#22c55e' },
            ].map(({ label, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center',
                                        gap: '8px', marginBottom: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%',
                              background: color, flexShrink: 0 }} />
                <span style={{ fontSize: '11px', color: '#374151' }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Ranking */}
          {datos && (
            <div style={{ background: '#fff', borderRadius: '12px', padding: '14px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#1F3864', marginBottom: '10px' }}>
                Ranking UPZ — {MESES[mes]} {anio}
              </div>
              {datos.upzs?.map((u, i) => (
                <div key={u.upz} onClick={() => setSelected(u)} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '5px 6px', borderRadius: '6px', marginBottom: '3px',
                  cursor: 'pointer',
                  background: selected?.upz === u.upz ? '#eff6ff' : 'transparent'
                }}>
                  <span style={{ fontSize: '10px', color: '#94a3b8', width: '14px' }}>{i+1}</span>
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%',
                                background: getColor(u.riesgo), flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#1F3864',
                                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {u.upz}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>
                      {u.prediccion_incidentes?.toLocaleString('es-CO')} pred.
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: getColor(u.riesgo) }}>
                    {(u.riesgo * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Detalle */}
          {selected && (
            <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '14px',
                          border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e40af', marginBottom: '8px' }}>
                <Info size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                {selected.upz}
              </div>
              <div style={{ fontSize: '11px', color: '#1e3a5f', lineHeight: '1.9' }}>
                <div>Nivel: <strong style={{ color: getColor(selected.riesgo) }}>
                  {selected.nivel_riesgo}</strong></div>
                <div>Riesgo: <strong>{(selected.riesgo*100).toFixed(1)}%</strong></div>
                <div>Predicción: <strong>{selected.prediccion_incidentes?.toLocaleString('es-CO')}</strong></div>
                <div>Histórico: <strong>{selected.incidentes_historicos?.toLocaleString('es-CO')}</strong></div>
                <div>IVL: <strong>{selected.ivl?.toLocaleString('es-CO')}</strong></div>
              </div>
            </div>
          )}

          {/* Fuente */}
          <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '10px',
                        fontSize: '10px', color: '#64748b', lineHeight: '1.7' }}>
            <Database size={10} style={{ marginRight: '3px', verticalAlign: 'middle' }} />
            NUSE 123 · Luminarias UAESP · CC-BY-SA 4.0
          </div>
        </div>
      </div>

      {/* Footer modelo */}
      {datos && (
        <div style={{
          marginTop: '14px', padding: '12px 16px', background: '#f0fdf4',
          borderRadius: '10px', border: '1px solid #86efac',
          fontSize: '12px', color: '#166534', display: 'flex', gap: '8px'
        }}>
          <Cpu size={16} style={{ flexShrink: 0 }} />
          <span><strong>{datos.modelo}</strong> · Variables: lags 1/2/3/12 meses,
          media móvil 3M, IVL luminarias, estacionalidad, UPZ y tipo de incidente.</span>
        </div>
      )}
    </div>
  )
}
