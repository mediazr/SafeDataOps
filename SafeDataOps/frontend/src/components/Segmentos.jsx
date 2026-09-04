import { useState } from 'react'
import { Shield, Truck, Building2, Smartphone, ChevronRight,
         CheckCircle, BarChart2, Map, FileText, Clock } from 'lucide-react'

const SEGMENTOS = [
  {
    id: 'b2g',
    icon: Shield,
    color: '#1F3864', bg: '#EFF6FF', border: '#BFDBFE',
    label: 'B2G — Sector público',
    subtitle: 'Alcaldías locales · C4 Bogotá · Secretaría de Seguridad',
    descripcion: 'SafeData Ops transforma los datos del NUSE 123 en mapas de riesgo por manzana que orientan el despacho policial. Las alcaldías y el C4 pueden visualizar dónde concentrar patrullaje antes de que ocurra el incidente.',
    producto: 'SafeCity Command Center',
    precio: '$90M – $180M COP / año',
    estado: 'produccion',
    beneficios: [
      'Mapa de riesgo actualizado por UPZ y mes',
      'Predicción de incidentes con R²=0.954',
      'Integración con datos del NUSE 123',
      'Panel de control para operadores del C4',
      'Soberanía de datos — sin dependencia de proveedor externo',
    ],
    caso: 'Piloto: San Cristóbal · 8 UPZs · 1.510.324 incidentes históricos',
    evidencia: 'BID (2016): focalización basada en datos reduce delitos denunciados un 45.6%',
  },
  {
    id: 'b2b_log',
    icon: Truck,
    color: '#065F46', bg: '#ECFDF5', border: '#6EE7B7',
    label: 'B2B — Logística y seguridad',
    subtitle: 'Empresas de transporte · Seguridad privada · Aseguradoras',
    descripcion: 'Las empresas de logística pierden millones por exponer activos en zonas de alto riesgo sin información actualizada. SafeRoute Pro entrega una API de riesgo por manzana integrable con sistemas de ruteo existentes.',
    producto: 'SafeRoute Pro API',
    precio: '$6M COP / mes por organización',
    estado: 'produccion',
    beneficios: [
      'API REST con riesgo estimado por zona y hora',
      'Histórico de incidentes por tipo y UPZ',
      'Integración con sistemas GPS y telemetría',
      'Dashboard de exposición de activos por zona',
      'Alertas de rutas de alto riesgo para conductores',
    ],
    caso: 'Sector logístico Colombia: $9.943M en pérdidas por piratería (2023)',
    evidencia: 'Camiones = 36.7% de vehículos más hurtados en Colombia (2025)',
  },
  {
    id: 'b2b_inm',
    icon: Building2,
    color: '#92400E', bg: '#FFFBEB', border: '#FCD34D',
    label: 'B2B — Sector inmobiliario',
    subtitle: 'Constructoras · Fondos de inversión · Avaluadores',
    descripcion: 'La evaluación de terrenos en Bogotá requiere datos de seguridad por manzana que ningún proveedor actual ofrece. SafeEstate Analytics genera informes de due diligence de seguridad con histórico de incidentes y estratificación socioeconómica.',
    producto: 'SafeEstate Analytics',
    precio: '$3M COP / informe',
    estado: 'produccion',
    beneficios: [
      'Índice de riesgo por manzana con datos oficiales',
      'Tendencia histórica de incidentes 2015-2026',
      'Estratificación socioeconómica integrada (DANE)',
      'Comparativo con zonas de desarrollo similares',
      'Informe PDF ejecutivo para due diligence',
    ],
    caso: 'Bogotá: decisiones de inversión inmobiliaria sin datos de seguridad por manzana',
    evidencia: 'El sector carece de datos granulares de riesgo para evaluación de terrenos',
  },
  {
    id: 'b2c',
    icon: Smartphone,
    color: '#4B0082', bg: '#F5F3FF', border: '#C4B5FD',
    label: 'B2C — Ciudadanos',
    subtitle: 'Producto conceptual · Versiones futuras · No disponible en prototipo actual',
    descripcion: 'SafeCitizen App es un producto conceptual proyectado para la Etapa 3 del plan de crecimiento. Permitiría a cualquier ciudadano consultar el nivel de riesgo estimado de una zona de Bogotá antes de transitarla. Su implementación está condicionada a la consolidación previa de los segmentos B2G y B2B.',
    producto: 'SafeCitizen App',
    precio: 'Freemium — acceso básico gratuito',
    estado: 'concepto',
    beneficios: [
      'Consulta de riesgo por zona en tiempo real',
      'Alertas personalizadas por localidad de residencia',
      'Recomendaciones de rutas seguras',
      'Datos agregados — sin información sensible individual',
      'Integración futura con transporte público',
    ],
    caso: 'Bogotá: 8 millones de habitantes sin acceso a información de riesgo por zona',
    evidencia: 'Producto proyectado — fuera del alcance del prototipo actual (2026)',
  },
]

