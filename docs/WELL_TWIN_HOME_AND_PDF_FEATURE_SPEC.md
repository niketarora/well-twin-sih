# Well Twin --- Home Page + Operational Log PDF Implementation Specification

## Purpose

Implement the next frontend features for the Well Twin / Baghewala
Digital Twin application:

1.  Add a new **Home / Field Selection page** before the existing Well
    Overview.
2.  Make the existing **Export Operational Log** button functional so it
    downloads a professional PDF for the currently selected well.

Use the existing project code, existing UI, design assets, mock data,
routes, services, and documentation as the primary reference. Do not
redesign unrelated parts of the application.

------------------------------------------------------------------------

## 1. Target User Flow

``` text
                    WELL TWIN
                       |
                       v
              +-------------------+
              | HOME / FIELD MAP  |
              | Baghewala Field   |
              |                   |
              | Interactive Map   |
              |   BW-01           |
              |   BW-02           |
              |   BW-17           |
              |   BW-23           |
              |   ...             |
              |                   |
              | Select a Well      |
              +---------+---------+
                        |
                   Select BW-17
                        |
                        v
              +-------------------+
              |   WELL OVERVIEW   |
              |   BW-17           |
              |   Health           |
              |   Production       |
              |   Temperature      |
              |   SRP / CSS        |
              +---------+----------+
                        |
                        v
              Export Operational Log
                        |
                        v
                 Professional PDF
```

The Home page becomes the application entry point. The existing Overview
remains the well-specific operational workspace.

------------------------------------------------------------------------

# 2. Home / Field Selection Page

## 2.1 Purpose

The Home page should let an engineer:

-   Understand Baghewala field status at a glance.
-   See wells geographically.
-   Understand well status.
-   Search and filter wells.
-   Select a well.
-   Open that well's Overview.

It should feel like an engineering field-operations interface, not a
generic marketing landing page.

## 2.2 Header

Display:

**BAGHEWALA FIELD**

Context:

**Rajasthan · Heavy Oil · CSS + SRP**

Show a compact field summary containing values available in the current
data model, such as:

-   Total wells
-   Producing wells
-   Attention wells
-   Shut-in / non-producing wells
-   CSS-active wells

Do not scatter hardcoded values through JSX. Use the existing
data/service architecture.

If values are synthetic/demo values, keep the application's existing
demo-data classification.

------------------------------------------------------------------------

# 3. Interactive Field Map

The map is the primary navigation element.

It should display wells such as:

``` text
              BAGHEWALA FIELD

        ● BW-01

                   ● BW-02


                             ● BW-17


              ● BW-23
```

Do not present invented coordinates as real field coordinates.

## Map technology

Use **Mapbox GL JS** if compatible with the current project.

Required:

-   Pan
-   Zoom
-   Custom well markers
-   Marker click/hover
-   Popup/card
-   Light map style
-   Dark map style
-   Optional field boundary if reliable GeoJSON is available
-   Well selection

Do not add driving directions, navigation, traffic, or other
consumer-map functionality.

## Well coordinates

The data model should own coordinates:

``` text
well_id
well_name
field_id
latitude
longitude
status
health_status
production_status
```

If exact real coordinates are not available, use clearly identified
synthetic/demo coordinates. Never imply synthetic coordinates are actual
OIL coordinates.

Structure the code so real coordinates can be inserted later without
changing the map component.

------------------------------------------------------------------------

# 4. Well Markers

Use compact circular engineering markers rather than generic map pins.

Suggested semantic states:

``` text
Green       Producing / Healthy
Yellow      Attention
Red         Critical
Gray/White  Shut-in / Non-producing
Blue        CSS / Injection related
```

Do not rely on color alone. Always expose the well ID/status through
text or a popup.

Example:

``` text
● BW-17
  PRODUCING
```

------------------------------------------------------------------------

# 5. Well Popup / Hover Card

When a marker is selected, show a compact card.

Example:

``` text
BW-17
----------------
● PRODUCING

Oil Rate       184 BOPD
Temperature    214.8 °C
SRP Fillage    84.6%
CSS Cycle      #4

[ Open Well ]
```

Use actual values from the current data model.

The popup must contain an obvious **Open Well** action.

