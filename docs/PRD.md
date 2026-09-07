# Product Requirements Document (PRD)

# Well Twin — Digital Twin & Decision Support Platform

## 1. Product Summary

Well Twin is an engineer-first digital twin and decision-support platform for monitoring, diagnosing, and optimizing heavy-oil Cyclic Steam Stimulation (CSS) and Sucker Rod Pump (SRP) operations.

It integrates:
- Subsurface reservoir & thermal dynamics
- Wellbore multiphase hydraulics
- Sucker rod pump (SRP) mechanical lift dynamics
- Surface production & separation telemetry
- Telemetry trends & multi-metric correlations
- Structured operational alerts & lifecycle workflows
- Multivariate anomaly detection & root-cause attribution
- CSS lifecycle tracking & multi-cycle benchmarking
- Equipment catalog & Goodman stress/fatigue indices
- Physics-grounded AI insights with structured evidence
- Prescriptive engineering recommendations with impact preview
- Closed-loop field work order management & audit trails

The product goal is to empower production and petroleum engineers to immediately understand what is happening at a well, physically why it is happening, and precisely what engineering action should be taken.

---

## 2. Product Development Strategy

The product follows a rigorous **frontend-first, architecture-disciplined sequence**.

```
PHASE 1 — FRONTEND (COMPLETED)
React + TypeScript + Vite + Tailwind CSS
        ↓
Feature-Based Architecture + Typed Mock Services
        ↓
Complete Dual-Theme Engineer Workstation (17 Routes)

PHASE 2 — BACKEND + DATABASE (CURRENT)
FastAPI REST API (/api/v1)
        ↓
Service Layer + Repository Layer
        ↓
Supabase PostgreSQL (Single Source of Truth)
        ↓
React Frontend Integration (Replacing Mock Services)

PHASE 3 — ANALYTICS + ML
        ↓
Engineering Calculations & Derived Telemetry
        ↓
Deterministic Well Health Scoring
        ↓
Statistical & Unsupervised Anomaly Detection
        ↓
Production Prediction & Confidence Envelopes
        ↓
Model Validation & Quantitative Drift Tracking

PHASE 4 — AI INTELLIGENCE
        ↓
Engineering Insights Engine
        ↓
Multivariate Physical Evidence Attribution
        ↓
Prescriptive Recommendations with Impact Simulation
        ↓
Decision Support & Engineering Audit Trail

PHASE 5 — REAL DATA + PRODUCTION
        ↓
SCADA & Historian Ingestion Pipeline
        ↓
Supabase Authentication & Role-Based Access Control (RLS)
        ↓
Production Hardening, CI/CD, Observability & Deployment
```

### Phase 1 Status: COMPLETED

