# WELL TWIN — AI ENGINEERING COPILOT
## Gemini + Dual Data Source Implementation Specification

## 1. Objective

Implement an AI Engineering Copilot inside the existing Well Twin website.

The Copilot must:
- Accept natural-language questions from engineers.
- Answer questions in text.
- Understand the current selected well and current page.
- Navigate the engineer to the exact relevant page.
- Work NOW with frontend-only demo data.
- Work LATER with Supabase-backed data through FastAPI.
- Use Gemini as the AI provider.
- Never expose Gemini or Supabase secrets in the frontend.
- Never invent telemetry, wells, alerts, KPIs, routes, or model results.
- Return structured actions instead of arbitrary URLs.
- Support future cross-twin engineering reasoning.

The key requirement is **one AI feature with two interchangeable data modes**, not two separate implementations.

---

## 2. Existing Project Context

The existing Well Twin application already contains the field/well experience, BW-17 views, Overview, Reservoir/Thermal, Wellbore, SRP, Surface Production, CSS-related information, alerts/anomalies/insights where implemented, operational-log PDF export, light/dark themes, and frontend demo data.

Current stack:
- React
- TypeScript
- Vite
- Existing router
- Existing UI/component system
- Frontend demo data

Planned production stack:
- React + TypeScript + Vite
- FastAPI
- Supabase
- Gemini

Before modifying code:
1. Read all existing `.md` specifications.
2. Inspect the current frontend and routes.
3. Inspect existing demo-data files/services.
4. Inspect existing TypeScript domain types.
5. Inspect design/reference assets.
6. Reuse existing architecture rather than creating a parallel application.

---

## 3. Critical Architecture Principle

The AI must be independent of the data source.

### Current demo mode

```text
React
  ↓
AI Copilot
  ↓
DemoAiDataProvider
  ↓
Existing Frontend Demo Data
  ↓
Gemini
```

### Future production mode

```text
React
  ↓
AI Copilot
  ↓
FastAPI
  ↓
Supabase / Twin / ML Services
  ↓
Gemini
```

The Copilot UI, navigation system, domain types, response schema, and user experience should remain the same.

Only the data/transport provider changes.

---

## 4. Dual Data Mode

Create an abstraction:

```text
src/features/ai/data/
├── AiDataProvider.ts
├── DemoAiDataProvider.ts
├── ApiAiDataProvider.ts
└── createAiDataProvider.ts
```

Use a mode such as:

```text
AI_DATA_MODE=demo
```

Later:

```text
AI_DATA_MODE=api
```

Do NOT scatter `if demo` / `if production` checks throughout UI components.

Use one provider interface.

Example:

```ts
interface AiDataProvider {
  getWell(wellId: string): Promise<WellContext | null>;
  getWellSummary(wellId: string): Promise<WellSummary | null>;
  getCurrentTwinState(wellId: string): Promise<TwinState>;
  getProductionData(wellId: string, range?: TimeRange): Promise<ProductionData>;
  getReservoirData(wellId: string, range?: TimeRange): Promise<ReservoirData>;
  getWellboreData(wellId: string, range?: TimeRange): Promise<WellboreData>;
  getSrpData(wellId: string, range?: TimeRange): Promise<SrpData>;
  getAlerts(wellId?: string): Promise<Alert[]>;
  getAnomalies(wellId?: string): Promise<Anomaly[]>;
  getAvailableWells(): Promise<WellSummary[]>;
}
```

Reuse existing project types wherever possible.

---

## 5. DemoAiDataProvider

The demo provider MUST use the actual data already used by the frontend.

Do not create a second AI-specific dataset.

For example, if the Overview displays:

```text
Oil Rate = 184 BOPD
```

the AI must retrieve that same value through the provider.

Never create:

```text
AI oil rate = 190 BOPD
```

as a separate hardcoded value.

The purpose of DemoAiDataProvider is to make the AI work with the current website immediately.

---

## 6. ApiAiDataProvider

Later implement:

```text
ApiAiDataProvider
  ↓
FastAPI
  ↓
Supabase
```

Possible endpoints:

```http
GET /api/v1/wells
GET /api/v1/wells/{well_id}
GET /api/v1/wells/{well_id}/summary
GET /api/v1/wells/{well_id}/reservoir
GET /api/v1/wells/{well_id}/wellbore
GET /api/v1/wells/{well_id}/srp
GET /api/v1/wells/{well_id}/production
GET /api/v1/wells/{well_id}/alerts
GET /api/v1/wells/{well_id}/anomalies
```

