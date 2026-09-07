# Technical Requirements Document (TRD)

# Well Twin — Technical Architecture & Implementation Specification

## 1. Technical Objective

Well Twin is architected as a modular, high-performance petroleum engineering workstation. The technical evolution follows a strict **frontend-first, direct-to-database roadmap**.

- **Phase 1 (COMPLETED)**: Built the complete engineer presentation tier using React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, Zustand, and interactive SVG visualizers, driven by a deterministic synthetic domain dataset.
- **Phase 2 (CURRENT)**: Connect the completed frontend directly to a production-grade **FastAPI** backend and persistent **Supabase PostgreSQL** database. **There is no temporary in-memory backend stage.**

```
React Workstation (TanStack Query)
        ↓  HTTP / REST
FastAPI Application Layer (/api/v1)
        ↓
Domain Service Layer (Validation & Business Logic)
        ↓
Repository / Data Access Layer (SQLAlchemy / Asyncpg)
        ↓
Supabase PostgreSQL (ACID Relational Persistence)
```

---

## 2. Architecture Evolution

```text
PHASE 1 — FRONTEND (COMPLETED)
React + TypeScript + Vite
       ↓
Feature Hooks (TanStack Query + Zustand)
       ↓
Mock Domain Services
       ↓
Deterministic Synthetic Dataset (BW-017)

PHASE 2 — BACKEND + DATABASE (CURRENT)
React + TypeScript + Vite
       ↓
TanStack Query Hooks
       ↓
FastAPI REST API (/api/v1)
       ↓
Domain Services & Pydantic Validation
       ↓
Repository Layer
       ↓
Supabase PostgreSQL

PHASE 3 — ANALYTICS + ML
Supabase PostgreSQL
       ↓
FastAPI Analytics / ML Engine (NumPy, SciPy, Scikit-Learn)
       ↓
model_states & model_predictions Tables
       ↓
FastAPI REST API
       ↓
React UI (Predicted vs Actual, Dynamometer Inversion, Drift)

PHASE 4 — AI INTELLIGENCE
Telemetry & Anomaly Events
       ↓
Backend Feature Extraction & Physical Context Builder
       ↓
LLM Inference (Provider-Agnostic Interface)
       ↓
Structured Pydantic Validation & Grounding
       ↓
ai_insights & recommendations Tables
       ↓
React UI (Evidence Badges, Impact Simulation)

PHASE 5 — REAL DATA + PRODUCTION
SCADA (OPC-UA / Modbus / MQTT) + Historian Batch Ingestion
       ↓
Ingestion Pipeline & Telemetry Adapter
       ↓
Supabase PostgreSQL (Row Level Security & Partitioning)
       ↓
Supabase Auth (JWT Validation & RBAC)
       ↓
CI/CD, Monitoring, Audit Logging & Cloud Deployment
```

---

## 3. Phase 1 Frontend Deliverables (COMPLETED)

The frontend workstation has been completely implemented and verified:
- **Repository**: Located in `frontend/` as a Vite SPA.
- **Styling & Tokens**: Centralized semantic CSS variable system (`index.css`) supporting both Light Theme and Industrial Dark Mode (`#0B0F14`/`#151C24` slate with `#38BDF8` cyan accents) with smooth 180ms cubic-bezier transitions and `localStorage` persistence.
- **17 Interactive Routes**:
  - Subsystems: `/`, `/digital-twin`, `/well-state`, `/twin/reservoir`, `/twin/wellbore`, `/twin/srp`, `/twin/surface`.
  - Analytics & Lifecycle: `/trends`, `/css-cycle`, `/alerts`, `/anomalies`, `/ai-insights`, `/model-comparison`.
  - Asset & Ops: `/equipment`, `/well-diagram`, `/recommendations`, `/work-orders`.
