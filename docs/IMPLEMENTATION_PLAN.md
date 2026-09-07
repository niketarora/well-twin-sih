# Well Twin — Engineering Implementation Plan

## 1. Master Development Strategy

The Well Twin platform is built following an uncompromising **frontend-first, direct-to-database engineering sequence**.

```text
PHASE 1 — FRONTEND (COMPLETED)
React 18 + TypeScript + Vite + Tailwind CSS
        ↓
Domain-Typed Mock Services + Deterministic Dataset
        ↓
17 Complete Workstation Pages (Dual-Theme Engineering UI)

PHASE 2 — BACKEND + DATABASE (CURRENT / ACTIVE)
FastAPI REST API (/api/v1)
        ↓
Domain Services & Pydantic Validation
        ↓
Supabase PostgreSQL (ACID Relational Database)
        ↓
React Workstation API Integration (TanStack Query)

PHASE 3 — ANALYTICS & ML
        ↓
Hydrodynamic & Thermodynamic Engineering Calculations
        ↓
Physics-Informed Well Health Scoring
        ↓
Multivariate Statistical & Machine Learning Anomaly Detection
        ↓
Production Prediction & Model Drift Diagnostics

PHASE 4 — AI INTELLIGENCE
        ↓
AI Insights Engine with Grounded Telemetry Evidence
        ↓
Prescriptive Recommendations with Production Impact Preview
        ↓
Closed-Loop Decision Support Workflow

PHASE 5 — INTEGRATION & PRODUCTION
        ↓
SCADA & Industrial Historian Ingestion Pipeline
        ↓
Supabase Auth, Row Level Security (RLS) & Role-Based Access
        ↓
CI/CD, Telemetry Observability & Cloud Deployment
```

---

## 2. Phase 1 Completion Summary (COMPLETED)

Phase 1 has successfully delivered the complete, interactive frontend workstation for the Well Twin platform:

- **Frontend Core**: React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, Zustand, React Router 6, Lucide React.
- **Dual-Theme Design System**:
  - Technical Light Mode baseline (clean white `#FFFFFF`, subtle borders `#E2E8F0`, low visual noise).
  - Industrial Dark Mode Control Room (`#0B0F14` canvas, `#151C24` card panels, `#38BDF8` cyan accents).
  - Unconditional default to Light Mode for all new visitors.
  - Header toggle switch with instant transition and `localStorage` persistence.
- **17 Interactive Workstation Pages**:
  - `OverviewPage.tsx`: Executive command center with KPI cards, well health score, physical cause chain, model drift banner, and predicted vs. actual production curve.
  - `DigitalTwinOverviewPage.tsx`: Visual coupling map with thermodynamic, hydraulic, and mechanical data bridges.
  - `WellStatePage.tsx`: Subsurface vs. surface state telemetry tables with live sparklines.
  - `ReservoirPage.tsx`: Steam plume radial heat bubble SVG ($R=18.4\text{ m}$), isotherm selector, and mobile oil saturation curves.
  - `WellborePage.tsx`: Multiphase hydraulic profile to $1,420\text{ m}$ TD, flow regimes, and pressure drop breakdown.
  - `SrpPage.tsx`: Interactive SVG dynamometer card (surface vs. downhole, fluid pound marker @ $2.80\text{ m}$, Goodman fatigue stress analysis).
  - `SurfaceProductionPage.tsx`: Actual vs. predicted production tracking, test separator validation, and waterfall attribution.
  - `TrendsPage.tsx`: Multi-parameter comparative time-series with preset variable pairs (`temp_visc`, `fillage_eff`, `pred_act`, `pip_inflow`).
  - `CssCyclePage.tsx`: 4-phase lifecycle timeline (Injection $\to$ Soak $\to$ Production $\to$ Cooling), historical cycle comparisons, and CSOR tracking.
  - `AlertsPage.tsx`: Severity-filtered operational alert grid with Acknowledge/Resolve state transitions and root-cause details.
  - `AnomaliesPage.tsx`: Sensor deviation heatbars, physical root-cause attribution, and severity scoring.
  - `AiInsightsPage.tsx`: Physics-grounded diagnostic cards with structured evidence arrays and projected production delta ($+13.8\text{ BOPD}$).
  - `EquipmentPage.tsx`: Subsurface and surface asset catalog, health scores, Goodman stress check (Grade D rods at $86.2\%$), and maintenance schedules.
  - `WellDiagramPage.tsx`: Technical wellbore completion schematic SVG with casings, tubing, downhole pump, and depth-correlated P/T profiles.
  - `ModelComparisonPage.tsx`: Subsystem model validation matrix with twin predicted vs. SCADA measured values, residual deviation, and interactive recalibration simulation.
  - `RecommendationsPage.tsx`: 7-field engineering cards, visual workflow strip (`Alert` $\to$ `Insight` $\to$ `Recommendation` $\to$ `Work Order`), and Accept/Reject interactions.
  - `WorkOrdersPage.tsx`: Industrial dispatch table, priority filtering, and modal creation workflow.