Phase 1 has delivered the complete, fully working presentation layer and user experience for the Well Twin platform as a control-room-grade workstation:
- **Frontend Architecture**: React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, Zustand, React Router 6, Lucide React, and custom SVG visualizers.
- **Dual-Theme Design System**: Clean technical Light Theme baseline and high-contrast Industrial Dark Mode (Control Room `#0B0F14`/`#151C24` with `#38BDF8` cyan accents) with header toggle, system preference auto-detection, and `localStorage` persistence. New user sessions unconditionally default to Light Mode.
- **17 Interactive Workstation Pages**:
  - `Overview`: Command center with KPI cards, well health score, physical cause chain, model drift alert, and predicted vs. actual production with confidence bands.
  - `Digital Twin Overview`: Coupling diagram showing inter-subsystem flow bridges, solver convergence metrics, and cross-model agreement.
  - `Well State`: Subsurface vs. surface state telemetry tables, sparklines, and status badges.
  - `Reservoir & Thermal Twin`: Radial steam plume SVG visualizer ($R = 18.4\text{ m}$), isotherm selector, heat loss calculator, and mobile oil saturation curves.
  - `Wellbore Hydrodynamics Twin`: Multiphase hydraulic profile to $1,420\text{ m}$ TD, flow regime visualizer (slug/churn/bubble), frictional vs. hydrostatic pressure loss.
  - `SRP Lift Dynamics Twin`: Full-screen interactive dynamometer card (surface vs. downhole toggle, fluid pound inception marker at $2.80\text{ m}$, Goodman fatigue stress analysis).
  - `Surface Production Twin`: Actual vs. predicted production tracking, test separator validation, waterfall attribution, and flowline pressure monitoring.
  - `Trends`: Multi-parameter comparative analytics with preset pairs (`temp_visc`, `fillage_eff`, `pred_act`, `pip_inflow`), custom timeframes (24h, 7d, 30d, Full Cycle), and cycle overlays.
  - `CSS Cycle`: 4-phase lifecycle timeline (Steaming $\to$ Soaking $\to$ Production $\to$ Cooling), historical cycle comparisons, and cumulative steam-to-oil ratio ($CSOR = 3.18$).
  - `Alerts`: Severity-filtered alert grid with live store actions (Acknowledge, Snooze 1h/4h/24h, Escalate to Work Order) and structured root-cause details.
  - `Anomalies`: Sensor deviation heatbars, physical root-cause attribution, and severity scoring.
  - `AI Insights`: Physics-informed diagnostic cards with structured evidence, thermodynamic backing, and projected production delta ($+13.8\text{ BOPD}$).
  - `Model Validation & Drift`: Subsystem model validation matrix with twin predicted vs. SCADA measured values, residual deviation, and interactive recalibration simulation.
  - `Equipment`: Asset catalog, health scores, Goodman stress check (Grade D rods at $86.2\%$), and maintenance schedules.
  - `Well Diagram`: Technical wellbore completion schematic SVG with casings, tubing, downhole pump, and depth-correlated gradient charts.
  - `Recommendations`: 7-field engineering cards, visual workflow strip (`Alert` $\to$ `Insight` $\to$ `Recommendation` $\to$ `Work Order`), and Accept/Reject interactions.
  - `Work Orders`: Industrial dispatch table, priority filtering, and modal creation workflow.
- **Data Provenance System**: Explicit tags across all data points:
  - `OBSERVED`: Measured SCADA sensor readings.
  - `ESTIMATED`: Soft-sensor & thermodynamic inferences.
  - `MODEL PREDICTION`: Coupled digital twin solver outputs.
  - `ACTUAL`: Well test separator & manual gauges.
  - `SYNTHETIC`: Deterministic test scenario dataset (Baghewala Well BW-017, CSS Cycle 4, Day 38).
- **Quality & Polish**: Populated, loading, empty, and error states; responsive desktop/tablet layouts; zero TypeScript compilation errors.

> [!IMPORTANT]
> **Phase 1 Boundary**: Phase 1 is purely a frontend engineering demonstration driven by centralized mock services and a deterministic synthetic dataset. No live backend, database, ML engine, or SCADA ingestion pipeline is active in Phase 1.

---

## 3. Problem Statement

Heavy-oil thermal recovery operations (specifically Cyclic Steam Stimulation coupled with Sucker Rod Pumping) present extreme operational challenges:
1. **Coupled Physics Blindspots**: Steam injection creates complex reservoir heating and thermal falloff. As the near-wellbore reservoir cools, crude viscosity surges exponentially, starving the downhole pump and causing fluid pound, rod compression, and sudden surface production loss.
2. **Siloed Data Systems**: Telemetry is scattered across surface SCADA, downhole memory gauges, well test separators, and maintenance spreadsheets.
3. **Delayed Detection**: Engineers often detect pump starvation days after thermal cooling began, resulting in equipment fatigue, rod wear, and irreversible production deferred.
4. **Lack of Explainability**: Generic machine learning tools generate black-box anomaly alerts without physical grounding, causing alarm fatigue among field engineers.

