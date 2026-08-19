import { useState, useEffect, useRef } from 'react'
import { Info, Database, Cpu } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const API = import.meta.env.PROD ? '' : 'http://localhost:8000'

const MESES = ['','Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function getColor(riesgo) {
  if (riesgo >= 0.65) return '#dc2626'
  if (riesgo >= 0.45) return '#ea580c'
  if (riesgo >= 0.25) return '#f59e0b'
  return '#22c55e'
}

function getRadius(pred) {
  if (pred > 2000) return 22
  if (pred > 1500) return 18
  if (pred > 500)  return 14
  return 10
}

export default function MapaRiesgo() {
  const mapRef     = useRef(null)
  const leafletRef = useRef(null)
  const markersRef = useRef([])

  const [datos,    setDatos]    = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [selected, setSelected] = useState(null)
  const [anio,     setAnio]     = useState(2025)
  const [mes,      setMes]      = useState(7)

  // Init mapa una sola vez
  useEffect(() => {
    if (leafletRef.current) return
    if (!mapRef.current) return

    const map = L.map(mapRef.current, {
      center: [4.5526, -74.0838],
      zoom: 13,
      zoomControl: true
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap | IDECA Bogotá',
      maxZoom: 18
    }).addTo(map)

    leafletRef.current = map

    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove()
        leafletRef.current = null
      }
    }
  }, [])

  // Cargar predicciones
  useEffect(() => {
    setLoading(true)
    fetch(`${API}/api/riesgo/san-cristobal?anio=${anio}&mes=${mes}`)
      .then(r => r.json())
      .then(d => { setDatos(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [anio, mes])

  // Dibujar marcadores
  useEffect(() => {
    if (!leafletRef.current || !datos) return

    // Limpiar marcadores anteriores
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    leafletRef.current.setView([4.5526, -74.0838], 13)

    datos.upzs?.forEach(upz => {
      const color  = getColor(upz.riesgo)
      const radius = getRadius(upz.prediccion_incidentes)

      const circle = L.circleMarker([upz.lat, upz.lng], {
        radius,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 0.95,
        fillOpacity: 0.75
      })
      .bindTooltip(`
        <strong>${upz.upz}</strong><br/>
        <b>Nivel:</b> ${upz.nivel_riesgo}<br/>
        <b>Predicción:</b> ${upz.prediccion_incidentes?.toLocaleString('es-CO')} incidentes<br/>
        <b>IVL:</b> ${upz.ivl?.toLocaleString('es-CO')}<br/>
        <b>Histórico:</b> ${upz.incidentes_historicos?.toLocaleString('es-CO')}
      `, { sticky: true })
      .on('click', () => setSelected(upz))
      .addTo(leafletRef.current)

      markersRef.current.push(circle)
    })
  }, [datos])

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1F3864' }}>
            Mapa de riesgo — San Cristóbal
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <Cpu size={14} color="#2E5496" />
            <p style={{ color: '#2E5496', fontSize: '13px', fontWeight: 600 }}>
              Modelo XGBoost · R²=0.953 · 1.5M registros NUSE 123
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select value={mes} onChange={e => setMes(+e.target.value)} style={{
            padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1',
            background: '#fff', fontSize: '14px', color: '#1F3864'
          }}>
            {MESES.slice(1).map((m,i) => <option key={i+1} value={i+1}>{m}</option>)}
          </select>
          <select value={anio} onChange={e => setAnio(+e.target.value)} style={{
            padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1',
            background: '#fff', fontSize: '14px', color: '#1F3864'
          }}>
            {[2024,2025,2026].map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
        {/* Mapa */}
        <div style={{ borderRadius: '12px', overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'relative' }}>
          {loading && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(255,255,255,0.85)', zIndex: 999,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '10px'
            }}>
              <Cpu size={28} color="#2E5496" />
              <span style={{ fontSize: '14px', color: '#1F3864', fontWeight: 600 }}>
                Ejecutando modelo XGBoost...
              </span>
            </div>
          )}
          <div ref={mapRef} style={{ height: '520px', width: '100%' }} />
        </div>

        {/* Panel lateral */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Leyenda */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '16px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1F3864', marginBottom: '12px' }}>
              Nivel de riesgo compuesto
            </h3>
            <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '10px' }}>
              70% predicción incidentes + 30% IVL luminarias
            </p>
            {[
              { label: 'Alto (≥65%)',         color: '#dc2626' },
              { label: 'Medio-alto (45-64%)', color: '#ea580c' },
              { label: 'Moderado (25-44%)',   color: '#f59e0b' },
              { label: 'Bajo (<25%)',          color: '#22c55e' },
            ].map(({ label, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center',
                                        gap: '10px', marginBottom: '7px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%',
                              background: color, flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: '#374151' }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Ranking UPZ */}
          {datos && (
            <div style={{ background: '#fff', borderRadius: '12px', padding: '16px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1F3864', marginBottom: '12px' }}>
                Ranking — {MESES[mes]} {anio}
              </h3>
              {datos.upzs?.map((u, i) => (
                <div key={u.upz} onClick={() => setSelected(u)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '6px 8px', borderRadius: '6px', marginBottom: '4px',
                    cursor: 'pointer',
                    background: selected?.upz === u.upz ? '#eff6ff' : 'transparent',
                    transition: 'background 0.15s'
                  }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', width: '16px' }}>
                    {i+1}
                  </span>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%',
                                background: getColor(u.riesgo), flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1F3864',
                                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {u.upz}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>
                      {u.prediccion_incidentes?.toLocaleString('es-CO')} inc. pred.
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: getColor(u.riesgo) }}>
                    {(u.riesgo * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Detalle seleccionado */}
          {selected && (
            <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '14px',
                          border: '1px solid #bfdbfe' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af', marginBottom: '10px' }}>
                <Info size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                {selected.upz}
              </h3>
              <div style={{ fontSize: '12px', color: '#1e3a5f', lineHeight: '2' }}>
                <div>Nivel: <strong style={{ color: getColor(selected.riesgo) }}>
                  {selected.nivel_riesgo}
                </strong></div>
                <div>Riesgo: <strong>{(selected.riesgo*100).toFixed(1)}%</strong></div>
                <div>Predicción: <strong>{selected.prediccion_incidentes?.toLocaleString('es-CO')}</strong></div>
                <div>Histórico: <strong>{selected.incidentes_historicos?.toLocaleString('es-CO')}</strong></div>
                <div>IVL: <strong>{selected.ivl?.toLocaleString('es-CO')}</strong></div>
              </div>
            </div>
          )}

          {/* Fuentes */}
          <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px',
                        fontSize: '11px', color: '#64748b', lineHeight: '1.7' }}>
            <Database size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            <strong>Fuentes:</strong><br />
            · NUSE 123 — Datos Abiertos Bogotá<br />
            · Luminarias — IDECA / UAESP<br />
            · Modelo XGBoost R²=0.953<br />
            CC-BY-SA 4.0
          </div>
        </div>
      </div>

      {/* Info modelo */}
      {datos && (
        <div style={{
          marginTop: '16px', padding: '14px 18px', background: '#f0fdf4',
          borderRadius: '10px', border: '1px solid #86efac',
          display: 'flex', alignItems: 'flex-start', gap: '10px',
          fontSize: '13px', color: '#166534'
        }}>
          <Cpu size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
          <div>
            <strong>Modelo en producción:</strong> {datos.modelo} ·
            Variables: temporalidad, memoria histórica (lags 1, 2, 3 y 12 meses),
            estacionalidad, IVL luminarias y UPZ codificadas.
            Riesgo = 70% predicción + 30% IVL.
          </div>
        </div>
      )}
    </div>
  )
}