Clicking it navigates to the existing well Overview route.

------------------------------------------------------------------------

# 6. Map Legend and Filters

Add a compact legend:

``` text
● Producing
● Attention
● Critical
● Shut-in
● CSS Active
```

Add well filtering:

``` text
Search well...
```

Search by:

-   Well ID
-   Well name

Add status filters:

-   Producing
-   Attention
-   Critical
-   Shut-in
-   Non-producing
-   CSS Active

The map and list must remain synchronized.

Optional clean map view selector:

``` text
VIEW

● Well Health
○ Production
○ Temperature
○ SRP Health
○ CSS Cycle
```

If implemented, change marker visualization based on the selected view.
Keep clarity more important than visual effects.

------------------------------------------------------------------------

# 7. Well List

Add a well-selection list below or beside the map.

Example:

``` text
SELECT WELL

Search: [ BW-17____________ ]    Status v

BW-17
● Producing
184 BOPD
[ OPEN → ]

BW-23
● Producing
171 BOPD
[ OPEN → ]

BW-02
● Attention
126 BOPD
[ OPEN → ]
```

The map and list must use the same well data source.

Clicking a row opens the corresponding Overview.

------------------------------------------------------------------------

# 8. Home Page Routing

Recommended structure:

``` text
/
    -> Home / Field Selection

/well/:wellId/overview
    -> Existing Overview

/well/:wellId/reservoir
    -> Reservoir / Thermal

/well/:wellId/wellbore
    -> Wellbore

/well/:wellId/srp
    -> SRP

/well/:wellId/production
    -> Surface Production
```

Preserve existing equivalent routes if the project already uses another
naming convention.

Home must not duplicate the Overview.

------------------------------------------------------------------------

# 9. Home Page Data Architecture

Do not hardcode well objects in JSX.

Use the existing service/query pattern.

Conceptually:

``` text
Home
 |
 +--> useField()
 |
 +--> useFieldWells()
 |
 +--> useWellSummary()
 |
 v
UI
```

Current demo:

``` text
Mock Service
    |
    v
Synthetic Field Data
```

Future FastAPI + Supabase:

``` text
FastAPI
    |
    v
Supabase PostgreSQL
    |
    v
Field / Well APIs
    |
    v
React
```

The Home page must not require a rewrite when the backend is connected.

------------------------------------------------------------------------

# 10. Future API Contract

Design service abstractions around:

``` http
GET /api/v1/fields
GET /api/v1/fields/{field_id}
GET /api/v1/fields/{field_id}/summary
GET /api/v1/fields/{field_id}/map

GET /api/v1/wells
GET /api/v1/wells/{well_id}
GET /api/v1/wells/{well_id}/overview
GET /api/v1/wells/{well_id}/state
```

These may remain mock-backed for the current frontend implementation.

------------------------------------------------------------------------

# 11. Existing Overview

Do not redesign unrelated Overview functionality.

The existing Overview remains the well-specific operational workspace:

``` text
Home
  |
  +--> BW-17
          |
          v
       Overview
          |
          +--> Reservoir
          +--> Wellbore
          +--> SRP
          +--> Production
          +--> CSS
          +--> Alerts
          +--> Insights
          +--> Recommendations
```

------------------------------------------------------------------------

# 12. Export Operational Log --- Make It Functional

The existing Overview contains an **Export Operational Log** button
which currently does not work.

Implement it completely.

When clicked, it must generate and automatically download a professional
PDF report for the **currently selected well**.

Example:

``` text
BW-17 -> Overview -> Export Operational Log
```

downloads:

``` text
WellTwin_BW-17_Operational_Log_2026-09-07.pdf
```

If the selected well changes to BW-23, the PDF must contain BW-23 data.

Never generate a generic/static report.

------------------------------------------------------------------------

# 13. PDF Generation Architecture

For the initial frontend implementation, generate the PDF client-side.

Preferred:

-   jsPDF
-   html2canvas where needed for charts
-   or another reliable browser-compatible PDF solution

Do not add backend PDF generation unless technically necessary.

Keep PDF generation isolated from the Overview component.

Recommended:

``` text
src/
└── services/
    └── export/
        └── operationalLogPdf.ts
```

Conceptual flow:

``` text
Overview
   |
   v
useWellOverview()
   |
   v
Structured Well Overview Data
   |
   v
generateOperationalLogPdf(data)
   |
   v
Browser Download
```

The PDF generator must receive structured data, not rely on hundreds of
DOM selectors.

------------------------------------------------------------------------

# 14. PDF Design

The PDF should be a professional petroleum-engineering operational
report.

Do NOT:

-   Export raw JSON.
-   Simply screenshot the browser.
-   Include interactive controls.
-   Make it dependent on the current dark/light UI theme.

Use:

-   A4 paper
-   Print-friendly light design
-   Professional typography
-   Clear sections
-   Tables where useful
-   Static charts
-   Page numbers
-   Footer
-   Well and field identification

Even if the application is in Dark Mode, the PDF should use the
print-friendly light report design.

------------------------------------------------------------------------

# 15. PDF Content

Include information available on the current Overview.

## Section 1 --- Well Identification

Include:

-   Field
-   Well ID
-   Well name
-   Well status
-   Production status
-   CSS cycle
-   CSS phase
-   Report generation date/time

## Section 2 --- Well Health

Include:

-   Overall health score
-   Health status
-   Digital Twin status

## Section 3 --- Key Operational Parameters

Include values that actually exist in the application, such as:

-   Oil production
-   Water production
-   Reservoir temperature
-   Reservoir pressure
-   Oil viscosity
-   Pump fillage
-   Pump efficiency
-   Rod load
-   Energy consumption
-   Other major Overview KPIs

Do not invent metrics or values.

## Section 4 --- Four Digital Twin Domains

Include:

``` text
Reservoir / Thermal
Wellbore
SRP / Artificial Lift
Surface Production
```

For each, show available:

-   Status
-   Important metric
-   Deviation where available

## Section 5 --- Production Comparison

If present on Overview, include a static version of:

**Predicted vs Actual Production**

If chart capture is unreliable, recreate a static chart from the
underlying data.

## Section 6 --- Trends

Prioritize:

1.  Predicted vs Actual Production
2.  Production trend
3.  Temperature trend
4.  Other major engineering trend

Do not export every chart if that makes the report unreadable.

## Section 7 --- Model Health

If available, include:

-   Model health score
-   Model confidence
-   Model deviation
-   Model drift status
-   Model version

Clearly distinguish observed values from model-derived values.

## Section 8 --- Alerts

Include relevant alerts with available:

-   Severity
-   Subsystem
-   Timestamp
-   Metric
-   Current value
-   Description
-   Status

Use a compact table where appropriate.

## Section 9 --- Engineering Insights

Export the structured insights currently shown on the Overview.

Do not generate new AI content during export.

## Section 10 --- Engineering Cause Chain

If shown on Overview, include it.

Example:

``` text
Reservoir cooling
      ↓
Temperature decrease
      ↓
Viscosity increase
      ↓
Mobility decrease
      ↓
Pump loading increase
      ↓
Pump fillage decrease
      ↓
Production decline
```

## Section 11 --- Data Classification

If using synthetic/demo data, include:

``` text
DATA CLASSIFICATION
DEMO / SYNTHETIC DATA
```

Do not present synthetic values as actual field measurements.

------------------------------------------------------------------------

# 16. PDF Header and Footer

Header:

``` text
WELL TWIN
OPERATIONAL LOG REPORT

Baghewala Field
BW-17

Generated: DD MMM YYYY HH:MM
```

Footer:

``` text
Well Twin · Baghewala Field
Operational Log
Page X of Y
```

Use page numbering.

------------------------------------------------------------------------

# 17. PDF Filename

Use:

``` text
WellTwin_{WELL_ID}_Operational_Log_{DATE}.pdf
```

Example:

``` text
WellTwin_BW-17_Operational_Log_2026-09-07.pdf
```

------------------------------------------------------------------------

# 18. Export Button UX

When clicked:

1.  Show: `Generating Operational Log...`
2.  Disable the button during generation.
3.  Generate the PDF.
4.  Automatically download it.
5.  Restore the button.

If generation fails, show:

``` text
Unable to generate operational log.
Please try again.
```

Use the existing toast/notification system if available.

Never silently fail.

