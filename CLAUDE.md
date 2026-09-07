# well-twin-sih — Project Context for Claude Code

## Project

SIH 2026 — Oil India Limited
**Digital Twin for Well-to-Surface Optimization of CSS and SRP Operations for Heavy Oil Wells of Baghewala Field**

## Existing Architecture

- Frontend: React + TypeScript + Vite
- Backend: FastAPI
- ORM: SQLAlchemy
- Local DB: SQLite
- Production DB option: PostgreSQL/Supabase
- Existing backend architecture follows: `API → Service → Repository → Model/Schema → Database`
- Extend the existing `backend/`; never create a second backend.
- The backend currently boots via `Base.metadata.create_all()` (see `app/db/connection.py`).
  Alembic is a listed dependency but has no migrations wired up yet, so `create_all()` only
  creates missing tables — it will not add columns to a table that already exists. New features
  should add new tables rather than modify columns on existing models until Alembic migrations
  are properly introduced.

## Digital Twin Status

The current UI is significantly more complete than the actual engineering engine. Many Digital
Twin, CSS, SRP, prediction and optimization values are currently synthetic/mock/seeded. Do not
present mock values as real model output.

The long-term engineering core should become:
`Telemetry → Twin State → Thermal/Well/SRP Models → Prediction → Simulation → Optimization → Risk/Alert Events`

## Critical Safety Architecture

There are TWO different safety features. Never mix their trigger logic.

### Manual SOS

Human-triggered. A worker may manually report fire/smoke, unusual smell, suspected leak, fluid
leak, medical emergency, equipment hazard, personnel danger, or another observed danger. Manual
SOS must NOT depend on Digital Twin detection, telemetry, ML, or thresholds — a human observation
alone is sufficient.

### Automated Operational Alerts

System-triggered (deferred — not yet implemented). These will eventually originate from the
Digital Twin / telemetry evaluation / anomaly-risk models / predictive-maintenance logic /
configurable engineering rules (temperature, pressure, SRP loading, rod-floating risk, pump
issues, thermal/mechanical anomalies, production anomalies).

Both features share: Incident Management → Notification → SMS/Voice → Acknowledgement →
Escalation → Audit History.

## Notification Architecture

Do not put Twilio calls directly inside Digital Twin models, API controllers, or arbitrary
services. Use a notification/provider abstraction:
`Notification Service → SMS Provider / Voice Provider → Twilio`.
Maintain a mock notification mode for development/testing, and default to it.

## Safety Rules

- Never invent real Baghewala/OIL engineering thresholds.
- Demo thresholds must be clearly configurable/demo-only.
- Never claim prototype alerts are certified safety controls.
- Never automatically contact public emergency services.
- Only configured test contacts may receive prototype SMS/calls.
- Use synthetic/anonymized operational values unless approved real data is provided.

## Security

Never expose or commit `.env`, API keys, Twilio credentials, database passwords, access tokens,
sensitive well information, or real confidential coordinates/data. Only `.env.example`
placeholders belong in Git.

## AI / Gemini

Gemini/LLMs are optional interface/explanation layers. Do NOT make core SOS, alert
classification, acknowledgement, escalation, or Twilio notification logic dependent on an LLM.
Safety workflows must remain deterministic.

## Development Workflow

For significant changes:
1. Inspect the existing implementation.
2. Plan the architecture.
3. Reuse existing patterns.
4. Implement a small phase.
5. Add/update tests.
6. Run tests.
7. Summarize changed files and remaining work.

Do not make large unrelated refactors while implementing a feature. Large features are built in
small, explicitly-approved phases — do not start a phase (including the first one) until the user
explicitly says to begin it.

## Current Development Priority

1. Safety/Incident architecture
2. Manual SOS
3. Mock notifications
4. Acknowledgement/manual escalation
5. Frontend Manual SOS integration
6. Twilio SMS
7. Twilio voice calling
8. Automated alert generation (deferred until Digital Twin/telemetry models are validated)
9. Alert ↔ Incident bridge / de-duplication (after Alembic migrations exist)
10. Actual Digital Twin modelling/simulation
11. AI Copilot/Gemini later
