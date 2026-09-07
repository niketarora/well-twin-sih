# Well Twin --- Master Project Specification

# Well Twin --- Frontend-First Implementation Plan

## 1. Strategy

The project will be developed in phases. **Phase 1 is frontend-only**
and must be completed before FastAPI, Supabase, ML, AI, or real
telemetry integration begins.

The frontend will use realistic, deterministic mock data so that the
complete product experience can be designed, tested, and demonstrated
independently of the backend.

### Development sequence

``` text
PHASE 1 — FRONTEND
React + TypeScript + Vite
        ↓
Complete UI/UX + mock data
        ↓
All pages + navigation + interactions
        ↓
Responsive + polished engineering UI

PHASE 2 — BACKEND
FastAPI
        ↓
API architecture + business services
        ↓
Telemetry / alerts / analytics APIs

PHASE 3 — DATABASE
Supabase PostgreSQL
        ↓
Schema + migrations + telemetry storage
        ↓
FastAPI → Supabase

PHASE 4 — ANALYTICS & ML
        ↓
Well Health
        ↓
Anomaly Detection
        ↓
Predictions

PHASE 5 — AI INTELLIGENCE
        ↓
AI Insights
        ↓
Evidence + explanations
        ↓
Recommendations

PHASE 6 — INTEGRATION & PRODUCTION
        ↓
Authentication + real data/SCADA
        ↓
Testing + deployment + monitoring
```

## 2. Technology Stack

### Phase 1 Frontend

-   React
-   TypeScript
-   Vite
-   React Router
-   Tailwind CSS
-   TanStack Query
-   Zustand
-   Recharts or Apache ECharts
-   Lucide React
-   Zod

### Later phases

-   Backend: FastAPI + Python
-   Storage: Supabase PostgreSQL
-   Auth: Supabase Auth
-   File storage: Supabase Storage
-   Analytics/ML: Pandas, NumPy, scikit-learn
-   AI: provider-agnostic backend AI service
-   Deployment: Vercel + Render/Railway + Supabase
-   CI/CD: GitHub Actions

------------------------------------------------------------------------

# PHASE 1 --- FRONTEND

## 3. Phase 1 Objective

Create the complete Well Twin web application as a polished,
engineer-first product using mock data.

At the end of Phase 1, a user should be able to navigate through the
entire application and experience the complete intended workflow without
any backend dependency.

### Phase 1 must NOT depend on:

-   FastAPI
-   Supabase
-   SCADA
-   external telemetry APIs
-   ML services
-   AI API calls

## 4. Frontend Foundation

Create:

``` text
frontend/
└── src/
    ├── app/
    ├── components/
    ├── features/
    ├── layouts/
    ├── pages/
    ├── mock/
    ├── types/
    ├── hooks/
    ├── stores/
    ├── lib/
    └── styles/
```

### Recommended structure

``` text
src/
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

## 5. Mock Data Architecture

Do not hardcode values directly inside components.

All UI data should come from mock repositories/services.

Example:

``` text
UI Component
    ↓
Feature hook
    ↓
Mock service
    ↓
Mock dataset
```

This creates a clean replacement point for Phase 2.

Example:

``` text
Phase 1:
useWell() → mockWellService

Phase 2:
useWell() → apiWellService
```

The component itself should not need to change.

## 6. Design System

The frontend should follow the previously defined visual direction:

**Modern industrial SCADA + engineering analytics + subtle AI copilot.**

### Principles

-   light industrial background
-   clean white surfaces
-   charcoal/navy primary text
-   restrained petroleum/gold accent
-   green = healthy
-   amber = warning
-   red = critical
-   subtle borders
-   restrained shadows
-   professional typography
-   clear hierarchy
-   minimal decorative UI
-   data density without clutter

### Typography

Use Inter or a comparable modern UI font.

Use: - strong hierarchy for page titles - compact labels - prominent KPI
values - monospace or tabular numbers for telemetry - consistent
capitalization for engineering labels

## 7. Application Shell

Build this first.

### Header

Show: - well name - field/location - well ID - production phase - CSS
cycle - SCADA connection state - last updated time - demo/synthetic data
indicator

### Sidebar

``` text
MONITORING
  Overview
  Well State
  SRP / Pump
  Trends
  CSS Cycle
  Alerts

INTELLIGENCE
  AI Insights
  Anomalies
  Predictions

FIELD
  Equipment
  Well Diagram

OPERATIONS
  Work Orders
  Recommendations