Adapt these to the actual backend design later.

The frontend AI must depend only on `AiDataProvider`, not directly on Supabase.

---

## 7. Gemini Provider

Use Gemini as the AI provider.

Create a provider interface:

```ts
interface AiProvider {
  generateResponse(
    request: AiRequest,
    context: AiContext
  ): Promise<AiResponse>;
}
```

Implement:

```text
GeminiProvider
MockAiProvider
```

The provider must be replaceable without changing the Copilot UI.

### Security

Do NOT expose the Gemini API key in production React/Vite code.

Preferred production flow:

```text
React
  ↓
FastAPI
  ↓
Gemini
```

If a temporary client-side prototype is unavoidable, isolate it clearly as development-only and do not treat it as production architecture.

---

## 8. MockAiProvider

Build a mock provider so the UI and navigation can be developed/tested without Gemini.

Example:

```text
User:
"Open SRP"

Mock response:
intent = OPEN_SRP
action = OPEN_PAGE
wellId = currentWell
```

This allows the Copilot to be developed even when the Gemini service is unavailable.

---

## 9. AI Copilot UI

Add a persistent AI entry point using the existing Well Twin visual language.

Recommended:
- Floating AI button or header button
- Right-side drawer/panel
- Desktop-first
- Responsive
- Light theme
- Dark theme
- Existing typography
- Existing spacing and components
- Engineering/professional appearance

Do not make it look like a generic consumer chatbot.

Recommended structure:

```text
┌────────────────────────────────────┐
│ WELL TWIN AI                  X    │
│ Engineering Copilot               │
├────────────────────────────────────┤
│ Context                            │
│ BW-17 · Overview                   │
│                                    │
│ Ask about this well...             │
│                                    │
│ Suggested                          │
│ [Why is production declining?]     │
│ [Show SRP health]                  │
│ [Explain current alert]            │
│ [Show reservoir temperature]       │
│                                    │
├────────────────────────────────────┤
│ AI RESPONSE                        │
│                                    │
│ Answer...                          │
│                                    │
│ Evidence                           │
│ • ...                              │
│                                    │
│ Confidence: ...                    │
│                                    │
│ [Open Reservoir] [Open SRP]        │
└────────────────────────────────────┘
```

---

## 10. Current UI Context

The AI must know:

```ts
interface AiUiContext {
  fieldId: string;
  fieldName: string;
  currentWellId?: string;
  currentPage: string;
  currentSection?: string;
}
```

If the engineer is currently on:

```text
BW-17 → Reservoir
```

and asks:

> What about the pump?

interpret it as:

```text
BW-17 → SRP
```

Do not ask for information already available in UI context.

---

## 11. Navigation Registry

Create a central navigation registry based on the ACTUAL routes in the project.

Conceptually:

```ts
const navigationRegistry = {
  home: "/",
  wellOverview: "/well/:wellId/overview",
  reservoir: "/well/:wellId/reservoir",
  wellbore: "/well/:wellId/wellbore",
  srp: "/well/:wellId/srp",
  production: "/well/:wellId/production",
  css: "/well/:wellId/css",
  alerts: "/well/:wellId/alerts",
  anomalies: "/well/:wellId/anomalies"
};
```

Do not assume these exact routes if the existing project uses different paths.

The AI must never invent arbitrary URLs.

---

## 12. Semantic Navigation Actions

Use semantic actions:

```text
OPEN_HOME
OPEN_WELL
OPEN_OVERVIEW
OPEN_RESERVOIR
OPEN_WELLBORE
OPEN_SRP
OPEN_PRODUCTION
OPEN_CSS
OPEN_ALERTS
OPEN_ANOMALIES
```

Example:

```json
{
  "type": "OPEN_PAGE",
  "page": "srp",
  "wellId": "BW-17",
  "label": "Open SRP"
}
```

The frontend resolves this using the navigation registry.

---

## 13. Action Validation

Never execute arbitrary URLs returned by Gemini.

Flow:

```text
Gemini
  ↓
Structured response
  ↓
Schema validation
  ↓
Action validation
  ↓
Navigation registry
  ↓
React Router
```