- **Core Components**: `CauseChain`, `DataProvenanceBadge`, `ModelHealthDrift`, `DynamometerChart`, `SteamPlumeSvg`, `CouplingDiagram`, `KpiCard`, `HealthScore`.
- **Deterministic Scenario**: Well BW-017 (CSS Cycle 4, Day 38: $R=18.4\text{ m}$, $T_\text{res}=134.2^\circ\text{C}$, $\mu=84\text{ cP}$, fillage $84.6\%$, fluid pound @ $2.80\text{ m}$, net oil $184.2\text{ BOPD}$ vs. $198.0\text{ BOPD}$ predicted).

---

## 4. Phase 2 Backend Structure & Organization

The backend must be structured with strict separation of concerns into API routes, Pydantic schemas, SQLAlchemy ORM models, domain repositories, and business services:

```text
backend/
├── app/
│   ├── main.py                       # FastAPI entrypoint, middleware, CORS, lifespan
│   │
│   ├── core/
│   │   ├── config.py                 # Pydantic Settings (.env loader, URLs, keys)
│   │   ├── security.py               # Security helpers, future JWT verification
│   │   └── logging.py                # Structured JSON logging for production
│   │
│   ├── api/
│   │   └── v1/
│   │       ├── router.py             # Central v1 APIRouter mounting all endpoints
│   │       ├── health.py             # Health check & system status
│   │       ├── wells.py              # Well registry, health, operating state
│   │       ├── telemetry.py          # Time-series telemetry querying & ingestion
│   │       ├── trends.py             # Multi-parameter downsampled time-series
│   │       ├── alerts.py             # Operational alerts lifecycle
│   │       ├── anomalies.py          # Detected anomaly feed & sensor heatbars
│   │       ├── css_cycles.py         # CSS cycle lifecycle & phase records
│   │       ├── equipment.py          # Equipment registry & Goodman stress indices
│   │       ├── insights.py           # Diagnostic insights & evidence breakdown
│   │       ├── recommendations.py    # Prescriptive recommendations & status
│   │       └── work_orders.py        # Work order dispatch, lifecycle & assignment
│   │
│   ├── schemas/                      # Pydantic v2 schemas for request/response validation
│   │   ├── well.py
│   │   ├── telemetry.py
│   │   ├── health.py
│   │   ├── alert.py
│   │   ├── anomaly.py
│   │   ├── css_cycle.py
│   │   ├── equipment.py
│   │   ├── insight.py
│   │   ├── recommendation.py
│   │   ├── work_order.py
│   │   ├── model_state.py
│   │   └── model_prediction.py
│   │
│   ├── models/                       # SQLAlchemy ORM database models
│   │   ├── base.py                   # Declarative base & common mixins (id, timestamps)
│   │   ├── well.py
│   │   ├── telemetry.py
│   │   ├── alert.py
│   │   ├── anomaly.py
│   │   ├── css_cycle.py
│   │   ├── equipment.py
│   │   ├── insight.py
│   │   ├── recommendation.py
│   │   ├── work_order.py
│   │   ├── model_state.py
│   │   └── model_prediction.py
│   │
│   ├── repositories/                 # Database access layer (CRUD & SQL queries)
│   │   ├── base_repository.py
│   │   ├── well_repository.py
│   │   ├── telemetry_repository.py
│   │   ├── alert_repository.py
│   │   ├── anomaly_repository.py
│   │   ├── css_cycle_repository.py
│   │   ├── equipment_repository.py
│   │   ├── insight_repository.py
│   │   ├── recommendation_repository.py
│   │   └── work_order_repository.py
│   │
│   ├── services/                     # Domain business logic & orchestration
│   │   ├── well_service.py
│   │   ├── telemetry_service.py
│   │   ├── trend_service.py
│   │   ├── alert_service.py
│   │   ├── anomaly_service.py
│   │   ├── css_cycle_service.py
│   │   ├── equipment_service.py
│   │   ├── insight_service.py
│   │   ├── recommendation_service.py
│   │   └── work_order_service.py
│   │
│   ├── db/
│   │   ├── connection.py             # Async engine, sessionmaker, dependency injection
│   │   ├── migrations/               # Alembic migrations directory
│   │   └── seed.py                   # Seeds database with Phase 1 deterministic dataset
│   │
│   └── tests/                        # Pytest unit, API, and database integration tests
│       ├── conftest.py
│       ├── test_api_wells.py
│       ├── test_api_telemetry.py
│       ├── test_api_alerts.py
│       └── test_api_work_orders.py
│
├── requirements.txt                  # fastapi, uvicorn, pydantic, sqlalchemy, asyncpg, alembic
├── .env.example                      # Template for SUPABASE_URL, SUPABASE_DB_URL, etc.
└── README.md                         # Setup instructions & API run guide
```

