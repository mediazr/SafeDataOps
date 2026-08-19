# SafeData Ops S.A.S.

**Plataforma de analítica de riesgo urbano · Bogotá D.C.**

Proyecto de grado — Maestría en Análisis de Datos y Sistemas Inteligentes  
Universidad Santo Tomás | Marlon Esteban Díaz Rojas | 2026  
Directoras: Yuli Andrea Álvarez Pizarro · Pedro Pablo Díaz Jaimes

---

## Modelo estadístico

| Parámetro | Valor |
|-----------|-------|
| Algoritmo | XGBoost (Extreme Gradient Boosting) |
| Tipo | Regresor de incidentes por UPZ/mes |
| R² | **0.953** |
| Eficacia | **86.68%** (validación temporal estricta) |
| MAE | 22.18 incidentes/UPZ/mes |
| Entrenamiento | enero 2015 – septiembre 2023 (44.575 filas) |
| Prueba | octubre 2023 – enero 2026 (11.416 filas) |
| Total registros | 55.991 filas · 1.510.324 incidentes |
| Features | 32 variables |

## Fuentes de datos

| Fuente | Descripción | Acceso | Licencia |
|--------|-------------|--------|---------|
| NUSE 123 | 1.510.324 incidentes San Cristóbal 2015-2026 | API CKAN + archivo | CC-BY-SA 4.0 |
| Luminarias UAESP | 245 puntos San Cristóbal · Spatial Join WGS84 | Descarga manual | CC-BY-SA 4.0 |
| Estratificación DANE | Estrato por manzana (integración futura) | Descarga manual | CC-BY 4.0 |

## Features del modelo (32 variables)

| Grupo | Variables |
|-------|-----------|
| Temporales | ANIO, MES, TIME_INDEX |
| Memoria histórica | LAG_1_MES, LAG_2_MES, LAG_3_MES, LAG_12_MES, ROLLING_3M |
| Estacionalidad | IS_PEAK_MONTH, IS_RAINY_SEASON, IS_WEEKEND_HEAVY |
| Luminarias (nuevo) | IVL_NORM, LUM_UPZ |
| UPZ (OHE) | 8 variables |
| Tipo incidente (OHE) | 11 variables (top 10 + OTROS) |

## Riesgo compuesto

```
Riesgo = 0.70 × predicción_incidentes_normalizada
       + 0.30 × IVL_normalizado

IVL = Incidentes_históricos / (Luminarias_funcionales + 1)
```

## Estructura del proyecto

```
SafeDataOps/
├── backend/
│   ├── main.py                          # API FastAPI con modelo integrado
│   ├── requirements.txt
│   ├── safedataops_predictor_v2_optimized.pkl  # Modelo XGBoost
│   └── safedataops_spatial_analysis.csv        # IVL por UPZ
├── frontend/
│   ├── src/components/
│   │   ├── Header.jsx
│   │   ├── Dashboard.jsx    # KPIs + gráficas NUSE 123
│   │   ├── MapaRiesgo.jsx   # Mapa de riesgo con predicciones reales
│   │   └── Metricas.jsx     # Análisis comparativo 2021-2023
│   └── package.json
├── render.yaml
└── README.md
```

## Despliegue local

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend (nueva terminal)
cd frontend
npm install && npm run dev
# Abrir: http://localhost:5173
```

## Despliegue en Render

Build: `cd frontend && npm install && npm run build && cd ../backend && pip install -r requirements.txt`  
Start: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

## API Endpoints

| Endpoint | Descripción |
|----------|-------------|
| `GET /api/health` | Estado + info del modelo |
| `GET /api/riesgo/san-cristobal?anio=2025&mes=7` | Predicciones reales por UPZ |
| `GET /api/ivl` | Índice de Vulnerabilidad Lumínica |
| `GET /api/resumen?anio=2023&localidad=SAN CRISTOBAL` | Resumen NUSE |
| `GET /api/incidentes` | Incidentes filtrados |

## Equipo

- **Marlon Esteban Díaz Rojas** — Autor
- **Yuli Andrea Álvarez Pizarro** — Directora
- **Pedro Pablo Díaz Jaimes** — Co-director