Reject:
- Unknown actions
- Unknown pages
- Unknown wells
- Malformed IDs
- Arbitrary external URLs
- Arbitrary JavaScript/browser actions

The LLM must not be able to execute arbitrary application commands.

---

## 14. Intent Classification

Initial intents:

```text
NAVIGATION
DATA_LOOKUP
EXPLANATION
COMPARISON
INVESTIGATION
RECOMMENDATION
GENERAL_ENGINEERING
UNKNOWN
```

Examples:

```text
"Open BW-17"
→ NAVIGATION

"What is BW-17 production?"
→ DATA_LOOKUP

"What does pump fillage mean?"
→ EXPLANATION

"Which well has the lowest production?"
→ COMPARISON

"Why is BW-17 production declining?"
→ INVESTIGATION
```

---

## 15. Hybrid Routing

Do not call Gemini for every simple request.

Use:

```text
User Query
    ↓
Local Intent Router
    ├── Simple navigation → Navigation Registry
    ├── Simple data lookup → Data Provider
    └── Complex engineering question → Gemini
```

This reduces latency and unnecessary model calls.

---

## 16. AI Context Builder

Create a normalized context object.

```ts
interface AiContext {
  ui: AiUiContext;

  well?: {
    id: string;
    name: string;
    status?: string;
    health?: string;
  };

  reservoir?: {
    temperature?: number;
    pressure?: number;
    viscosity?: number;
    mobility?: number;
    heatingExtent?: number;
    coolingBehaviour?: unknown;
  };

  wellbore?: {
    pumpIntakePressure?: number;
    pumpIntakeTemperature?: number;
    fluidProperties?: unknown;
  };

  srp?: {
    spm?: number;
    stroke?: number;
    pumpEfficiency?: number;
    pumpFillage?: number;
    rodLoad?: number;
    floatingRisk?: unknown;
    energyConsumption?: number;
  };

  production?: {
    oilRate?: number;
    waterRate?: number;
    sor?: number;
    decline?: number;
    predictedRate?: number;
    actualRate?: number;
  };

  alerts?: Alert[];
  anomalies?: Anomaly[];
}
```

Reuse existing domain models.

---

## 17. Context Selection

Do not send all application data to Gemini.

Question:

> "What is pump fillage?"

Retrieve only:

```text
current well
SRP state
pump fillage
```

Question:

> "Why is production declining?"

Retrieve relevant:

```text
production trend
reservoir temperature
pressure
viscosity
mobility
wellbore conditions
SRP state
alerts
anomalies
```

The context builder should determine the minimum useful data for each intent.

---

## 18. Four-Twin Reasoning

The AI should understand the relationship:

```text
Reservoir / Thermal
        ↓
Temperature
        ↓
Viscosity
        ↓
Mobility
        ↓
Wellbore
        ↓
Pump-intake conditions
        ↓
SRP
        ↓
Pump performance
        ↓
Surface Production
```

This enables explanations such as:

```text
Reservoir cooling
      ↓
Viscosity increases
      ↓
Mobility decreases
      ↓
Lifting becomes harder
      ↓
SRP loading changes
      ↓
Pump performance changes
      ↓
Production response changes
```

Only state a causal relationship as a conclusion when the supplied data supports it. Otherwise label it as a possible interpretation.

---

## 19. Gemini System Instructions

Create a modular Gemini system prompt.

Core rules:

```text
You are the Well Twin AI Engineering Copilot.

You assist engineers using the Well Twin application.

Use supplied application context for application-specific facts.

Never:
- invent telemetry
- invent wells
- invent alerts
- invent model outputs
- invent routes
- present an inference as measured data

Always:
- distinguish observed data from model-derived values
- clearly label AI interpretation
- state when data is insufficient
- use only allowed navigation actions
- provide evidence when available
- avoid unsupported certainty
```

Build prompts from:

```text
Base instructions
+ Current UI context
+ Relevant well data
+ Relevant twin data
+ User request
+ Output schema
```

---

## 20. Structured Gemini Response

Require structured output.

Example:

```json
{
  "answer": "BW-17 currently has an SRP health status of Attention.",
  "intent": "DATA_LOOKUP",
  "confidence": 0.91,
  "evidence": [
    {
      "label": "Pump Fillage",
      "value": 84.6,
      "unit": "%"
    }
  ],
  "actions": [
    {
      "type": "OPEN_PAGE",
      "page": "srp",
      "wellId": "BW-17",
      "label": "Open SRP"
    }
  ]
}
```

