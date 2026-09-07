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