export default function Segmentos() {
  const [activo, setActivo] = useState('b2g')
  const seg    = SEGMENTOS.find(s => s.id === activo)
  const Icon   = seg.icon
  const isMobile = window.innerWidth < 768
  const esFuturo = seg.estado === 'concepto'

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: isMobile ? '18px':'22px', fontWeight:700, color:'#1F3864' }}>
          Segmentos de clientes y productos
        </h1>
        <p style={{ color:'#64748b', fontSize:'13px', marginTop:'4px' }}>
          Tres productos en producción · Un producto conceptual para versiones futuras
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'20px', flexWrap:'wrap' }}>
        {SEGMENTOS.map(s => {
          const SIcon = s.icon
          const esActivo = activo === s.id
          return (
            <button key={s.id} onClick={() => setActivo(s.id)} style={{
              display:'flex', alignItems:'center', gap:'8px',
              padding:'10px 16px', borderRadius:'10px', border:'2px solid',
              borderColor: esActivo ? s.color : '#e2e8f0',
              background: esActivo ? s.bg : '#fff',
              color: esActivo ? s.color : '#64748b',
              cursor:'pointer', fontSize:'13px', fontWeight:600,
              transition:'all 0.2s', flex: isMobile ? '1 1 auto' : 'none',
              opacity: s.estado === 'concepto' ? 0.85 : 1,
              position:'relative'
            }}>
              <SIcon size={16} />
              {s.id === 'b2g'     ? 'Sector público' :
               s.id === 'b2b_log' ? 'Logística' :
               s.id === 'b2b_inm' ? 'Inmobiliario' : 'Ciudadanos'}
              {s.estado === 'concepto' && (
                <span style={{
                  fontSize:'9px', background:'#7C3AED', color:'#fff',
                  borderRadius:'4px', padding:'1px 5px', marginLeft:'2px'
                }}>FUTURO</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Banner de concepto futuro */}
      {esFuturo && (
        <div style={{
          marginBottom:'16px', padding:'12px 16px',
          background:'#F5F3FF', border:'2px solid #C4B5FD',
          borderRadius:'10px', display:'flex', alignItems:'center', gap:'10px'
        }}>
          <Clock size={18} color='#4B0082' style={{flexShrink:0}} />
          <div>
            <div style={{fontSize:'13px', fontWeight:700, color:'#4B0082'}}>
              Producto conceptual — versiones futuras
            </div>
            <div style={{fontSize:'12px', color:'#6D28D9', marginTop:'2px'}}>
              SafeCitizen App no hace parte del prototipo actual ni de las proyecciones
              financieras del plan de negocio. Su desarrollo está condicionado a la
              consolidación previa de los segmentos B2G y B2B (Etapa 3 del plan de crecimiento).
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div style={{
        display:'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap:'16px'
      }}>
        {/* Info */}
        <div style={{
          background: seg.bg, borderRadius:'16px', padding:'24px',
          border:`2px solid ${seg.border}`,
          opacity: esFuturo ? 0.92 : 1
        }}>
          <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px'}}>
            <div style={{
              background: esFuturo ? '#EDE9FE' : seg.color,
              borderRadius:'10px', padding:'10px', display:'flex'
            }}>
              <Icon size={22} color={esFuturo ? '#4B0082' : '#fff'} />
            </div>
            <div>
              <div style={{fontWeight:700, fontSize:'16px', color:seg.color}}>
                {seg.label}
              </div>
              <div style={{fontSize:'12px', color:'#64748b', marginTop:'2px'}}>
                {seg.subtitle}
              </div>
            </div>
          </div>

          <p style={{fontSize:'13px', color:'#374151', lineHeight:'1.7', marginBottom:'16px'}}>
            {seg.descripcion}
          </p>

          {/* Producto y precio */}
          <div style={{
            background:'#fff', borderRadius:'10px', padding:'14px',
            display:'flex', justifyContent:'space-between',
            alignItems:'center', flexWrap:'wrap', gap:'8px'
          }}>
            <div>
              <div style={{fontSize:'10px', color:'#64748b', textTransform:'uppercase',
                           letterSpacing:'0.5px'}}>Producto</div>
              <div style={{fontSize:'14px', fontWeight:700, color:seg.color}}>
                {seg.producto}
              </div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:'10px', color:'#64748b', textTransform:'uppercase',
                           letterSpacing:'0.5px'}}>Precio</div>
              <div style={{fontSize:'14px', fontWeight:700, color:'#1F3864'}}>
                {seg.precio}
              </div>
            </div>
          </div>

          {/* Caso y evidencia */}
          <div style={{
            marginTop:'12px', padding:'10px 12px', background:'#fff',
            borderRadius:'8px', fontSize:'11px', color:'#64748b',
            borderLeft:`3px solid ${seg.color}`
          }}>
            <strong>Caso de uso:</strong> {seg.caso}<br/>
            <strong>{esFuturo ? 'Nota' : 'Evidencia'}:</strong> {seg.evidencia}
          </div>
        </div>

        {/* Beneficios */}
        <div style={{
          background:'#fff', borderRadius:'16px', padding:'24px',
          boxShadow:'0 2px 8px rgba(0,0,0,0.08)',
          opacity: esFuturo ? 0.92 : 1
        }}>
          <div style={{fontSize:'14px', fontWeight:700, color:'#1F3864', marginBottom:'16px'}}>
            {esFuturo ? 'Funcionalidades proyectadas' : 'Beneficios diferenciales'}
          </div>
          {seg.beneficios.map((b, i) => (
            <div key={i} style={{
              display:'flex', alignItems:'flex-start', gap:'10px',
              marginBottom:'12px', padding:'10px',
              background: i%2===0 ? '#f8fafc' : '#fff',
              borderRadius:'8px'
            }}>
              <CheckCircle size={16} color={esFuturo ? '#7C3AED' : seg.color}
                           style={{flexShrink:0, marginTop:'1px'}} />
              <span style={{fontSize:'13px', color: esFuturo ? '#6D28D9' : '#374151',
                            lineHeight:'1.5'}}>{b}</span>
            </div>
          ))}

          {/* Links a otras vistas — solo para productos en producción */}
          {!esFuturo && (
            <div style={{marginTop:'16px', borderTop:'1px solid #f1f5f9', paddingTop:'16px'}}>
              <div style={{fontSize:'12px', color:'#64748b', marginBottom:'10px'}}>
                Ver en la plataforma
              </div>
              <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
                {[
                  {icon: Map,       label:'Mapa de riesgo'},
                  {icon: BarChart2, label:'Métricas NUSE'},
                  {icon: FileText,  label:'Dashboard'},
                ].map(({icon: LIcon, label}) => (
                  <div key={label} style={{
                    display:'flex', alignItems:'center', gap:'6px',
                    padding:'6px 12px', borderRadius:'6px',
                    background: seg.bg, color: seg.color,
                    fontSize:'12px', fontWeight:500
                  }}>
                    <LIcon size={13} />{label}<ChevronRight size={12}/>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Para SafeCitizen: nota de roadmap */}
          {esFuturo && (
            <div style={{
              marginTop:'16px', padding:'12px', borderRadius:'10px',
              background:'#F5F3FF', border:'1px solid #DDD6FE'
            }}>
              <div style={{fontSize:'12px', color:'#4B0082', lineHeight:'1.6'}}>
                <strong>Hoja de ruta:</strong> SafeCitizen App está proyectada para la
                <strong> Etapa 3</strong> del plan de crecimiento (año 5+), posterior
                a la consolidación de contratos B2G con el C4 y al menos 5 alcaldías locales.
                Su lanzamiento depende de la sostenibilidad operativa alcanzada en las
                etapas anteriores.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabla comparativa */}
      <div style={{marginTop:'16px', background:'#fff', borderRadius:'16px',
                   padding:'20px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
        <div style={{fontSize:'14px', fontWeight:700, color:'#1F3864', marginBottom:'14px'}}>
          Comparativo de productos
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', fontSize:'12px'}}>
            <thead>
              <tr style={{background:'#1F3864', color:'#fff'}}>
                {['Producto','Segmento','Precio','Granularidad','Estado'].map(h => (
                  <th key={h} style={{padding:'10px 12px', textAlign:'left', fontWeight:600}}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['SafeCity Command Center','B2G — Alcaldías / C4','$90M–$180M COP/año','Por UPZ y manzana','En producción'],
                ['SafeRoute Pro API',      'B2B — Logística',     '$6M COP/mes',        'Por zona y hora',  'En producción'],
                ['SafeEstate Analytics',   'B2B — Inmobiliario',  '$3M COP/informe',    'Por manzana',      'En producción'],
                ['SafeCitizen App',        'B2C — Ciudadanos',    'Freemium',           'Por zona',         'Concepto — versión futura'],
              ].map((row, i) => {
                const esFut = row[4].includes('Concepto')
                return (
                  <tr key={i} style={{background: esFut ? '#F5F3FF' : (i%2===0 ? '#f8fafc' : '#fff')}}>
                    {row.map((cell, j) => (
                      <td key={j} style={{
                        padding:'10px 12px',
                        color: esFut ? '#4B0082' : '#374151',
                        fontWeight: j===0 ? 600 : (j===4 && esFut ? 600 : 400),
                        fontStyle: esFut && j===4 ? 'italic' : 'normal'
                      }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div style={{
          marginTop:'10px', fontSize:'11px', color:'#64748b',
          padding:'8px 12px', background:'#F5F3FF', borderRadius:'6px',
          borderLeft:'3px solid #7C3AED'
        }}>
          * SafeCitizen App es un producto conceptual proyectado para la Etapa 3 del plan de
          crecimiento (año 5+). No hace parte del alcance del prototipo actual ni de las
          proyecciones financieras del plan de negocio.
        </div>
      </div>
    </div>
  )
}