Validate every model response before rendering it.

---

## 21. Response Types

Recommended:

```ts
type AiResponse = {
  answer: string;
  intent: AiIntent;
  confidence?: number;
  evidence?: AiEvidence[];
  actions?: AiAction[];
  warnings?: string[];
};
```

Use schema validation, preferably Zod if compatible with the project.

---

## 22. Evidence

Engineering answers should show evidence when available.

Example:

```text
Likely cause:
Reservoir cooling may be increasing viscosity and reducing mobility.

Evidence:
• Reservoir temperature ↓
• Viscosity ↑
• Pump fillage ↓
• Production ↓

Confidence:
82%

[View Reservoir]
[View SRP]
[View Production]
```

Do not fabricate evidence or percentages.

---

## 23. Observed vs Model vs AI Interpretation

The UI should distinguish:

```text
OBSERVED
Oil rate: 184 BOPD

MODEL-DERIVED
Expected oil rate: 191 BOPD

AI INTERPRETATION
The production gap may be associated with reduced pump performance.
```

Never make AI interpretation look like telemetry.

---

## 24. Data Sufficiency

When data is missing:

```text
I don't have enough current data to determine the cause reliably.

Available:
• Production trend

Missing:
• Reservoir temperature
• Pump condition
```

Then provide useful navigation:

```text
[Open Reservoir]
[Open SRP]
```

Never guess.

---

## 25. Core AI Capabilities

### A. Navigation

Examples:
- "Open BW-17"
- "Show me the reservoir"
- "Take me to SRP"
- "Show production trends"

### B. Data lookup

Examples:
- "What is BW-17 producing?"
- "What is the current pump fillage?"
- "What is reservoir temperature?"

### C. Explanation

Examples:
- "What does pump fillage mean?"
- "Explain this KPI."

### D. Investigation

Examples:
- "Why is BW-17 production declining?"
- "Investigate this alert."

### E. Comparison

Examples:
- "Which well has the lowest production?"
- "Which well needs attention?"
- "Compare BW-17 and BW-23."

---

## 26. Explain KPI

Important KPI cards should support:

```text
Explain with AI
```

Clicking it opens the Copilot with KPI context already populated.

Example:

```text
Pump Fillage
84.6%

[Explain with AI]
```

The engineer should not need to retype the KPI question.

---

## 27. Investigate Alert

For alerts, support:

```text
[Investigate with AI]
```

Provide the AI with:

```text
well
alert
severity
timestamp
related KPI context
```

Expected response:

```text
Summary
Evidence
Possible cause
Suggested investigation
Navigation actions
```

---

## 28. Multi-Well Questions

Support:

```text
Which well needs attention?
Which well has the highest production?
Which wells have SRP problems?
Compare BW-17 and BW-23.
```

Use structured filtering/aggregation first.

Do not send all raw telemetry for all wells to Gemini.

---

## 29. Conversation Context

Support short conversational context.

Example:

```text
Engineer:
What's wrong with BW-17?

AI:
...

Engineer:
Show me the pump.

AI:
→ BW-17 SRP
```

Maintain lightweight context:

```ts
interface AiConversationState {
  selectedWellId?: string;
  lastIntent?: AiIntent;
  lastReferencedPage?: string;
}
```

Do not implement long-term engineer memory yet.

---

## 30. Frontend Structure

Adapt to the existing repository, but organize the feature approximately as:

```text
src/
└── features/
    └── ai-copilot/
        ├── components/
        │   ├── AiCopilot.tsx
        │   ├── AiHeader.tsx
        │   ├── AiMessage.tsx
        │   ├── AiInput.tsx
        │   ├── SuggestedPrompts.tsx
        │   ├── EvidenceList.tsx
        │   ├── ConfidenceBadge.tsx
        │   └── AiActionButton.tsx
        │
        ├── hooks/
        │   ├── useAiCopilot.ts
        │   └── useAiContext.ts
        │
        ├── services/
        │   ├── aiClient.ts
        │   ├── aiOrchestrator.ts
        │   └── navigationService.ts
        │
        ├── data/
        │   ├── AiDataProvider.ts
        │   ├── DemoAiDataProvider.ts
        │   ├── ApiAiDataProvider.ts
        │   └── createAiDataProvider.ts
        │
        ├── types/
        │   └── ai.ts
        │
        ├── navigationRegistry.ts
        ├── intentRegistry.ts
        ├── contextBuilder.ts
        └── validators.ts
```