Well Twin solves this by coupling reservoir thermodynamics, wellbore hydraulics, mechanical lift dynamics, and surface production into a unified, physics-grounded decision support platform.

---

## 4. Target Users

### Primary
- **Petroleum / Production Engineers**: Daily well performance monitoring, thermal response tracking, artificial-lift optimization, and production variance diagnosis.

### Secondary
- **Artificial-Lift Specialists**: SRP dynamometer card interpretation, rod stress analysis, pump fillage tuning, and SPM optimization.
- **Thermal Recovery Specialists**: Steam chamber monitoring, heat dissipation tracking, and CSS cycle transition planning.
- **Field Operators & Maintenance Teams**: Executing work orders, inspecting equipment, acknowledging operational alarms, and verifying surface choke settings.
- **Asset Managers**: Fleet overview, cumulative oil recovery, cumulative steam-oil ratio (CSOR), and field-wide lifting costs.

---

## 5. Product Principles

1. **Engineer First**: Build an industrial workstation, not a consumer vanity dashboard. Prioritize data density, crisp contrast, and precision.
2. **Physical Causality Over Disconnected Data**: Always expose the physical cause-and-effect chain ($\text{Cooling} \to \text{Viscosity} \to \text{Fillage} \to \text{Production Deficit}$).
3. **Explicit Data Provenance**: Every metric must clearly state whether it is `OBSERVED`, `ESTIMATED`, `MODEL PREDICTION`, or `ACTUAL`.
4. **Explainable AI**: AI insights must present observable physical evidence, thermodynamic basis, and projected production impact before recommending actions.
5. **Closed-Loop Actionability**: Insights must flow naturally into Recommendations, which flow directly into Trackable Work Orders.
6. **Trends Over Isolated Points**: Contextualize every current value with historical baselines, normal operating bands, and cycle overlays.
7. **Graceful Degradation**: The workstation must remain 100% useful as a monitoring tool even if ML or AI components are offline.
8. **Direct-to-Database Backend**: Avoid throwaway in-memory backend stages. Build FastAPI directly against Supabase PostgreSQL from Day 1 of backend development.

---

## 6. Core User Journey

```
Select Well (e.g. BW-017)
   ↓
Review Command Overview & Persistent Context Strip
   ↓
Inspect Physical Cause-and-Effect Chain (Cooling → Viscosity → Fillage → Production Deficit)
   ↓
Check Model Agreement (93%) & Localized Drift Banner
   ↓
Deep-Dive into Coupled Digital Twin Subsystems:
   ├── Reservoir: Check steam plume radius (18.4m) & thermal falloff rate
   ├── Wellbore: Inspect viscosity surge (84 cP) & flowing gradient
   ├── SRP / Pump: Diagnose fluid pound on downhole dynamometer card @ 2.80m
   └── Surface: Quantify net oil deficit (-7.0%) on test separator
   ↓
Review AI Diagnostic Insight with Grounded Physical Evidence
   ↓
Evaluate Prescriptive Recommendation (e.g., Reduce SPM from 3.8 to 3.2)
   ↓
Accept Recommendation & Dispatch Closed-Loop Field Work Order
   ↓
Track Work Order Execution & Recalibrate Digital Twin
```

---

## 7. Phase 2 — Backend + Database Strategy

### Architecture & Responsibility Split

In Phase 2, **FastAPI and Supabase PostgreSQL are implemented together**. There is no temporary in-memory backend phase.

```
React Frontend (TanStack Query)
        ↓
FastAPI REST API (/api/v1)
        ↓
Domain Service Layer (Business Logic & Validation)
        ↓
Repository Layer (Data Access & Queries)
        ↓
Supabase PostgreSQL (Persistent Relational Database)
```

#### FastAPI Responsibilities:
- Centralized REST API boundary (`/api/v1`)
- Request validation and serialization using Pydantic v2 schemas
- Domain business logic, threshold evaluation, and state transition validation
- Service orchestration across data models
- Isolation boundary: Frontend NEVER talks directly to Supabase for application business logic
- Gateway for future Phase 3 Analytics/ML and Phase 4 AI modules
- Controlled Demo Mode fallback switch