- **Data Provenance System**: Explicit badging across all metrics: `OBSERVED`, `ESTIMATED`, `MODEL PREDICTION`, `ACTUAL`, `SYNTHETIC`.
- **Quality & Verification**: 0 TypeScript errors, clean Vite production build in 10.75s, HTTP 200 OK verification on local dev server.

> [!NOTE]
> All Phase 1 views are powered by a unified, deterministic synthetic dataset (Baghewala Well BW-017, CSS Cycle 4, Day 38). No real backend, database, ML or SCADA processing is claimed in Phase 1.

---

## 3. PHASE 2 — FASTAPI + SUPABASE (CURRENT ACTIVE PHASE)

### Technical Objective
Connect the completed React frontend to a production-grade **FastAPI** backend and persistent **Supabase PostgreSQL** database. **There is no temporary in-memory backend phase.** FastAPI connects directly to Supabase PostgreSQL from Step 1.

```text
React Workstation (TanStack Query)
        ↓
FastAPI Application Layer (/api/v1)
        ↓
Domain Service Layer (Validation & Business Logic)
        ↓
Repository Layer (Async SQLAlchemy / Asyncpg)
        ↓
Supabase PostgreSQL (ACID Relational Persistence)
```

### Detailed Phase 2 Implementation Steps (Steps 1 – 21)

#### STEP 1: Backend Foundation
- Initialize `backend/` directory structure with Python 3.11+.
- Configure `requirements.txt` with `fastapi`, `uvicorn`, `pydantic-settings`, `sqlalchemy`, `asyncpg`, `alembic`.
- Set up `app/core/config.py` using Pydantic Settings for environment variables (`SUPABASE_URL`, `SUPABASE_DB_URL`, `CORS_ORIGINS`).
- Configure structured JSON logging in `app/core/logging.py`.
- Create `app/main.py` with FastAPI initialization, CORS middleware, and lifespan handlers.

#### STEP 2: Supabase Project Configuration
- Provision a Supabase PostgreSQL project.
- Obtain database connection strings (`SUPABASE_DB_URL` with asyncpg driver, `SUPABASE_ANON_KEY`).
- Create `backend/.env.example` and `frontend/.env.example` with documented keys.
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is strictly excluded from frontend clients.

#### STEP 3: Database Schema Design
- Draft relational DDL for the core Well Twin data models:
  - `wells` (Master well records, formation, coordinates, operating limits)
  - `telemetry_readings` (Time-series telemetry with compound index `(well_id, timestamp DESC)`)
  - `model_states` (Subsystem physical states: thermal radius, viscosity, liquid holdup, MAPE)
  - `model_predictions` (Predicted vs actual target metrics, confidence envelopes, residual errors)
  - `css_cycles` & `css_cycle_events` (Cycle lifecycle records, cumulative steam/oil)
  - `equipment` (Asset catalog, Goodman stress ratings, maintenance intervals)
  - `alerts` (Operational alarm lifecycle records with status, thresholds, and actions)
  - `anomalies` (Detected multivariate deviations with evidence arrays)
  - `ai_insights` (Structured diagnostic cards with physical evidence)
  - `recommendations` (Prescriptive optimization actions with status tracking)
  - `work_orders` (Field dispatch records with assignments and status progression)

#### STEP 4: Database Migrations
- Configure Alembic in `backend/app/db/migrations/`.
- Generate the baseline migration script (`001_initial_well_twin_schema.py`).
- Execute migration against Supabase PostgreSQL and verify schema tables in Supabase Studio.

#### STEP 5: Seed Synthetic Dataset
- Implement `backend/app/db/seed.py`.
- Migrate the complete Phase 1 deterministic Baghewala Well BW-017 scenario into Supabase:
  - Well metadata (BW-017, CSS Cycle 4, Day 38)
  - 30 days of hourly telemetry history
  - Historical CSS Cycles 1, 2, 3, and active Cycle 4
  - Active and historical alerts, anomalies, and AI insights
  - Equipment records with Goodman stress ratings
  - Prescriptive recommendations and open work orders
  - Digital twin model states and predictions ($184.2\text{ BOPD}$ actual vs. $198.0\text{ BOPD}$ predicted)
- Execute seed script and verify data integrity.