```

Requirements: - active state - icons - alert count badges - collapsible
groups if useful - responsive behavior

## 8. Page Implementation Order

### 8.1 Overview

The main engineer command center.

Structure:

``` text
Well Header
    ↓
Well Health
    ↓
KPI Cards
    ↓
Engineer Focus
    ↓
Production Trends
    ↓
Active Alerts
    ↓
Recent Events
    ↓
Recommendations
```

Well Health must include: - score /100 - overall status - Reservoir
health - Wellbore health - Artificial Lift health - Surface & Flow
health - dominant concern

KPI cards: - Net Oil Production - Bottomhole Temperature - Bottomhole
Pressure - Pump Fillage - Oil/Steam Ratio

Every KPI should show: - value - unit - trend - comparison period -
normal range - status

### 8.2 Well State

Show: - operating state - production state - artificial-lift state - CSS
phase - pressure - temperature - fluid level - key operating
parameters - recent state transitions

### 8.3 SRP / Pump

Show: - pump status - pump fillage - stroke rate - pump speed - motor
current - torque - vibration - health score - historical behavior

### 8.4 Trends

Create a professional engineering analytics interface.

Controls: - metric selector - 24H - 7D - 30D - Full Cycle

Charts: - clean axes - units - normal operating bands - thresholds -
operational events - anomaly markers - current-value indicators - hover
tooltips - crosshair - legends

### 8.5 CSS Cycle

Show: - current cycle - current phase - phase timeline - phase
duration - production response - historical cycles - cycle comparison -
relevant events

### 8.6 Alerts

Tabs/states: - Active - Acknowledged - Resolved

Each alert: - severity - title - subsystem - metric - observed value -
threshold - timestamp - explanation - recommended action

Frontend interactions: - acknowledge - resolve - open details - filter
by severity/status

These are mock state changes in Phase 1.

### 8.7 Anomalies

Show: - anomaly timeline - severity - anomaly score - affected metric -
time window - evidence - possible cause - related alert

### 8.8 AI Insights

Make it an engineering copilot rather than a generic chatbot.

Example structure:

``` text
AI INSIGHT

Pump fillage declining

Confidence: 82%
Severity: Medium

WHAT HAPPENED
Pump fillage decreased over the last 7 days.

EVIDENCE
• Pump fillage ↓ 3.6 points
• Fluid level ↑ 4.2 m
• Oil production ↓ 1.0%

LIKELY CAUSE
Increasing fluid interference.

RECOMMENDED ACTION
Review pump speed and fluid level.

[View Supporting Data]
```

All values are mock data in Phase 1.

### 8.9 Equipment

Provide: - equipment cards - health - status - telemetry - maintenance
status - related alerts

Create a digital-twin/well schematic showing: - wellhead - tubing -
casing - artificial-lift equipment - downhole components - surface
equipment

### 8.10 Recommendations

Show: - title - priority - action - reason - evidence - expected
impact - confidence - status

### 8.11 Work Orders

Frontend prototype: - list - details - status - priority - assignment -
related alert - related recommendation - notes

Support mock create/update flows.

## 9. Reusable Components

Build reusable components before duplicating UI:

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
EmptyState
LoadingSkeleton
ErrorState
```

## 10. Frontend Interaction Requirements

Implement: - route navigation - filters - tabs - time-range selection -
metric selection - chart hover - alert acknowledgment - alert
resolution - work-order creation - work-order status changes -
recommendation status changes - sidebar collapse - responsive layout

All mutations are local/mock in Phase 1.

## 11. Required UI States

Every major page needs: - loading skeleton - empty state - error state -
populated state

Do not create blank screens.

## 12. Responsive Requirements

Optimize for: - 1920px desktop - 1440px desktop - laptop - tablet

Desktop is the primary engineering workstation experience.

Avoid: - horizontal overflow - unreadable charts - excessively
compressed cards - navigation collisions

## 13. Frontend Quality Gate

Phase 1 is complete only when:

### Architecture

-   [ ] React + TypeScript + Vite configured
-   [ ] routing implemented
-   [ ] feature-based structure implemented
-   [ ] mock data separated from UI
-   [ ] reusable component library established

### Pages

-   [ ] Overview
-   [ ] Well State
-   [ ] SRP/Pump
-   [ ] Trends
-   [ ] CSS Cycle
-   [ ] Alerts
-   [ ] Anomalies
-   [ ] AI Insights
-   [ ] Equipment
-   [ ] Well Diagram
-   [ ] Recommendations
-   [ ] Work Orders

