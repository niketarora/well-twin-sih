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