Do not create duplicate folders if equivalent project structure already exists.

---

## 31. Future Backend Structure

When FastAPI is introduced:

```text
backend/
└── app/
    ├── ai/
    │   ├── orchestrator.py
    │   ├── context_builder.py
    │   ├── intent_router.py
    │   ├── action_planner.py
    │   ├── validators.py
    │   ├── prompts/
    │   │   ├── system.py
    │   │   └── engineering.py
    │   └── providers/
    │       ├── base.py
    │       ├── gemini.py
    │       └── mock.py
    │
    └── api/
        └── v1/
            └── ai.py
```

---

## 32. Backend API Contract

Use a stable contract such as:

```http
POST /api/v1/ai/chat
```

Request:

```json
{
  "message": "Why is BW-17 production declining?",
  "uiContext": {
    "fieldId": "baghewala",
    "currentWellId": "BW-17",
    "currentPage": "overview"
  }
}
```

Response:

```json
{
  "answer": "...",
  "intent": "INVESTIGATION",
  "confidence": 0.82,
  "evidence": [],
  "actions": []
}
```

The frontend should not need a redesign when backend data is introduced.

---

## 33. Migration from Demo to Supabase

### NOW

```text
React
 ↓
AI Client
 ↓
DemoAiDataProvider
 ↓
Frontend Demo Data
 ↓
Gemini
```

### LATER

```text
React
 ↓
AI Client
 ↓
FastAPI
 ↓
Supabase / Analytics / ML
 ↓
Gemini
```

The following must remain stable:
- Copilot UI
- AI response schema
- Navigation registry
- Action types
- Domain concepts
- Context structure

Only the underlying data retrieval and transport should change.

---

## 34. Error Handling

Handle:

```text
Gemini unavailable
FastAPI unavailable
Data unavailable
Invalid Gemini response
Unknown well
Unknown page
Timeout
Rate limit
```

Example:

```text
AI is temporarily unavailable.

You can continue using the Well Twin interface normally.
```

AI failure must never break the website.

---

## 35. Loading UX

Use truthful states such as:

```text
Checking BW-17...
```

or:

```text
Analyzing relevant well data...
```

Do not fake progress stages.

---

## 36. Security

Never expose:

```text
GEMINI_API_KEY
SUPABASE_SERVICE_ROLE_KEY
```

in production frontend code.

Preferred production flow:

```text
React
 ↓
FastAPI
 ↓
Gemini
```

Supabase service-role credentials remain backend-only.

Provide `.env.example`.

---

## 37. Testing

### Navigation

Test:
- Open BW-17
- Open SRP
- Open Reservoir
- Open Production

Verify exact existing route.

### Demo data

Verify:

```text
AI answer == displayed demo value
```

for representative KPIs.

### Context

On BW-17 SRP:

```text
"Why is the pump behaving like this?"
```

Verify BW-17 + SRP context is used.

### Unknown data

```text
"What is BW-99 production?"
```

Must not fabricate.

### Gemini failure

Disable Gemini.

Website must continue functioning.

### Security

Verify arbitrary URL/action requests cannot be executed.

---

## 38. Acceptance Criteria — Current Demo Phase

- [ ] Copilot opens from the website.
- [ ] UI matches Well Twin design.
- [ ] Light theme works.
- [ ] Dark theme works.
- [ ] Current well is shown in context.
- [ ] Current page is shown in context.
- [ ] Suggested prompts work.
- [ ] Navigation requests work.
- [ ] Exact existing pages open.
- [ ] AI answers using actual frontend demo data.
- [ ] No duplicated fake AI dataset exists.
- [ ] Unknown data is handled safely.
- [ ] Structured Gemini responses are validated.
- [ ] Navigation actions are validated.
- [ ] Arbitrary URLs cannot be executed.
- [ ] Mock provider works without Gemini.
- [ ] Gemini is isolated behind a provider interface.
- [ ] AI failure does not break the website.
- [ ] Existing website features continue working.

---

## 39. Acceptance Criteria — Future Supabase Phase