---

## 5. API Design & Endpoint Specification

All API endpoints reside under `/api/v1`. Route handlers remain thin, delegating business logic to services.

### System & Health
- `GET /api/v1/health` $\to$ Returns database connection status, API version, and server timestamp.

### Wells & State
- `GET /api/v1/wells` $\to$ List all monitored wells with basic status, field, and current phase.
- `GET /api/v1/wells/{well_id}` $\to$ Full well master record (coordinates, completion details, limits).
- `GET /api/v1/wells/{well_id}/health` $\to$ Aggregated well health score (0–100) and subsystem scores.
- `GET /api/v1/wells/{well_id}/state` $\to$ High-density subsurface and surface telemetry snapshot.

### Telemetry & Historical Trends
- `GET /api/v1/wells/{well_id}/telemetry` $\to$ Paginated or time-bounded raw telemetry readings.
- `GET /api/v1/wells/{well_id}/telemetry/latest` $\to$ Instantaneous reading for real-time header and KPI cards.
- `GET /api/v1/wells/{well_id}/trends` $\to$ Downsampled comparative time-series.
  - Query parameters:
    - `metric`: string or comma-separated list (`temperature`, `viscosity`, `fillage`, `oil_rate`, etc.)
    - `start_time`: ISO8601 UTC timestamp
    - `end_time`: ISO8601 UTC timestamp
    - `interval`: aggregation bucket (`1m`, `5m`, `1h`, `1d`)

### CSS Cycles
- `GET /api/v1/wells/{well_id}/css-cycles` $\to$ List of all historical and current CSS cycles.
- `GET /api/v1/wells/{well_id}/css-cycles/{cycle_id}` $\to$ Detailed phase milestones, cumulative steam injected, cumulative oil recovered, and CSOR.

### Equipment & Mechanical Stress
- `GET /api/v1/wells/{well_id}/equipment` $\to$ Subsurface and surface asset catalog, operational hours, health indices, and Goodman rod stress values.

### Operational Alerts
- `GET /api/v1/wells/{well_id}/alerts` $\to$ Filterable alerts (query params: `status`, `severity`, `subsystem`).
- `POST /api/v1/alerts/{alert_id}/acknowledge` $\to$ Mark alert as acknowledged with engineer ID/notes.
- `POST /api/v1/alerts/{alert_id}/resolve` $\to$ Mark alert as resolved with corrective summary.

### Anomalies & AI Insights
- `GET /api/v1/wells/{well_id}/anomalies` $\to$ Detected multivariate anomalies with sensor deviation scores.
- `GET /api/v1/wells/{well_id}/insights` $\to$ Physics-grounded diagnostic cards with evidence arrays and confidence ratings.

### Prescriptive Recommendations
- `GET /api/v1/wells/{well_id}/recommendations` $\to$ Actionable optimization proposals with impact preview.
- `POST /api/v1/recommendations/{recommendation_id}/status` $\to$ Update status (`accepted`, `rejected`, `overridden`).