------------------------------------------------------------------------

# 19. Dark Theme Compatibility

The Home page must support both Light and Dark Mode.

The map should have appropriate light/dark styling.

PDF behavior:

``` text
Application Dark Mode -> Light PDF
Application Light Mode -> Light PDF
```

The current UI theme must not make the exported report unreadable.

------------------------------------------------------------------------

# 20. Suggested Frontend Structure

Adapt to the existing project architecture; do not blindly replace it.

``` text
src/
├── components/
│   ├── home/
│   │   ├── FieldHeader.tsx
│   │   ├── FieldMap.tsx
│   │   ├── FieldMapLegend.tsx
│   │   ├── WellPopup.tsx
│   │   ├── WellFilters.tsx
│   │   └── WellList.tsx
│   │
│   └── overview/
│       └── existing components...
│
├── pages/
│   ├── Home.tsx
│   └── existing pages...
│
├── services/
│   ├── fieldService.ts
│   ├── wellService.ts
│   └── export/
│       └── operationalLogPdf.ts
│
├── hooks/
│   ├── useField.ts
│   ├── useFieldWells.ts
│   ├── useWellOverview.ts
│   └── existing hooks...
│
├── types/
│   ├── field.ts
│   ├── well.ts
│   └── existing types...
│
└── data/
    └── existing demo data...
```

Follow existing conventions where they differ.

------------------------------------------------------------------------

# 21. Well Data Model

Conceptually support:

``` ts
type WellSummary = {
  id: string;
  name: string;
  fieldId: string;
  latitude: number;
  longitude: number;
  status: WellStatus;
  healthStatus: HealthStatus;
  productionStatus: string;
  oilRate?: number;
  temperature?: number;
  srpFillage?: number;
  cssCycle?: number;
};
```

Use the project's existing types if equivalent types already exist.

Do not duplicate the same well data in multiple places.

------------------------------------------------------------------------

# 22. PDF Data Model

Prefer structured data:

``` ts
generateOperationalLogPdf({
  well,
  health,
  reservoir,
  wellbore,
  srp,
  production,
  css,
  alerts,
  insights,
  recommendations,
  modelHealth,
  trends,
  causeChain
});
```

Use existing project types.

The PDF utility should remain reusable after backend integration.

------------------------------------------------------------------------

# 23. FastAPI + Supabase Compatibility

The next backend phase will use:

``` text
React
  ↓
FastAPI
  ↓
Service Layer
  ↓
Supabase PostgreSQL
```

The Home page should eventually consume field/well data from FastAPI.

The Overview should eventually consume structured well data from
FastAPI.

The PDF should consume the same structured Overview data already
available to React.

No PDF-specific rewrite should be required when mock services are
replaced with FastAPI.

------------------------------------------------------------------------

# 24. Do Not Implement These Features

Do not implement as part of this task:

-   Reservoir physics
-   Thermal simulation
-   Wellbore simulation
-   SRP physics
-   Production ML
-   Anomaly ML
-   AI reasoning
-   SCADA ingestion
-   Authentication
-   Unrelated redesigns

Use the current demo/model data.

The goal is:

**Field-level navigation + well selection + functional operational PDF
export.**

------------------------------------------------------------------------

# 25. Implementation Order

## Step 1 --- Inspect

Before editing, inspect:

-   Existing project structure
-   Existing routes
-   Existing Overview
-   Existing services
-   Existing mock data
-   Existing theme system
-   Existing reusable UI components
-   Existing charts
-   Existing Export Operational Log button

## Step 2 --- Data Model

Add/reuse:

-   Field
-   Well summary
-   Well location
-   Well status

## Step 3 --- Home Page

Implement:

-   Header
-   Field summary
-   Map
-   Markers
-   Legend
-   Popup
-   Search
-   Filters
-   Well list

## Step 4 --- Routing

Make:

``` text
/
```

open Home.

Make well selection navigate to:

``` text
/well/:wellId/overview
```

## Step 5 --- PDF Export

Implement the dedicated PDF utility and connect it to the existing
Overview button.

## Step 6 --- Test

At minimum test:

-   BW-17
-   BW-23
-   BW-02
-   BW-01

## Step 7 --- Build Verification

Run the project's existing build, lint, and test commands.

