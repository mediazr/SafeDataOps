import { useState } from 'react'
import Dashboard from './components/Dashboard.jsx'
import MapaRiesgo from './components/MapaRiesgo.jsx'
import Metricas from './components/Metricas.jsx'
import Segmentos from './components/Segmentos.jsx'
import Header from './components/Header.jsx'

export default function App() {
  const [vista, setVista] = useState('dashboard')
  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <Header vista={vista} setVista={setVista} />
      <main style={{ padding: '16px', maxWidth: '1400px', margin: '0 auto' }}>
        {vista === 'dashboard'  && <Dashboard />}
        {vista === 'mapa'       && <MapaRiesgo />}
        {vista === 'metricas'   && <Metricas />}
        {vista === 'segmentos'  && <Segmentos />}
      </main>
    </div>
  )
}
