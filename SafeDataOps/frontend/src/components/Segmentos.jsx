import { useState } from 'react'
import { Shield, Truck, Building2, ChevronRight, CheckCircle, BarChart2, Map, FileText } from 'lucide-react'

const SEGMENTOS = [
  {
    id: 'b2g',
    icon: Shield,
    color: '#1F3864',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    label: 'B2G — Sector público',
    subtitle: 'Alcaldías locales · C4 Bogotá · Secretaría de Seguridad',
    descripcion: 'SafeData Ops transforma los datos del NUSE 123 en mapas de riesgo por manzana que orientan el despacho policial. Las alcaldías locales y el C4 pueden visualizar dónde concentrar patrullaje antes de que ocurra el incidente, en lugar de responder después.',
    producto: 'SafeCity Command Center',
    precio: '$90M – $180M COP / año',
    beneficios: [
      'Mapa de riesgo actualizado por UPZ y mes',
      'Predicción de incidentes con R²=0.953',
      'Integración con datos del NUSE 123 en tiempo real',
      'Panel de control para operadores del C4',
      'Soberanía de datos — sin dependencia de proveedor externo',
    ],
    caso: 'Piloto: San Cristóbal · 8 UPZs · 1.510.324 incidentes históricos',
    evidencia: 'BID (2016): focalización basada en datos reduce delitos denunciados un 45.6%',
  },
  {
    id: 'b2b_log',
    icon: Truck,
    color: '#065F46',
    bg: '#ECFDF5',
    border: '#6EE7B7',
    label: 'B2B — Logística y seguridad',
    subtitle: 'Empresas de transporte · Seguridad privada · Aseguradoras',
    descripcion: 'Las empresas de logística pierden millones por exponer activos en zonas de alto riesgo sin información actualizada. SafeRoute Pro entrega una API de riesgo por manzana que se integra directamente con los sistemas de ruteo, permitiendo evitar zonas críticas en tiempo real.',
    producto: 'SafeRoute Pro API',
    precio: '$6M COP / mes por organización',
    beneficios: [
      'API REST con riesgo estimado por zona y hora',
      'Alertas de rutas de alto riesgo para conductores',
      'Histórico de incidentes por tipo y UPZ',
      'Integración con sistemas GPS y telemetría',
      'Dashboard de exposición de activos por zona',
    ],
    caso: 'Sector logístico Colombia: $9.943M en pérdidas por piratería (2023)',
    evidencia: 'Camiones = 36.7% de vehículos más hurtados en Colombia (2025)',
  },
  {
    id: 'b2b_inm',
    icon: Building2,
    color: '#92400E',
    bg: '#FFFBEB',
    border: '#FCD34D',
    label: 'B2B — Sector inmobiliario',
    subtitle: 'Constructoras · Fondos de inversión · Avaluadores',
    descripcion: 'La evaluación de terrenos y proyectos inmobiliarios en Bogotá requiere datos de seguridad por manzana que ningún proveedor actual ofrece. SafeEstate Analytics genera informes de due diligence de seguridad a nivel de manzana, combinando histórico de incidentes, estratificación y tendencias de riesgo.',
    producto: 'SafeEstate Analytics',
    precio: '$3M COP / informe',
    beneficios: [
      'Índice de riesgo por manzana con datos oficiales',
      'Tendencia histórica de incidentes 2015-2026',
      'Comparativo con zonas de desarrollo similares',
      'Estratificación socioeconómica integrada',
      'Informe PDF ejecutivo para due diligence',
    ],
    caso: 'Bogotá: decisiones de inversión inmobiliaria sin datos de seguridad por manzana',
    evidencia: 'El sector inmobiliario carece de datos granulares de riesgo para evaluación de terrenos',
  },
]