Fix all TypeScript/build errors and console errors.

------------------------------------------------------------------------

# 26. Acceptance Checklist

## Home

-   [ ] Home route exists.
-   [ ] Home opens by default.
-   [ ] Baghewala Field header is visible.
-   [ ] Field summary is visible.
-   [ ] Interactive map renders.
-   [ ] Light map works.
-   [ ] Dark map works.
-   [ ] Well markers render.
-   [ ] Statuses are distinguishable.
-   [ ] Legend is visible.
-   [ ] Popup/card works.
-   [ ] Open Well works.
-   [ ] Search works.
-   [ ] Filters work.
-   [ ] Well list works.
-   [ ] Map and list use the same data.
-   [ ] Selecting a well opens its Overview.
-   [ ] No invented real-world coordinates are presented as factual.
-   [ ] Demo/synthetic data is classified appropriately.

## Navigation

-   [ ] Home -\> BW-17 -\> Overview works.
-   [ ] Home -\> BW-23 -\> Overview works.
-   [ ] Existing Overview navigation remains functional.
-   [ ] Existing Digital Twin pages remain functional.
-   [ ] Browser back/forward works.
-   [ ] Refreshing a well route works.

## PDF

-   [ ] Export Operational Log works.
-   [ ] Correct selected well is exported.
-   [ ] Loading state works.
-   [ ] Button disables during generation.
-   [ ] PDF downloads automatically.
-   [ ] Filename is correct.
-   [ ] PDF is A4.
-   [ ] Well information is correct.
-   [ ] Health information is included.
-   [ ] Key KPIs are included.
-   [ ] Four Digital Twin statuses are included.
-   [ ] Important charts are included where available.
-   [ ] Predicted vs Actual is included where available.
-   [ ] Model Health is included where available.
-   [ ] Alerts are included.
-   [ ] Engineering Insights are included.
-   [ ] Cause Chain is included where available.
-   [ ] Demo-data classification is included when applicable.
-   [ ] Page numbers work.
-   [ ] No clipping.
-   [ ] No overlapping content.
-   [ ] No unexpected blank pages.
-   [ ] Charts are readable.
-   [ ] PDF is light/print-friendly.
-   [ ] PDF works while application is in Dark Mode.
-   [ ] Error state works.

## Code Quality

-   [ ] Existing functionality is preserved.
-   [ ] Existing reusable components are reused.
-   [ ] PDF logic is isolated.
-   [ ] No hardcoded well data inside JSX.
-   [ ] TypeScript passes.
-   [ ] Lint passes if configured.
-   [ ] Production build passes.
-   [ ] No console errors.
-   [ ] No secrets committed.
-   [ ] Map token is environment-configured.
-   [ ] No unnecessary external APIs are added.

------------------------------------------------------------------------

# 27. Environment Variables

If Mapbox is used:

``` text
VITE_MAPBOX_TOKEN=
```

Add it to `.env.example`.

Never hardcode the token.

Never commit real secrets.

------------------------------------------------------------------------

# 28. Final UX Principle

The Home page should answer:

> "What is happening across the Baghewala field, and which well should I
> investigate?"

The Overview should answer:

> "What is happening inside this specific well?"

The PDF should answer:

> "What was the operational state of this well at the time of export?"

Therefore:

``` text
HOME
Field-level awareness
        ↓
WELL SELECTION
        ↓
OVERVIEW
Well-level investigation
        ↓
OPERATIONAL LOG
Portable engineering report
```

------------------------------------------------------------------------

# 29. Final Instruction to Antigravity

Implement only the features described in this document.

Before coding, inspect the existing project and reuse its current
architecture and components.

Do not replace the existing UI unnecessarily.

Do not break the current Light/Dark theme.

Do not remove existing Overview functionality.

Do not use fake coordinates as real-world facts.

Do not leave Export Operational Log as a placeholder.

After implementation, verify the complete workflow:

``` text
Open application
    ↓
Home page
    ↓
Baghewala field map
    ↓
Select BW-17
    ↓
BW-17 Overview
    ↓
Export Operational Log
    ↓
Professional PDF downloads
```

The implementation must remain compatible with the planned FastAPI +
Supabase backend architecture.
