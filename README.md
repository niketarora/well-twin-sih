# Well Twin — Industrial Digital Twin & Decision Support Platform

An advanced industrial digital twin workstation engineered for petroleum and production engineers overseeing heavy-oil Cyclic Steam Stimulation (CSS) and Sucker Rod Pump (SRP) operations.

Developed for Smart India Hackathon (SIH) / Industrial Oil & Gas applications, focusing on Baghewala Heavy Oil Well **BW-017** operations.

---

## Repository Structure

```
well-twin-sih/
├── docs/                     # PRD, TRD, Master Spec & Design references
│   ├── UI designs/
│   ├── IMPLEMENTATION_PLAN.md
│   ├── PRD.md
│   ├── TRD.md
│   └── WELL_TWIN_MASTER_SPEC.md
├── frontend/                 # Complete React + Vite + TypeScript Workstation
│   ├── public/               # Static assets & favicon
│   ├── src/
│   │   ├── app/              # Router & providers
│   │   ├── components/       # UI library & interactive visualizers
│   │   ├── mock/             # Deterministic physical mock datasets for 4 twins
│   │   ├── pages/            # 17 operational workstation pages
│   │   ├── services/         # Typed domain service layer
│   │   ├── stores/           # Zustand reactive stores
│   │   └── types/            # Domain TypeScript interfaces
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

---

## Key Features

- **4-Tier Coupled Digital Twin Models**:
  - **Twin 1: Reservoir & Thermal Model**: Radial steam chamber isotherms ($R = 18.4\text{ m}$), reservoir cooling rates ($-0.04^\circ\text{C/h}$), and thermal falloff.
  - **Twin 2: Wellbore Hydrodynamics**: Multiphase pressure drop, downhole viscosity shifts ($84.0\text{ cP}$), and flow regimes.
  - **Twin 3: Sucker Rod Pump (SRP) Dynamics**: Interactive surface and downhole dynamometer cards, pump fillage calculation ($84.6\%$), and fluid pound detection ($2.80\text{ m}$).
  - **Twin 4: Surface Production**: Predicted vs. actual production tracking ($184.2\text{ BOPD}$ vs $198.0\text{ BOPD}$ predicted), water cut ($74.2\%$), and backpressure monitoring.
  - **Cross-Model Validation**: Live parameter bridges, MAPE accuracy gauges ($95.8\%$), and cross-twin residual analysis.

- **17 Industrial Workstation Pages**:
  1. Executive Overview (`/`)
  2. Coupled Twin Cascade (`/digital-twin`)
  3. Well State & Telemetry (`/well-state`)
  4. Reservoir Deep Dive (`/twin/reservoir`)
  5. Wellbore Hydrodynamics (`/twin/wellbore`)
  6. SRP Lift Dynamics (`/twin/srp`)
  7. Surface Production (`/twin/surface`)
  8. Historical Multi-Metric Trends (`/trends`)
  9. Cyclic Steam Stimulation Lifecycle (`/css-cycle`)
  10. Operational Alerts (`/alerts`)
  11. Anomaly Detection & Attribution (`/anomalies`)
  12. AI Physics-Informed Insights (`/ai-insights`)
  13. Equipment & Asset Lifecycle (`/equipment`)
  14. Subsurface Well Schematic (`/well-diagram`)
  15. Model vs. SCADA Comparison (`/model-comparison`)
  16. Prescriptive Recommendations (`/recommendations`)
  17. Work Order Management (`/work-orders`)

- **Interactive Engineering Visualizers**:
  - Interactive SVG Dynamometer card with surface vs. downhole card toggle and historical cycle overlays.
  - Radial steam plume isotherm visualizer with dynamic temperature profile calculations.
  - 4-Twin Cascade Coupling Diagram with live data bridge indicators.
  - Subsurface completion schematic with pressure and temperature depth gradient plots.

- **Technical Minimalism Design System**:
  - Industrial color palette (`#F4F6F8` technical ground, `#FFFFFF` surfaces, `#C69A45`/`#8A6A22` amber brand accents).
  - High-density telemetry displays with JetBrains Mono monospace font.
  - Crisp 8–12px card corners with status-accented 2px borders.

---

## Tech Stack

- **Framework**: React 18, TypeScript
- **Bundler / Dev Server**: Vite
- **Styling**: Tailwind CSS, Vanilla CSS variables
- **Icons**: Lucide React
- **State Management**: Zustand
- **Routing**: React Router v6

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm / pnpm / yarn

### Installation & Running Locally

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The application will be available at `http://localhost:3000/` (or the port specified in terminal output).

### Production Build

```bash
cd frontend

# Type check and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## License

Internal / Smart India Hackathon Project.