### Work Orders
- `GET /api/v1/work-orders` $\to$ List work orders with filter by status (`draft`, `approved`, `in_progress`, `completed`).
- `GET /api/v1/work-orders/{work_order_id}` $\to$ Full work order detail with dispatch logs and notes.
- `POST /api/v1/work-orders` $\to$ Create new field work order (can link to `alert_id` or `recommendation_id`).
- `PATCH /api/v1/work-orders/{work_order_id}` $\to$ Update work order status, priority, or assignee.

---

## 6. Database Design (Supabase PostgreSQL)

### Schema Architecture
The database is built on relational PostgreSQL hosted on Supabase, enforcing foreign keys, check constraints, and non-null guarantees. Every entity includes `id` (UUID PK), `created_at` (TIMESTAMPTZ), and `updated_at` (TIMESTAMPTZ).

```mermaid
erDiagram
    wells ||--o{ telemetry_readings : "generates"
    wells ||--o{ css_cycles : "operates"
    wells ||--o{ equipment : "contains"
    wells ||--o{ alerts : "triggers"
    wells ||--o{ anomalies : "detects"
    wells ||--o{ ai_insights : "analyzes"
    wells ||--o{ recommendations : "proposes"
    wells ||--o{ work_orders : "dispatches"
    wells ||--o{ model_states : "simulates"
    wells ||--o{ model_predictions : "projects"
    css_cycles ||--o{ css_cycle_events : "contains"
    alerts ||--o{ work_orders : "escalates_to"
    recommendations ||--o{ work_orders : "executes_as"
```

### Table Specifications

#### 1. `wells`
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `well_code` VARCHAR(50) UNIQUE NOT NULL (e.g. `'BW-017'`)
- `name` VARCHAR(100) NOT NULL
- `field_name` VARCHAR(100) NOT NULL (e.g. `'Baghewala'`)
- `basin` VARCHAR(100) NOT NULL (e.g. `'Bikaner-Nagaur'`)
- `latitude` DOUBLE PRECISION NOT NULL
- `longitude` DOUBLE PRECISION NOT NULL
- `formation` VARCHAR(100) NOT NULL (e.g. `'Jodhpur Sandstone'`)
- `reservoir_depth_m` DOUBLE PRECISION NOT NULL (e.g. `1120.0`)
- `total_depth_m` DOUBLE PRECISION NOT NULL (e.g. `1420.0`)
- `crude_api` DOUBLE PRECISION NOT NULL (e.g. `17.5`)
- `dead_oil_viscosity_cp` DOUBLE PRECISION NOT NULL (e.g. `8500.0`)
- `current_cycle` INTEGER NOT NULL DEFAULT 4
- `operating_phase` VARCHAR(50) NOT NULL (e.g. `'Production'`)
- `artificial_lift_type` VARCHAR(50) NOT NULL (e.g. `'Sucker Rod Pump'`)
- `status` VARCHAR(20) NOT NULL DEFAULT 'Active'
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

#### 2. `telemetry_readings`
Time-series table capturing high-density telemetry:
- `id` BIGSERIAL PRIMARY KEY
- `well_id` UUID NOT NULL REFERENCES wells(id) ON DELETE CASCADE
- `timestamp` TIMESTAMPTZ NOT NULL
- `oil_rate` DOUBLE PRECISION (BOPD)
- `water_rate` DOUBLE PRECISION (BWPD)
- `steam_rate` DOUBLE PRECISION (CWE t/d)
- `gas_rate` DOUBLE PRECISION (MSCFD)
- `bottomhole_pressure` DOUBLE PRECISION (bar)
- `bottomhole_temperature` DOUBLE PRECISION (°C)
- `wellhead_pressure` DOUBLE PRECISION (bar)
- `wellhead_temperature` DOUBLE PRECISION (°C)
- `casing_pressure` DOUBLE PRECISION (bar)
- `tubing_pressure` DOUBLE PRECISION (bar)
- `flowline_pressure` DOUBLE PRECISION (bar)
- `pump_speed` DOUBLE PRECISION (RPM)
- `stroke_rate` DOUBLE PRECISION (SPM)
- `stroke_length_m` DOUBLE PRECISION
- `pump_fillage` DOUBLE PRECISION (%)
- `fluid_level_m` DOUBLE PRECISION
- `motor_current` DOUBLE PRECISION (A)
- `motor_power_kw` DOUBLE PRECISION (kW)
- `torque` DOUBLE PRECISION (Nm)
- `vibration` DOUBLE PRECISION (mm/s)
- `peak_polished_rod_load` DOUBLE PRECISION (kN)
- `minimum_polished_rod_load` DOUBLE PRECISION (kN)
- `provenance` VARCHAR(30) NOT NULL DEFAULT 'OBSERVED'
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()