#### STEP 6: Pydantic Schemas
- Build request and response schemas in `backend/app/schemas/`:
  - `WellResponse`, `WellHealthResponse`, `WellStateResponse`
  - `TelemetryReadingResponse`, `TelemetryLatestResponse`, `TrendsQueryRequest`, `TrendPointResponse`
  - `AlertResponse`, `AlertAcknowledgeRequest`, `AlertResolveRequest`
  - `AnomalyResponse`, `CssCycleResponse`, `EquipmentResponse`
  - `AiInsightResponse`, `RecommendationResponse`, `RecommendationStatusUpdate`
  - `WorkOrderResponse`, `WorkOrderCreateRequest`, `WorkOrderUpdateRequest`
  - `ModelStateResponse`, `ModelPredictionResponse`

#### STEP 7: Repository Layer
- Build async database access repositories in `backend/app/repositories/`:
  - `WellRepository`, `TelemetryRepository`, `AlertRepository`, `AnomalyRepository`
  - `CssCycleRepository`, `EquipmentRepository`, `InsightRepository`, `RecommendationRepository`
  - `WorkOrderRepository`, `ModelPredictionRepository`
- Implement time-bounded queries, downsampling aggregation, and ACID mutation methods.

#### STEP 8: Domain Service Layer
- Build business logic services in `backend/app/services/`:
  - `WellService`: Health score calculation and operational state determination
  - `TelemetryService` & `TrendService`: Downsampling algorithms (`1m`, `5m`, `1h`, `1d`)
  - `AlertService`: State transition rules (`active` $\to$ `acknowledged` $\to$ `resolved`)
  - `WorkOrderService`: Work order number generation and status progression
  - `RecommendationService`: Impact validation and status updating

#### STEP 9: API Routers
- Build and mount `/api/v1` routers in `backend/app/api/v1/`:
  - `GET /health`
  - `GET /wells`, `GET /wells/{id}`, `GET /wells/{id}/health`, `GET /wells/{id}/state`
  - `GET /wells/{id}/telemetry`, `GET /wells/{id}/telemetry/latest`, `GET /wells/{id}/trends`
  - `GET /wells/{id}/css-cycles`, `GET /wells/{id}/css-cycles/{cycle_id}`
  - `GET /wells/{id}/equipment`
  - `GET /wells/{id}/alerts`, `POST /alerts/{id}/acknowledge`, `POST /alerts/{id}/resolve`
  - `GET /wells/{id}/anomalies`, `GET /wells/{id}/insights`
  - `GET /wells/{id}/recommendations`, `POST /recommendations/{id}/status`
  - `GET /work-orders`, `GET /work-orders/{id}`, `POST /work-orders`, `PATCH /work-orders/{id}`

#### STEP 10: API Testing
- Implement automated test suite in `backend/tests/` using `pytest` and `httpx`:
  - Verify all GET endpoints return `200 OK` with valid Pydantic schemas.
  - Verify POST/PATCH endpoints mutate state in database and return `200/201`.
  - Verify error handling returns standard HTTP status codes (`400`, `404`, `422`, `500`).

#### STEP 11: Frontend API Client
- Implement a centralized HTTP client in `frontend/src/services/apiClient.ts` using Axios/Fetch.
- Wire API calls to TanStack Query hooks with automated caching, stale times, and refetching.
- Implement error interceptors and network connection detection.

#### STEP 12: Replace Mock Services
- Implement `frontend/src/services/api/` services (`apiWellService`, `apiTelemetryService`, etc.) implementing the exact same TypeScript interfaces as Phase 1 mock services.
- Create a feature-flagged service provider switch:
  - By default, uses `api*Service` pointing to `VITE_API_BASE_URL`.
  - If backend is offline or `VITE_ENABLE_DEMO_FALLBACK=true`, seamlessly falls back to mock services with a clear badge: `DEMO MODE (OFFLINE REPLICA)`.

#### STEP 13: Connect Dashboard & Shell
- Connect `Header.tsx` to `GET /api/v1/wells/{id}/telemetry/latest`.
- Connect `OverviewPage.tsx` to live Well Health, KPI cards, and Model Drift alerts.

#### STEP 14: Connect Charts & Trends
- Connect `TrendsPage.tsx` to `GET /api/v1/wells/{id}/trends` with dynamic date range and metric query params.
- Connect `DynamometerChart.tsx` and `SteamPlumeSvg.tsx` to persistent database telemetry.

#### STEP 15: Connect Alerts & Anomalies
- Connect `AlertsPage.tsx` to `GET /api/v1/wells/{id}/alerts`.
- Wire up interactive "Acknowledge" and "Resolve" buttons to `POST /api/v1/alerts/{id}/...`, verifying instant UI update and database persistence.
- Connect `AnomaliesPage.tsx` to live anomaly records.

#### STEP 16: Connect CSS Cycle
- Connect `CssCyclePage.tsx` to `GET /api/v1/wells/{id}/css-cycles` to render live cycle progression and cumulative metrics.