export default function Segmentos() {
  const [activo, setActivo] = useState('b2g')
  const seg = SEGMENTOS.find(s => s.id === activo)
  const Icon = seg.icon
  const isMobile = window.innerWidth < 768

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: 700, color: '#1F3864' }}>
          Segmentos de clientes y productos
        </h1>
        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
          SafeData Ops atiende tres segmentos con productos diferenciados
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {SEGMENTOS.map(s => {
          const SIcon = s.icon
          return (
            <button key={s.id} onClick={() => setActivo(s.id)} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 16px', borderRadius: '10px', border: '2px solid',
              borderColor: activo === s.id ? s.color : '#e2e8f0',
              background: activo === s.id ? s.bg : '#fff',
              color: activo === s.id ? s.color : '#64748b',
              cursor: 'pointer', fontSize: '13px', fontWeight: 600,
              transition: 'all 0.2s', flex: isMobile ? '1 1 auto' : 'none'
            }}>
              <SIcon size={16} />
              {s.id === 'b2g' ? 'Sector público' :
               s.id === 'b2b_log' ? 'Logística' : 'Inmobiliario'}
            </button>
          )
        })}
      </div>

      {/* Contenido */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '16px'
      }}>
        {/* Info principal */}
        <div style={{
          background: seg.bg, borderRadius: '16px', padding: '24px',
          border: `2px solid ${seg.border}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              background: seg.color, borderRadius: '10px', padding: '10px',
              display: 'flex'
            }}>
              <Icon size={22} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '16px', color: seg.color }}>
                {seg.label}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                {seg.subtitle}
              </div>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.7', marginBottom: '16px' }}>
            {seg.descripcion}
          </p>

          {/* Producto y precio */}
          <div style={{
            background: '#fff', borderRadius: '10px', padding: '14px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: '8px'
          }}>
            <div>
              <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase',
                            letterSpacing: '0.5px' }}>Producto</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: seg.color }}>
                {seg.producto}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase',
                            letterSpacing: '0.5px' }}>Precio</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1F3864' }}>
                {seg.precio}
              </div>
            </div>
          </div>

          {/* Evidencia */}
          <div style={{
            marginTop: '12px', padding: '10px 12px', background: '#fff',
            borderRadius: '8px', fontSize: '11px', color: '#64748b',
            borderLeft: `3px solid ${seg.color}`
          }}>
            <strong>Caso de uso:</strong> {seg.caso}<br/>
            <strong>Evidencia:</strong> {seg.evidencia}
          </div>
        </div>

        {/* Beneficios */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#1F3864', marginBottom: '16px' }}>
            Beneficios diferenciales
          </div>
          {seg.beneficios.map((b, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              marginBottom: '12px', padding: '10px',
              background: i % 2 === 0 ? '#f8fafc' : '#fff',
              borderRadius: '8px'
            }}>
              <CheckCircle size={16} color={seg.color} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span style={{ fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>{b}</span>
            </div>
          ))}

          {/* Links a otras vistas */}
          <div style={{ marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
              Ver en la plataforma
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { icon: Map,      label: 'Mapa de riesgo' },
                { icon: BarChart2, label: 'Métricas NUSE' },
                { icon: FileText, label: 'Dashboard' },
              ].map(({ icon: LIcon, label }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '6px',
                  background: seg.bg, color: seg.color,
                  fontSize: '12px', fontWeight: 500
                }}>
                  <LIcon size={13} />{label}
                  <ChevronRight size={12} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comparativo de precios */}
      <div style={{ marginTop: '16px', background: '#fff', borderRadius: '16px',
                    padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#1F3864', marginBottom: '14px' }}>
          Comparativo de productos
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#1F3864', color: '#fff' }}>
                {['Producto','Segmento','Precio','Granularidad','Ciclo de venta'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['SafeCity Command Center','B2G — Alcaldías / C4','$90M–$180M COP/año','Por UPZ y manzana','6-12 meses'],
                ['SafeRoute Pro API','B2B — Logística','$6M COP/mes','Por zona y hora','1-3 meses'],
                ['SafeEstate Analytics','B2B — Inmobiliario','$3M COP/informe','Por manzana','Inmediato'],
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: '10px 12px', color: '#374151',
                                         fontWeight: j === 0 ? 600 : 400 }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
