# Technical Requirements Document (TRD)

# Well Twin --- Frontend-First Architecture

## 1. Technical Objective

Build Well Twin as a modular full-stack system, but implement it in a
**frontend-first sequence**.

The first implementation phase uses:

-   React
-   TypeScript
-   Vite
-   Tailwind CSS
-   React Router
-   TanStack Query
-   Zustand
-   Recharts or ECharts
-   Lucide React

No backend or database dependency is required during Phase 1.

Later phases introduce: - FastAPI - Supabase PostgreSQL - analytics/ML -
AI - authentication - real telemetry/SCADA

## 2. Architecture Evolution

### Phase 1

``` text
React + TypeScript
       ↓
Feature Hooks
       ↓
Mock Services
       ↓
Mock Data
```

### Phase 2

``` text
React
  ↓
FastAPI
  ↓
Service Layer
  ↓
In-memory / temporary data
```

### Phase 3

``` text
React
  ↓
FastAPI
  ↓
Supabase PostgreSQL
```

### Final

``` text
SCADA / CSV / External Data
            ↓
       Ingestion Layer
            ↓
      Supabase PostgreSQL
            ↓
       Analytics / ML
            ↓
          FastAPI
            ↓
 React + TypeScript + Vite
            ↓
       Engineer UI
```

## 3. Phase 1 Frontend Architecture

### Repository

``` text
well-twin/
├── frontend/
├── backend/              # created later
├── data/                 # created later
├── docs/
│   ├── PRD.md
│   ├── TRD.md
│   └── IMPLEMENTATION_PLAN.md
├── scripts/              # later
└── .github/
```

### Frontend

``` text
frontend/
└── src/
    ├── app/
    │   ├── router.tsx
    │   └── providers.tsx
    │
    ├── components/
    │   ├── ui/
    │   ├── charts/
    │   ├── kpi/
    │   ├── alerts/
    │   ├── health/
    │   └── equipment/
    │
    ├── features/
    │   ├── overview/
    │   ├── well-state/
    │   ├── srp/
    │   ├── trends/
    │   ├── css-cycle/
    │   ├── alerts/
    │   ├── anomalies/
    │   ├── ai-insights/
    │   ├── equipment/
    │   ├── recommendations/
    │   └── work-orders/
    │
    ├── layouts/
    │   ├── AppLayout.tsx
    │   ├── Sidebar.tsx
    │   └── Header.tsx
    │
    ├── pages/
    ├── mock/
    │   ├── wells.ts
    │   ├── telemetry.ts
    │   ├── alerts.ts
    │   ├── anomalies.ts
    │   ├── equipment.ts
    │   ├── cssCycles.ts
    │   ├── recommendations.ts
    │   ├── workOrders.ts
    │   └── aiInsights.ts
    │
    ├── types/
    ├── hooks/
    ├── stores/
    ├── lib/
    └── styles/
```

## 4. Frontend Domain Model

Define TypeScript types before building pages.

Core types:

``` text
Well
TelemetryReading
Kpi
WellHealth
SubsystemHealth
WellState
Equipment
Alert
Anomaly
CssCycle
AiInsight
Recommendation
WorkOrder
OperationalEvent
```

Do not use `any` for domain objects.

## 5. Mock Service Layer

The frontend must not import mock arrays directly inside components.

Create service interfaces.

Example concept:

``` text
wellService
telemetryService
alertService
anomalyService
equipmentService
cssCycleService
insightService
recommendationService
workOrderService
```

Phase 1 implementation:

``` text
wellService → mock implementation
```

Later:

``` text
wellService → API implementation
```

This allows backend integration without rewriting presentation
components.

## 6. State Management

Use TanStack Query for asynchronous/server-shaped state even if Phase 1
data is mocked.

Use Zustand for: - selected well - sidebar state - filters - selected
metrics - UI preferences

Do not put all application data into Zustand.

## 7. Routing

Suggested routes:

``` text
/
 /overview
 /well-state
 /srp-pump
 /trends
 /css-cycle
 /alerts
 /anomalies
 /ai-insights
 /equipment
 /well-diagram
 /recommendations
 /work-orders
```

Use a shared `AppLayout`.

## 8. Frontend Component Requirements

Required reusable components:

``` text
KpiCard
HealthScore
SubsystemHealth
StatusBadge
SeverityBadge
TrendChart
TimeRangeSelector
MetricSelector
AlertCard
AlertDetail
AnomalyCard
InsightCard
RecommendationCard
EquipmentCard
Timeline
DataTable
LoadingSkeleton
EmptyState
ErrorState
```

Components should be composable and domain-aware without being tightly
coupled to a future backend.

## 9. Chart Requirements

Charts must support: - multiple series - time range - metric selection -
tooltip - crosshair where supported - threshold lines - normal bands -
event markers - anomaly markers - current value - responsive sizing

For large future datasets, the backend will eventually
downsample/aggregate data.

## 10. Mock Dataset Requirements

Create deterministic synthetic telemetry representing one oil well.

Fields can include:

``` text
timestamp
oil_rate
water_rate
steam_rate
bottomhole_pressure
bottomhole_temperature
pump_speed
stroke_rate
pump_fillage
motor_current
torque
vibration
casing_pressure
tubing_pressure
fluid_level
```

The dataset must contain: - normal operating periods - gradual pump
fillage decline - pressure changes - temperature changes - production
changes - anomalous periods - equipment degradation pattern - CSS cycle
transitions

This makes the frontend visually meaningful.

## 11. Phase 2 --- FastAPI

Create:

``` text
backend/
└── app/
    ├── main.py
    ├── core/
    ├── api/
    │   └── v1/
    ├── schemas/
    ├── models/
    ├── repositories/
    ├── services/
    ├── ml/
    ├── db/
    └── tests/
```

API base:

``` text
/api/v1
```

Initial endpoints:

``` text
GET /health

GET /wells
GET /wells/{well_id}
GET /wells/{well_id}/health
GET /wells/{well_id}/state
GET /wells/{well_id}/telemetry
GET /wells/{well_id}/trends
GET /wells/{well_id}/equipment
GET /wells/{well_id}/alerts
GET /wells/{well_id}/anomalies
GET /wells/{well_id}/css-cycles
GET /wells/{well_id}/ai-insights
GET /wells/{well_id}/recommendations

POST /alerts/{alert_id}/acknowledge
POST /alerts/{alert_id}/resolve

GET /work-orders
POST /work-orders
PATCH /work-orders/{work_order_id}
```

Route handlers must remain thin. Business logic belongs in services.

## 12. Phase 3 --- Supabase

Use Supabase PostgreSQL.

Core tables:

### wells

``` text
id UUID PK
well_code TEXT UNIQUE
name TEXT
field_name TEXT
location TEXT
status TEXT
artificial_lift_type TEXT
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

### telemetry_readings

``` text
id BIGINT PK
well_id UUID FK
timestamp TIMESTAMPTZ
oil_rate DOUBLE
water_rate DOUBLE
steam_rate DOUBLE
bottomhole_pressure DOUBLE
bottomhole_temperature DOUBLE
pump_speed DOUBLE
stroke_rate DOUBLE
pump_fillage DOUBLE
motor_current DOUBLE
torque DOUBLE
vibration DOUBLE
casing_pressure DOUBLE
tubing_pressure DOUBLE
fluid_level DOUBLE
```

Index:

``` text
(well_id, timestamp DESC)
```

Additional tables: - equipment - alerts - anomalies - css_cycles -
ai_insights - recommendations - work_orders

## 13. Phase 4 --- Analytics / ML

Start with explainable methods.

### Well Health

Example initial weighting:

``` text
Reservoir       25%
Wellbore        25%
Artificial Lift 30%
Surface & Flow  20%
```

Make weights configurable.

### Anomaly Detection

Start with: - threshold rules - rolling z-score - moving averages - EWMA

Add Isolation Forest or other ML only when justified by data.

## 14. Phase 5 --- AI

Use a provider-agnostic backend interface:

``` text
AIInsightService
 ├── OpenAIProvider
 ├── GeminiProvider
 └── MockProvider
```

Process:

``` text
Telemetry
 ↓
Feature extraction
 ↓
Anomaly/event detection
 ↓
Context builder
 ↓
AI model
 ↓
Structured schema validation
 ↓
Database
 ↓
Frontend
```

AI must not directly receive uncontrolled raw application state from the
browser.

## 15. Phase 6 --- Production

Implement: - Supabase Auth - JWT validation - role-based access - RLS -
audit logs - real telemetry ingestion - SCADA adapter - error
monitoring - CI/CD - deployment

## 16. Security

Never expose: - Supabase service role key - database credentials - AI
provider secrets

Frontend should only receive public/client-safe configuration.

All mutation operations eventually require authentication and
authorization.

## 17. Performance

Phase 1: - lazy-load heavy pages/charts where useful - avoid unnecessary
re-renders - virtualize long tables if needed - optimize chart data

Later: - indexed telemetry queries - server-side aggregation -
time-range limits - downsampling - caching

## 18. Testing

### Phase 1

-   component tests
-   route tests
-   mock-service tests
-   chart rendering tests where valuable
-   responsive checks
-   accessibility checks

### Phase 2+

-   API unit tests
-   integration tests
-   database tests
-   ML tests
-   end-to-end tests

## 19. Phase Gates

### Gate 1 --- Frontend Complete

Must have: - all pages - complete navigation - mock data -
interactions - polished design - responsive UI - loading/error/empty
states

### Gate 2 --- Backend Connected

Mock services are replaced by FastAPI services.

### Gate 3 --- Persistent Data

FastAPI uses Supabase.

### Gate 4 --- Intelligence

Analytics, anomaly detection and AI work on real stored data.

### Gate 5 --- Production

Authentication, security, testing, deployment and monitoring complete.

## 20. Technical Principle

The frontend is the first deliverable.

Do not block frontend development on data availability.

Design every frontend feature against a stable domain type and service
interface. When FastAPI becomes available, swap the mock implementation
for the API implementation.

This is the key architectural decision that prevents a large frontend
rewrite later.