#### STEP 17: Connect Equipment
- Connect `EquipmentPage.tsx` to `GET /api/v1/wells/{id}/equipment` to display live asset health and Goodman stress indices.

#### STEP 18: Connect Recommendations
- Connect `RecommendationsPage.tsx` to `GET /api/v1/wells/{id}/recommendations`.
- Wire up "Accept" and "Reject" buttons to mutate recommendation status in Supabase.

#### STEP 19: Connect Work Orders
- Connect `WorkOrdersPage.tsx` to `GET /api/v1/work-orders`.
- Wire up "Create Work Order" modal to `POST /api/v1/work-orders`, creating real records in Supabase.
- Wire up status changes to `PATCH /api/v1/work-orders/{id}`.

#### STEP 20: End-to-End System Testing
- Conduct complete user journey verification across all 17 pages on live database.
- Test server reboot to verify persistence of mutated work orders and acknowledged alerts.
- Test intentional network disconnect to verify graceful Controlled Demo Mode fallback.

#### STEP 21: Production Deployment
- Deploy frontend to **Vercel** with SPA rewrites configured.
- Deploy FastAPI backend to **Render / Railway** with environment variables set.
- Connect production backend to production **Supabase PostgreSQL** instance.
- Verify production deployment with end-to-end telemetry queries.

---

## 4. Phase 2 Quality Gate & Acceptance Criteria

Phase 2 is accepted as complete only when:
- [ ] FastAPI backend starts cleanly and passes all Pytest unit/integration tests.
- [ ] Supabase PostgreSQL database contains fully migrated schema and seeded dataset.
- [ ] `GET /api/v1/health` returns `200 OK` with database health status verified.
- [ ] All 17 frontend pages consume live data from FastAPI endpoints.
- [ ] Frontend does NOT directly connect to Supabase for business logic.
- [ ] Alert mutations (`acknowledge`, `resolve`) persist to database upon page refresh.
- [ ] Work order creation and status changes persist to database upon page refresh.
- [ ] Trends chart correctly queries time-range and downsampled intervals from `/trends`.
- [ ] Controlled Demo Mode operates cleanly if backend is disconnected.
- [ ] Production build (`npm run build`) succeeds with 0 TypeScript errors.
- [ ] No secrets or service role keys are committed to git.

---

## 5. Later Phases (Phases 3, 4, and 5)

### PHASE 3 — ANALYTICS & ML
- Connect analytical pipelines directly to stored database readings:
  ```text
  Supabase PostgreSQL → FastAPI Analytics Engine → model_states & model_predictions → React UI
  ```
- Implement physics-informed calculations:
  - Downhole crude viscosity curve ($\mu(T) = \mu_0 e^{b(T_0 - T)}$)
  - Multiphase inflow performance relationship (Vogel IPR)
  - Sucker rod pump kinematic fillage and fluid pound detection
  - Steam chamber heat balance and isothermal radius expansion
- Implement ML & statistical anomaly detection:
  - Rolling z-score and EWMA on high-frequency telemetry
  - Isolation Forest for multivariate anomaly detection
  - Predicted vs. actual production tracking with P10/P50/P90 confidence envelopes
  - Quantitative model drift alerts

### PHASE 4 — AI INTELLIGENCE
- Implement provider-agnostic backend AI copilot service:
  ```text
  Telemetry + Anomalies → Feature Extraction → Physical Context Builder → LLM → Structured Pydantic Validation → Supabase → FastAPI → Frontend
  ```
- Condition insights strictly on observable physical evidence and thermodynamic rules.
- Generate prescriptive recommendations with simulated production delta ($+13.8\text{ BOPD}$).
- Provide explainable root-cause attribution chains.

### PHASE 5 — REAL DATA & PRODUCTION HARDENING
- Ingest live telemetry via SCADA adapters (OPC-UA, Modbus, MQTT, batch CSV).
- Integrate Supabase Auth with JWT validation and role-based access control.
- Enforce PostgreSQL Row Level Security (RLS).
- Add operational audit logging, monitoring, and automated CI/CD pipelines.

---

## 6. Final End-to-End Architecture

```text
SCADA / OPC-UA / Batch Telemetry Ingestion
                    ↓
           Supabase PostgreSQL
(Relational Master Data, Time-Series Readings, RLS)
                    ↓
          FastAPI Backend Service
(Domain Logic, Pydantic v2, Analytics & ML, AI Copilot)
                    ↓  REST API (/api/v1)
        React Engineer Workstation
(Vite, Tailwind, TanStack Query, Zustand, Dual-Theme)
                    ↓
       Petroleum Production Engineer
 (Monitor → Diagnose Cause Chain → Accept Recommendation → Dispatch Work Order)
```