**Index**:
```sql
CREATE INDEX idx_telemetry_well_timestamp ON telemetry_readings (well_id, timestamp DESC);
```

#### 3. `model_states` & `model_predictions`
Prepares the data architecture for Phase 3 coupled digital twins:
- `model_states`: Captures snapshot of coupled subsystem physical state:
  - `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `well_id` UUID NOT NULL REFERENCES wells(id) ON DELETE CASCADE
  - `timestamp` TIMESTAMPTZ NOT NULL
  - `reservoir_temp_c` DOUBLE PRECISION
  - `steam_chamber_radius_m` DOUBLE PRECISION
  - `heat_loss_rate_kw` DOUBLE PRECISION
  - `crude_viscosity_cp` DOUBLE PRECISION
  - `flowing_bottomhole_pressure_bar` DOUBLE PRECISION
  - `liquid_holdup` DOUBLE PRECISION
  - `pump_fillage_pct` DOUBLE PRECISION
  - `fluid_pound_marker_m` DOUBLE PRECISION
  - `rod_peak_stress_ratio` DOUBLE PRECISION
  - `solver_convergence_mape` DOUBLE PRECISION
  - `provenance` VARCHAR(30) NOT NULL DEFAULT 'MODEL DERIVED'
  - `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `model_predictions`: Supports Predicted vs. Actual tracking and model drift detection:
  - `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
  - `well_id` UUID NOT NULL REFERENCES wells(id) ON DELETE CASCADE
  - `timestamp` TIMESTAMPTZ NOT NULL
  - `model_name` VARCHAR(50) NOT NULL (e.g. `'surface_production_twin'`)
  - `target_metric` VARCHAR(50) NOT NULL (e.g. `'net_oil_bopd'`)
  - `predicted_value` DOUBLE PRECISION NOT NULL
  - `actual_value` DOUBLE PRECISION
  - `p10_value` DOUBLE PRECISION
  - `p90_value` DOUBLE PRECISION
  - `residual_error` DOUBLE PRECISION
  - `confidence_pct` DOUBLE PRECISION NOT NULL
  - `model_version` VARCHAR(20) NOT NULL DEFAULT 'v1.0'
  - `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()

#### 4. Additional Relational Entities
- `css_cycles`: `id`, `well_id`, `cycle_number`, `start_date`, `end_date`, `steam_injected_tons`, `oil_produced_bbls`, `csor`, `status`.
- `equipment`: `id`, `well_id`, `tag`, `name`, `category`, `status`, `health_score`, `operating_hours`, `goodman_stress_pct`, `last_inspection`, `next_inspection`.
- `alerts`: `id`, `well_id`, `title`, `severity`, `subsystem`, `metric`, `observed_value`, `threshold`, `timestamp`, `status`, `explanation`, `action_required`.
- `anomalies`: `id`, `well_id`, `timestamp`, `severity`, `score`, `affected_metric`, `time_window`, `evidence`, `possible_cause`.
- `ai_insights`: `id`, `well_id`, `title`, `severity`, `confidence_pct`, `summary`, `evidence_json`, `likely_cause`, `recommended_action`, `projected_delta_bopd`.
- `recommendations`: `id`, `well_id`, `title`, `priority`, `action`, `reason`, `evidence_json`, `expected_impact`, `confidence_pct`, `status`.
- `work_orders`: `id`, `order_number`, `well_id`, `title`, `category`, `priority`, `status`, `assigned_to`, `due_date`, `notes`, `related_alert_id`, `related_recommendation_id`.