### UX

-   [ ] loading states
-   [ ] empty states
-   [ ] error states
-   [ ] responsive behavior
-   [ ] consistent typography
-   [ ] consistent spacing
-   [ ] consistent status colors
-   [ ] polished charts
-   [ ] navigation works

### Demo

The complete application can be demonstrated without any backend.

------------------------------------------------------------------------

# PHASE 2 --- FASTAPI BACKEND

## 14. Objective

Replace frontend mock services with FastAPI while preserving the
frontend contracts.

Build: - `/api/v1` - well APIs - telemetry APIs - trend APIs - alert
APIs - anomaly APIs - equipment APIs - CSS cycle APIs - recommendation
APIs - AI insight APIs - work-order APIs

Keep business logic in services, not route handlers.

------------------------------------------------------------------------

# PHASE 3 --- SUPABASE

## 15. Objective

Introduce Supabase PostgreSQL as the persistent data layer.

Create tables for: - wells - telemetry_readings - equipment - alerts -
anomalies - css_cycles - ai_insights - recommendations - work_orders

Add: - indexes - migrations - constraints - RLS - seed data

Flow:

``` text
React
  ↓
FastAPI
  ↓
Supabase
```

The frontend should not bypass FastAPI for application business
operations.

------------------------------------------------------------------------

# PHASE 4 --- ANALYTICS & ML

Implement: - Well Health Score - engineering rules - statistical anomaly
detection - optional ML anomaly detection - derived metrics - trend
analysis - predictions when data quality supports them

Start with transparent, explainable methods.

------------------------------------------------------------------------

# PHASE 5 --- AI INTELLIGENCE

Implement a provider-agnostic AI service.

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
Structured validation
 ↓
Stored insight
 ↓
Frontend
```

AI must never invent telemetry values.

------------------------------------------------------------------------

# PHASE 6 --- INTEGRATION & PRODUCTION

Implement: - Supabase Auth - role-based authorization - real telemetry
ingestion - SCADA adapter - audit logs - CI/CD - performance
optimization - monitoring - deployment

## 16. Final End-to-End Architecture

``` text
SCADA / CSV / Demo
        ↓
   Ingestion Layer
        ↓
Supabase PostgreSQL
        ↓
 Analytics / ML
        ↓
      FastAPI
        ↓
React + TypeScript
        ↓
 Engineer UI
        ↓
Engineer Action
```

## 17. Critical Rule

Do not begin backend work until the Phase 1 frontend quality gate is
complete.

The frontend should be designed around stable domain concepts and mock
service contracts so that backend integration later becomes a
data-source replacement rather than a UI rewrite.

------------------------------------------------------------------------

# Product Requirements Document (PRD)

# Well Twin --- Digital Twin & Decision Support Platform

## 1. Product Summary

Well Twin is an engineer-first digital twin and decision-support
platform for monitoring and understanding an oil well.

It brings together: - production - artificial lift - well state -
telemetry trends - alerts - anomalies - CSS cycles - equipment
condition - AI insights - recommendations - work orders

The product goal is to help an engineer understand what is happening at
a well, why it may be happening, and what action should be considered.

## 2. Product Development Strategy

The product will be delivered **frontend-first**.

### Phase 1

Complete the entire user experience using mock data.

### Phase 2

Introduce FastAPI.

### Phase 3

Introduce Supabase persistence.

### Phase 4

Introduce analytics and ML.

### Phase 5

Introduce AI intelligence.

### Phase 6

Introduce production integrations and hardening.

This allows the product UI to be completed and demonstrated without
waiting for backend/data infrastructure.

## 3. Problem Statement

Oil-well operational information can be distributed across SCADA
systems, historical data, reports and engineering workflows. Engineers
may need to manually inspect multiple parameters and correlate
production, pressure, temperature, artificial-lift behavior and
operational events.

This increases: - diagnosis time - cognitive load - difficulty detecting
developing problems - inconsistency in operational decisions

Well Twin provides a unified engineer-focused workspace.

## 4. Target Users

### Primary

Petroleum / production engineers.

### Secondary

-   field operators
-   artificial-lift engineers
-   maintenance teams
-   engineering managers

## 5. Product Principles

1.  Engineer first.
2.  Data before decoration.
3.  Trends over isolated values.
4.  Explain important insights.
5.  Recommendations must be actionable.
6.  AI must be grounded in evidence.
7.  Critical information must be scannable.
8.  Uncertainty must be visible.
9.  The UI must remain useful without AI.
10. Do not over-engineer the MVP.

## 6. Core User Journey

``` text
Open Well
   ↓