- [ ] ApiAiDataProvider uses FastAPI.
- [ ] FastAPI retrieves data from Supabase.
- [ ] Gemini is called server-side.
- [ ] Supabase service-role credentials stay server-side.
- [ ] AI answers use stored/live data.
- [ ] Existing Copilot UI remains unchanged.
- [ ] Navigation remains unchanged.
- [ ] Context uses normalized backend data.
- [ ] Historical telemetry can be queried efficiently.
- [ ] Reservoir, Wellbore, SRP and Production states can be combined.
- [ ] Multi-well comparisons work.
- [ ] Alert/anomaly investigation works.

---

## 40. Implementation Order

### Step 1 — Inspect
Read all project docs, current routes, demo data, types, and design assets.

### Step 2 — Contracts
Create:
- AiResponse
- AiAction
- AiContext
- AiIntent
- AiDataProvider
- AiProvider

### Step 3 — Navigation
Build the navigation registry using actual routes.

### Step 4 — Demo Provider
Adapt existing frontend demo data.

### Step 5 — Mock Provider
Implement deterministic mock responses for UI/navigation testing.

### Step 6 — Copilot UI
Implement:
- drawer
- input
- messages
- suggestions
- evidence
- confidence
- actions
- loading
- errors

### Step 7 — Gemini
Connect Gemini through the provider abstraction.

### Step 8 — Validation
Add structured-response and action validation.

### Step 9 — Context
Add current-page/current-well and relevant twin context.

### Step 10 — Engineering Reasoning
Add investigation, evidence and cross-twin reasoning.

### Step 11 — API Provider
Implement `ApiAiDataProvider` for FastAPI.

### Step 12 — Supabase
Connect backend data to the same normalized AI context.

### Step 13 — Final Testing
Verify Demo and API modes produce equivalent AI behavior.

---

## 41. P0 / P1 / P2

### P0 — Must Have

```text
Copilot UI
Gemini
Demo data provider
Navigation registry
Context awareness
Structured output
Action validation
Navigation
Data lookup
Error handling
Light/dark theme
```

### P1 — Important

```text
Evidence
Confidence
Explain KPI
Investigate alert
Cross-twin reasoning
Multi-well comparison
```

### P2 — Later

```text
Voice
Advanced recommendations
Historical reasoning
What-if analysis
Advanced agentic workflows
```

---

## 42. What NOT to Build Now

Do not build:
- Voice assistant
- Autonomous well control
- Automatic pump changes
- Automatic CSS changes
- Automatic work-order execution
- Unrestricted autonomous agent
- Long-term personal memory
- Open-ended internet research
- AI-generated telemetry
- A second copy of the demo database
- A vector database unless a later requirement genuinely needs it

The first version should be:

> Read → Understand → Explain → Navigate → Recommend investigation

Not:

> Control the well automatically.

---

## 43. Final Demo Scenario

The target experience should support:

```text
Engineer:
"Which well needs attention right now?"

AI:
"BW-17 currently has the highest attention level.
The main contributors are declining production and
SRP performance indicators."

[Open BW-17]

        ↓

BW-17 Overview opens

Engineer:
"Why?"

        ↓

AI:
"The available twin data shows decreasing reservoir
temperature alongside increasing viscosity and reduced
pump performance. These changes may be contributing
to the observed production decline."

Evidence:
• Reservoir temperature
• Viscosity
• Pump fillage
• Production

[View Reservoir]
[View SRP]
[View Production]

        ↓

Engineer:
"Show me the pump."

        ↓

BW-17 → SRP opens
```

This is the desired experience: the AI is an integrated, context-aware engineering interface rather than a chatbot bolted onto the website.

---

## 44. Final Instruction to Antigravity

Implement this feature into the EXISTING Well Twin application.

Do not rebuild the website.
Do not replace existing routing.
Do not replace existing demo data.
Do not duplicate existing domain models.
Do not hardcode AI-specific copies of displayed values.
Do not expose Gemini secrets in production frontend code.

The architecture must support:

```text
CURRENT:
Frontend Demo Data
→ DemoAiDataProvider
→ AI Copilot

FUTURE:
Supabase
→ FastAPI
→ ApiAiDataProvider
→ AI Copilot
```

Both modes must produce the same normalized AI context and the same `AiResponse` contract.

The future Supabase integration must be an incremental data/backend change, not an AI feature rewrite.

Before finishing, verify that the existing Well Twin application continues to work normally when the Copilot is disabled, unavailable, or when Gemini fails.