---

## 7. Frontend Integration Strategy

The React presentation layer remains completely preserved. We replace mock service implementations with typed HTTP API client services.

```text
Phase 1:
React Component → useWell() → mockWellService (reads local static arrays)

Phase 2:
React Component → useWell() → apiWellService (TanStack Query + Axios / Fetch) → FastAPI → Supabase
```

### State Management Split:
- **Server State (TanStack Query)**:
  - Well metadata, telemetry streams, historical trends, alerts, anomalies, CSS cycles, recommendations, work orders.
  - Provides automated background refetching, cache invalidation, loading states, and error handling.
- **Client State (Zustand)**:
  - Theme mode (`'light' | 'dark'`), sidebar collapse, active filter criteria, dialog modal states.

### Controlled Demo Mode:
To ensure the SIH jury evaluation and live presentations never break due to transient cloud network drops:
1. The frontend checks `VITE_API_BASE_URL` and validates connection to `/api/v1/health`.
2. If the API is unreachable, the frontend can seamlessly fall back to the existing deterministic Phase 1 mock services with a clear, honest badge: **DEMO MODE (OFFLINE REPLICA)**.
3. Live production mode and Demo mode are never mixed invisibly.

---

## 8. Environment Configuration & Security

### Frontend `.env.example`
```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_ENABLE_DEMO_FALLBACK=true
```

### Backend `.env.example`
```bash
# FastAPI Server Settings
ENVIRONMENT=development
PORT=8000
CORS_ORIGINS=["http://localhost:3000","https://well-twin-sih.vercel.app"]

# Supabase Database Settings
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_DB_URL=postgresql+asyncpg://postgres:your-password@db.your-project.supabase.co:5432/postgres

# Security Constraints
# NEVER expose the SUPABASE_SERVICE_ROLE_KEY to frontend clients!
```

---

## 9. Testing & Quality Assurance Plan

### 1. Backend Automated Testing (Pytest)
- **Unit Tests**: Schema validation, Pydantic constraints, threshold evaluation logic.
- **Repository Tests**: SQLAlchemy async query execution against test database.
- **API Integration Tests**: `httpx.AsyncClient` verifying all GET/POST/PATCH endpoints return status codes `200/201`, correct payloads, and standardized error envelopes.

### 2. Frontend Integration Verification
- TanStack Query hook test suite verifying successful data transformation from `/api/v1` models into UI representations.
- Type-checking via `npx tsc --noEmit` ensuring zero type drift between backend schemas and TypeScript interfaces.

---

## 10. Phase 2 Acceptance Criteria Checklist

Phase 2 is considered **COMPLETE** only when every gate below is satisfied:

- [ ] FastAPI backend initializes cleanly on Python 3.11+ without warnings.
- [ ] Supabase PostgreSQL database is provisioned and schema is applied via Alembic migrations.
- [ ] Seed script executes and populates the deterministic Baghewala Well BW-017 scenario.
- [ ] `GET /api/v1/health` returns `200 OK` with database health verified.
- [ ] All 11 domain API routers are active and respond with typed Pydantic payloads.
- [ ] Alert state mutation endpoints (`POST /acknowledge`, `POST /resolve`) persist state in Supabase.
- [ ] Work order creation and status patch endpoints (`POST`, `PATCH`) persist in Supabase.
- [ ] Frontend `apiWellService` replaces `mockWellService` by default.
- [ ] All 17 frontend workstation pages render live database data.
- [ ] Production build (`npm run build`) compiles cleanly with 0 TypeScript errors.
- [ ] Controlled Demo Mode fallback operates seamlessly if the backend is detached.
- [ ] Zero secrets or API keys committed to git.