#### Supabase PostgreSQL Responsibilities:
- Relational data persistence with strict foreign key constraints and ACID guarantees
- Time-series optimized telemetry storage with compound indexing `(well_id, timestamp DESC)`
- Historical logging for CSS cycles, operational events, and dynamometer records
- Persistent state management for alerts, anomalies, recommendations, and work orders
- Foundation for future Phase 5 Row Level Security (RLS) and authentication

### Phase 2 Product Capabilities:
1. **Persistent Wells**: Multi-well database storage with field, reservoir properties, and operating limits.
2. **Persistent Telemetry**: High-frequency sensor history querying with timestamp range filtering and downsampled aggregations.
3. **Persistent Alerts**: Database-backed alert lifecycle (`active` $\to$ `acknowledged` $\to$ `resolved`) with engineer notes and escalation timestamps.
4. **Persistent Anomalies**: Stored anomaly detections linked to telemetry timestamps, severity scores, and affected sensors.
5. **Persistent CSS Cycles**: Complete cycle definitions (Cycle 1 to N), phase transitions (Injection, Soak, Production, Cooling), and cumulative steam/oil totals.
6. **Persistent Equipment**: Asset registry with operational hours, inspection dates, Goodman stress limits, and service histories.
7. **Persistent Recommendations & Work Orders**: Full lifecycle tracking from creation, engineer assignment, priority setting, to field completion.
8. **Persistent Model Outputs**: Stored digital twin states (`model_states`) and predictions (`model_predictions`) enabling real-time predicted-vs-actual calculations.
9. **Controlled Demo Mode**: Seamless fallback capability ensuring the workstation operates during live presentations even if external network access to the database is disrupted.

---

## 8. Later Product Capabilities

### Phase 3 — Analytics + ML
- **Physics-Informed Well Health Score**: Dynamic multi-factor scoring (Reservoir 25%, Wellbore 25%, Artificial Lift 30%, Surface & Flow 20%) calculated on real database readings.
- **Multivariate Anomaly Detection**: Statistical rolling z-score, exponentially weighted moving average (EWMA), and threshold boundary checks.
- **Production Prediction**: Hydrodynamic inflow performance relationship (IPR) and Vogel curve calculations with P10/P50/P90 confidence envelopes.
- **Model Validation & Quantitative Drift**: Real-time cross-model residual computation ($|\text{Predicted} - \text{Actual}|$) and automated drift alerts.

### Phase 4 — AI Intelligence
- **Grounded Engineering Insights**: LLM-powered diagnostic summaries conditioned strictly on structured backend context, telemetry deviations, and physical rules.
- **Evidence Formatting**: Automated extraction of contributing sensor changes with directional indicators ($\uparrow, \downarrow$).
- **Prescriptive Optimization**: Algorithmic generation of actionable interventions (SPM reduction, steam re-injection scheduling) with simulated production deltas.

### Phase 5 — Real Data & Production Hardening
- **SCADA / Historian Ingestion**: Adapters for Modbus, OPC-UA, MQTT, and batch CSV telemetry streams.
- **Authentication & RBAC**: Supabase Auth integration with JWT validation and role-based access control (Engineer, Operator, Admin).
- **Row Level Security (RLS)**: Database-enforced tenant and well access boundaries.
- **Audit Logs & CI/CD**: Comprehensive operational audit trails, automated GitHub Actions pipelines, and multi-environment deployment.

---

## 9. Future Product Scope

- Multi-well fleet dashboard with geographic map and fleet-wide steam allocation optimizer
- Closed-loop automated VFD speed control via SCADA write-back
- Automated dynamometer card classification using 2D convolutional neural networks
- Thermal reservoir 3D voxel heat map integration
- Mobile operator companion app for field work order execution