Overview
   ↓
Check Well Health
   ↓
Review Engineer Focus
   ↓
Inspect Alert / Anomaly
   ↓
Open Supporting Trend
   ↓
Review AI Insight
   ↓
Review Recommendation
   ↓
Take / Track Action
```

## 7. Frontend MVP Requirements

The Phase 1 frontend must provide a complete clickable product
experience using mock data.

### FR-01 --- Application Shell

Provide: - header - sidebar - navigation - breadcrumbs - page titles -
notification system - responsive layout

### FR-02 --- Overview

Display: - well identity - field/location - well ID - operating phase -
CSS cycle - connection state - last updated - demo data state - Well
Health Score - subsystem health - KPI cards - Engineer Focus - trends -
active alerts - recent events - recommendations

### FR-03 --- KPI Monitoring

Initial KPI set: - net oil production - bottomhole temperature -
bottomhole pressure - pump fillage - oil/steam ratio

Additional telemetry may include: - water rate - steam rate - pump
speed - stroke rate - motor current - torque - vibration - casing
pressure - tubing pressure - fluid level

Each KPI should show: - current value - unit - trend - comparison
period - normal range - status

### FR-04 --- Well Health

Display a 0--100 score with: - overall status - Reservoir - Wellbore -
Artificial Lift - Surface & Flow

Show contributing factors and dominant concern.

In Phase 1 the score is mock data.

### FR-05 --- Well State

Display: - operating state - production state - artificial-lift state -
CSS phase - pressure - temperature - fluid level - operating
parameters - state transitions

### FR-06 --- SRP / Pump

Display: - pump state - pump fillage - stroke rate - pump speed - motor
current - torque - vibration - health - trends

### FR-07 --- Trends

Engineers must be able to: - select metrics - choose 24H / 7D / 30D /
Full Cycle - inspect exact values - see thresholds - see normal ranges -
see events - see anomaly markers

### FR-08 --- CSS Cycle

Display: - current cycle - phase - timeline - phase duration -
production response - historical cycles - comparison

### FR-09 --- Alerts

Alert states: - Active - Acknowledged - Resolved

Alert details: - severity - title - subsystem - metric - value -
threshold - time - explanation - recommended action

Phase 1 supports mock interactions.

### FR-10 --- Anomalies

Display: - anomaly score - severity - affected metric - time window -
evidence - possible cause - related alert

### FR-11 --- AI Insights

Display: - insight title - summary - evidence - likely cause -
recommendation - confidence

Phase 1 uses pre-generated mock insights.

### FR-12 --- Equipment / Digital Twin

Display: - equipment - status - health - telemetry - maintenance state -
relationships

Provide a visual well/equipment schematic.

### FR-13 --- Recommendations

Display: - action - priority - reason - evidence - expected impact -
confidence - status

### FR-14 --- Work Orders

Provide frontend interactions for: - list - detail - create - status
change - priority - assignment - notes - related alert/recommendation

## 8. Frontend UX Requirements

Every major page must have: - populated state - loading state - empty
state - error state

The interface must: - work on desktop and tablet - use consistent
spacing - use consistent typography - use consistent status semantics -
avoid visual clutter - prioritize actionable engineering information

## 9. Phase 1 Acceptance Criteria

The frontend is accepted when:

1.  All required pages exist.
2.  Sidebar navigation works.
3.  All pages use centralized mock data.
4.  No page depends on FastAPI or Supabase.
5.  Charts are interactive.
6.  Alerts have working mock state transitions.
7.  Work orders have working mock create/update flows.
8.  AI insight cards display evidence and confidence.
9.  Responsive layout works at target breakpoints.
10. Loading/error/empty states exist.
11. The UI follows one consistent design system.
12. The full engineer workflow can be demonstrated end-to-end.

## 10. Later Product Requirements

After Phase 1:

### Phase 2

FastAPI APIs.

### Phase 3

Supabase persistence.

### Phase 4

Analytics and ML.

### Phase 5

AI intelligence.

### Phase 6

Authentication, real data/SCADA integration, production deployment.

## 11. Future Scope

-   multi-well fleet
-   live streaming telemetry
-   predictive maintenance
-   production forecasting
-   optimization
-   advanced digital-twin simulation
-   mobile interface
-   SCADA integration
-   automated work-order systems

------------------------------------------------------------------------

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
