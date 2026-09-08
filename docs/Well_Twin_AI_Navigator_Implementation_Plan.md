# Well Twin AI Navigator — Full Implementation Plan

## 1. Objective

Upgrade the existing Well Twin AI Navigator from a basic text chatbot into a **voice-enabled, intent-aware, grounded AI engineering navigator**.

The implementation must work in two modes:

1. **Current demo mode** — uses the existing frontend/mock data.
2. **Future production mode** — uses Supabase as the source of truth.

The AI must be designed so that Gemini **never directly controls the UI and never invents Well Twin operational data**.

---

# 2. Target Architecture

```text
                         USER
                           |
                +----------+----------+
                |                     |
             TEXT INPUT          MICROPHONE
                |                     |
                |                Sarvam STT
                |                     |
                +----------+----------+
                           |
                           v
                  USER TRANSCRIPT
                           |
                           v
                 +-------------------+
                 |  GEMINI ROUTER    |
                 | Intent Classifier |
                 +---------+---------+
                           |
              +------------+-------------+
              |            |             |
              v            v             v
         NAVIGATION      DATA QUERY   GENERAL QA
              |            |             |
              v            v             v
       App Navigation   Data Access   Gemini Answer
              |            |             |
              |            v             |
              |       Grounding Gate     |
              |            |             |
              |            +------+------+
              |                   |
              +-------------------+
                           |
                           v
                    FINAL RESPONSE
                           |
                           v
                     Sarvam TTS
                           |
                           v
                    AUDIO PLAYBACK
```

## Core principle

```text
Gemini decides WHAT the user wants.
Application decides HOW to execute it.
Data layer decides WHAT information is true.
```

---

# 3. Technology Stack

## Existing application

Preserve the current framework, routing, state management, styling, and component system wherever possible.

## AI

- Google Gemini — intent classification and grounded answer generation
- Gemini Structured Output / JSON Schema — deterministic router output

## Voice

- Sarvam Saaras — Speech-to-Text
- Sarvam Bulbul — Text-to-Speech

## Data

### Phase 1
Existing frontend/mock data.

### Phase 2
Supabase.

## Backend

Use the project's existing backend/API mechanism.

If the project uses Next.js API routes/server actions, implement the AI endpoints there. Do not create a second backend unless required by the existing architecture.

---

# 4. Implementation Principles

## 4.1 No arbitrary AI navigation

Never do:

```text
Gemini -> arbitrary URL -> browser
```

Instead:

```text
Gemini -> validated intent -> application action -> known route
```

## 4.2 No hallucinated operational data

Gemini must never invent:

- Well IDs
- Oil rate
- Water rate
- BHP
- BHT
- Pressure
- Telemetry
- CSS cycle
- SRP values
- Alerts
- Equipment condition
- Production history
- Recommendations presented as actual observations

If data is unavailable:

```text
INSUFFICIENT_DATA
```

## 4.3 General knowledge must be distinguished from live Well Twin data

Example:

> What is artificial lift?

Allowed: general engineering explanation.

Example:

> Why is BW-017 production declining?

Must use verified Well Twin data.

## 4.4 Current demo data must remain functional

Do not hardcode the AI directly against mock arrays.

Create a data-access abstraction:

```typescript
getWellData(wellId)
getTelemetry(wellId)
getAlerts(wellId)
getProductionHistory(wellId)
getRecommendations(wellId)
```

The implementation can initially use mock data and later switch to Supabase.

---

# 5. Phase 0 — Inspect Existing Project

Before modifying anything, inspect:

- `package.json`
- application routing
- current AI Navigator component
- existing API routes
- mock/demo data
- state management
- page components
- well data structures
- existing environment variable setup
- existing deployment configuration
- existing Gemini integration, if any

Create an implementation map:

```text
Current AI Navigator:
<actual file path>

Current routes:
<actual routes>

Current demo data:
<actual file path>

Current AI/API code:
<actual file path>

Recommended new service location:
<actual location>
```

Do not duplicate existing functionality.

---

# 6. Phase 1 — Create the AI Domain Model

Create centralized types.

Recommended structure:

```text
ai/
  types/
    intent.ts
    response.ts
    context.ts
```

## Intent type

```typescript
type NavigatorIntent =
  | "NAVIGATE"
  | "SELECT_WELL"
  | "VIEW_WELL_HEALTH"
  | "VIEW_PRODUCTION"
  | "VIEW_TRENDS"
  | "VIEW_CSS_CYCLE"
  | "VIEW_ALERTS"
  | "VIEW_RECOMMENDATIONS"
  | "VIEW_WORK_ORDERS"
  | "VIEW_EQUIPMENT"
  | "VIEW_AI_INSIGHTS"
  | "EXPLAIN_WELL"
  | "EXPLAIN_ALERT"
  | "WEBSITE_DATA_QUERY"
  | "GENERAL_KNOWLEDGE"
  | "INSUFFICIENT_DATA"
  | "NEEDS_CLARIFICATION"
  | "OUT_OF_SCOPE";
```

## Router response

```typescript
interface NavigatorIntentResult {
  intent: NavigatorIntent;
  target: string | null;
  wellId: string | null;
  confidence: number;
  reason: string;
}
```

Keep this schema strict.

---

# 7. Phase 2 — Create Website Manifest

Create one source of truth for all valid application destinations.

Example:

```typescript
export const WEBSITE_MANIFEST = [
  {
    id: "field_map",
    route: "/",
    description: "Field map showing all wells"
  },
  {
    id: "overview",
    route: "/overview",
    description: "Field and production overview"
  },
  {
    id: "well_state",
    route: "/well-state",
    description: "Current well operating state"
  },
  {
    id: "trends",
    route: "/trends",
    description: "Production and telemetry trends"
  },
  {
    id: "css_cycle",
    route: "/css-cycle",
    description: "CSS cycle tracking"
  },
  {
    id: "alerts",
    route: "/alerts",
    description: "Operational alerts"
  },
  {
    id: "recommendations",
    route: "/recommendations",
    description: "Engineering recommendations"
  },
  {
    id: "work_orders",
    route: "/work-orders",
    description: "Operational work orders"
  }
];
```

Use the **actual routes from the project**, not the example routes above.

Gemini must receive this manifest as context.

Rule:

> If a route does not exist in the manifest, Gemini cannot navigate to it.

---

# 8. Phase 3 — Create Navigation Action Registry

Create:

```text
navigation/
  manifest.ts
  actions.ts
  executor.ts
```

Example:

```typescript
const navigationActions = {
  field_map: () => {},
  overview: () => {},
  well_state: () => {},
  trends: () => {},
  css_cycle: () => {},
  alerts: () => {},
  recommendations: () => {},
  work_orders: () => {}
};
```

The actual implementation should use the project's existing router/state.

For well-specific actions:

```typescript
selectWell(wellId)
```

Validate the well ID before executing.

Never execute an unknown well ID.

---

# 9. Phase 4 — Build Gemini Intent Router

Create:

```text
ai/
  router/
    prompt.ts
    schema.ts
    router.ts
```

The router receives:

```text
User question
+
Website manifest
+
Valid intents
+
Available well IDs
+
Current page
+
Current selected well
```

## Router rules

Gemini must:

1. Classify the user request.
2. Identify the target page if applicable.
3. Identify the well if explicitly mentioned.
4. Never invent a route.
5. Never invent a well.
6. Never answer live operational questions directly.
7. Return strict JSON.
8. Return `NEEDS_CLARIFICATION` if intent is ambiguous.
9. Return `INSUFFICIENT_DATA` if required data is unavailable.
10. Return `OUT_OF_SCOPE` for unrelated requests.

---

# 10. Gemini Structured Output

Use Gemini's structured-output/JSON-schema capability.

Expected output:

```json
{
  "intent": "VIEW_TRENDS",
  "target": "trends",
  "wellId": "BW-017",
  "confidence": 0.97,
  "reason": "The user requested production trends for BW-017."
}
```

Validate the response server-side before using it.

Do not trust raw model JSON.

Validation should check:

```text
intent is valid
target exists in manifest
wellId exists in dataset
confidence is between 0 and 1
required fields exist
```

If validation fails:

```text
NEEDS_CLARIFICATION
```

or retry once with a correction prompt.

---

# 11. Phase 5 — Create Data Access Layer

Create:

```text
data/
  types.ts
  repository.ts
  mockRepository.ts
  supabaseRepository.ts
  index.ts
```

Interface:

```typescript
interface WellDataRepository {
  getWell(wellId: string): Promise<Well | null>;
  getTelemetry(wellId: string): Promise<Telemetry | null>;
  getProductionHistory(wellId: string): Promise<ProductionPoint[]>;
  getAlerts(wellId?: string): Promise<Alert[]>;
  getRecommendations(wellId?: string): Promise<Recommendation[]>;
}
```

## Current mode

```text
repository = mockRepository
```

## Future mode

```text
repository = supabaseRepository
```

The AI layer should not know which repository is being used.

---

# 12. Phase 6 — Create Grounding Layer

Create:

```text
ai/
  grounding/
    contextBuilder.ts
    groundingGate.ts
```

The grounding layer determines whether enough trusted data exists to answer.

Example:

```typescript
const context = {
  well: wellData,
  telemetry: telemetryData,
  alerts: alerts,
  productionHistory: history
};
```

Before calling the answer model:

```text
Required information available?
        |
     +--+--+
     |     |
    YES    NO
     |     |
     v     v
 Gemini   INSUFFICIENT_DATA
```

Do not pass irrelevant data to Gemini.

Only pass the minimum verified context needed for the answer.

---

# 13. Phase 7 — Build Grounded Answer Service

Create:

```text
ai/
  answer/
    answer.ts
    prompt.ts
```

The answer model receives:

```text
User question
+
Intent
+
Verified Well Twin context
```

System rules:

```text
You are the Well Twin Engineering Assistant.

Answer only using:
1. verified Well Twin context provided in this request
2. general engineering knowledge when explicitly appropriate

Never invent operational values.

If the required Well Twin data is missing, say so.

Do not convert estimates into facts.

When discussing operational data:
- distinguish observed data from interpretation
- mention uncertainty where appropriate
- do not claim causation unless supported by the supplied data

Do not fabricate sources or measurements.
```

---

# 14. Phase 8 — Implement Request Orchestrator

Create one central server-side flow:

```text
POST /api/ai/navigator
```

Request:

```json
{
  "message": "Why is BW-017 production declining?",
  "currentPage": "field_map",
  "selectedWell": "BW-017"
}
```

Processing:

```text
1. Validate request
2. Build navigation/data context
3. Call Gemini Router
4. Validate router response
5. If NAVIGATION:
      execute/return validated action
6. If DATA QUERY:
      fetch trusted data
      grounding gate
      call answer model
7. If GENERAL KNOWLEDGE:
      call answer model
8. If INSUFFICIENT_DATA:
      return safe response
9. Return response object
```

Response:

```json
{
  "type": "ANSWER",
  "intent": "EXPLAIN_WELL",
  "message": "...",
  "wellId": "BW-017",
  "navigation": null,
  "audio": null
}
```

For navigation:

```json
{
  "type": "NAVIGATION",
  "intent": "VIEW_TRENDS",
  "navigation": {
    "target": "trends",
    "wellId": "BW-017"
  },
  "message": "Opening production trends for BW-017."
}
```

---

# 15. Phase 9 — Sarvam Speech-to-Text

Create:

```text
sarvam/
  stt.ts
```

Create server endpoint:

```text
POST /api/voice/stt
```

Flow:

```text
Browser microphone
       ↓
Audio Blob
       ↓
/api/voice/stt
       ↓
Sarvam Saaras
       ↓
Transcript
       ↓
Navigator
```

Never expose the Sarvam API key in browser code.

## UI states

```text
IDLE
LISTENING
TRANSCRIBING
PROCESSING
SPEAKING
ERROR
```

Display:

```text
Listening...
```

and then:

```text
You:
"Why is BW-017 production declining?"
```

before sending it for processing.

---

# 16. Phase 10 — Sarvam Text-to-Speech

Create:

```text
sarvam/
  tts.ts
```

Create:

```text
POST /api/voice/tts
```

Flow:

```text
Final assistant response
        ↓
Sarvam Bulbul
        ↓
Audio
        ↓
Browser
```

Use streaming where practical for lower perceived latency.

The frontend should support:

```text
Play
Pause
Replay
```

Do not make voice mandatory. Text must always remain available.

---

# 17. Phase 11 — Upgrade AI Navigator UI

Keep the existing right-side panel.

Upgrade the bottom input:

```text
+------------------------------------------------+
| 🎙 | Ask about BW-017 or request navigation... |
|                                      | Send |  |
+------------------------------------------------+
```

Voice interaction:

```text
+----------------------------------------------+
| 🔴 Listening...                              |
| "Show production trends for BW-017"          |
|                                  Stop        |
+----------------------------------------------+
```

Processing:

```text
Analyzing...
```

Answer:

```text
AI
BW-017's oil rate has decreased from ...
```

Audio:

```text
▶ Play response
```

Navigation response:

```text
AI
Opening production trends for BW-017...
```

Then automatically navigate.

---

# 18. Phase 12 — Suggested Prompt Actions

Keep the current suggested engineering prompts.

Convert them into actual navigator requests.

Examples:

```text
Why is BW-017 production declining?
→ EXPLAIN_WELL

Which well needs attention right now?
→ WEBSITE_DATA_QUERY

Show SRP lift dynamics for BW-017
→ VIEW_WELL_HEALTH / WEBSITE_DATA_QUERY

Explain active gas interference alert
→ EXPLAIN_ALERT

What is the current Digital Twin health score?
→ WEBSITE_DATA_QUERY
```

Do not hardcode answers into these buttons.

They should go through the same navigator pipeline.

---

# 19. Phase 13 — Current Demo Data Compatibility

The application currently uses demo data in the frontend.

Do NOT move everything to Supabase immediately just to implement the navigator.

Instead:

```text
AI
 |
 v
Data Repository
 |
 +---- Mock Repository
 |
 +---- Supabase Repository
```

Use an environment switch:

```text
DATA_SOURCE=mock
```

Later:

```text
DATA_SOURCE=supabase
```

This means the AI implementation remains unchanged.

---

# 20. Phase 14 — Supabase Migration Preparation

Prepare tables/interfaces around actual Well Twin entities.

Recommended future entities:

```text
wells
well_telemetry
production_history
alerts
css_cycles
equipment
recommendations
work_orders
```

The exact schema should be finalized after inspecting the existing project data model.

The AI should never query arbitrary tables based on Gemini-generated SQL.

Never do:

```text
Gemini -> SQL -> Supabase
```

Instead:

```text
Gemini -> Intent
         ↓
Application repository function
         ↓
Parameterized Supabase query
```

This is a critical security and reliability rule.

---

# 21. Phase 15 — Security

Environment variables:

```text
GEMINI_API_KEY=
SARVAM_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

If server-side privileged Supabase access is required:

```text
SUPABASE_SERVICE_ROLE_KEY=
```

Never expose service-role keys to the client.

Never put Gemini/Sarvam secrets into frontend bundles.

Validate all:

- user input
- well IDs
- intent values
- navigation targets
- API payloads

Add rate limiting if the backend is publicly accessible.

---

# 22. Phase 16 — Error Handling

Handle:

## Microphone

```text
Permission denied
No microphone
Recording failure
Unsupported browser
```

Message:

> Microphone access is unavailable. You can continue using text input.

## Sarvam

```text
STT timeout
STT invalid response
TTS timeout
TTS failure
```

Fallback:

```text
Continue with text response.
```

## Gemini

```text
Timeout
Invalid JSON
API failure
Safety block
```

Fallback:

```text
I couldn't reliably process that request. Please try again.
```

Do not fabricate an answer.

## Data

```text
Well not found
Telemetry unavailable
Database unavailable
No historical data
```

Return:

```text
INSUFFICIENT_DATA
```

---

# 23. Phase 17 — Observability

For development, log:

```text
requestId
timestamp
user intent
router confidence
target
wellId
data source
latency
error type
```

Do NOT log sensitive user information unnecessarily.

Example:

```text
[Navigator]
intent=VIEW_TRENDS
target=trends
well=BW-017
confidence=0.97
dataSource=mock
latency=820ms
```

---

# 24. Phase 18 — Testing

Create unit tests for:

## Intent routing

```text
"Open the trends page"
→ VIEW_TRENDS

"Show BW-017"
→ SELECT_WELL

"Show alerts"
→ VIEW_ALERTS

"Open CSS cycle tracker"
→ VIEW_CSS_CYCLE

"What is artificial lift?"
→ GENERAL_KNOWLEDGE
```

## Invalid navigation

```text
"Open reservoir simulation page"
```

If that page is not in the manifest:

```text
NEEDS_CLARIFICATION
```

Never invent a route.

## Invalid well

```text
"Show BW-999"
```

If unavailable:

```text
INSUFFICIENT_DATA
```

## Missing telemetry

```text
"What is reservoir pressure of BW-017?"
```

If reservoir pressure isn't available:

```text
INSUFFICIENT_DATA
```

## Hallucination test

Ask:

```text
"What was BW-017's exact reservoir pressure yesterday?"
```

when the dataset doesn't contain it.

Expected:

```text
Cannot answer reliably because the required data is unavailable.
```

## Voice

Test:

```text
Microphone
→ STT
→ transcript
→ router
→ answer/action
→ TTS
→ playback
```

---

# 25. Phase 19 — End-to-End Test Cases

### Test 1 — Navigation

User:

> Open the trends page for BW-017.

Expected:

```text
Sarvam STT
→ Gemini Router
→ VIEW_TRENDS
→ select BW-017
→ navigate to Trends
→ TTS confirmation
```

### Test 2 — Well explanation

User:

> Why is BW-017 production declining?

Expected:

```text
Router
→ EXPLAIN_WELL
→ fetch verified BW-017 data
→ grounding gate
→ Gemini answer
→ TTS
```

### Test 3 — General knowledge

User:

> What is artificial lift?

Expected:

```text
Router
→ GENERAL_KNOWLEDGE
→ Gemini answer
→ TTS
```

### Test 4 — Missing data

User:

> What is the reservoir pressure of BW-017?

Expected:

```text
Router
→ WEBSITE_DATA_QUERY
→ repository
→ data missing
→ INSUFFICIENT_DATA
→ safe response
```

### Test 5 — Out of scope

User:

> Who won yesterday's cricket match?

Expected:

```text
OUT_OF_SCOPE
```

Do not invent an answer using Well Twin data.

---

# 26. Phase 20 — Performance Optimization

Target experience:

```text
Voice recording
      ↓
STT
      ↓
Router
      ↓
Action/Answer
      ↓
TTS
```

Optimize by:

- keeping router prompt small
- sending only relevant data to Gemini
- caching static website manifest
- caching available well IDs
- avoiding unnecessary second Gemini calls for navigation
- streaming TTS where supported
- avoiding sending entire database records to Gemini
- aborting duplicate requests
- debouncing repeated UI actions

---

# 27. Recommended Response Contract

Every navigator request should produce one predictable response shape.

```typescript
interface NavigatorResponse {
  type:
    | "NAVIGATION"
    | "ANSWER"
    | "CLARIFICATION"
    | "INSUFFICIENT_DATA"
    | "OUT_OF_SCOPE"
    | "ERROR";

  intent: NavigatorIntent;

  message: string;

  navigation?: {
    target: string;
    wellId?: string;
  };

  metadata?: {
    confidence?: number;
    dataSource?: "mock" | "supabase";
  };
}
```

This keeps the frontend simple.

---

# 28. Final Project Structure

Adapt this to the existing project rather than blindly creating every folder:

```text
src/
├── ai/
│   ├── router/
│   │   ├── router.ts
│   │   ├── prompt.ts
│   │   └── schema.ts
│   │
│   ├── answer/
│   │   ├── answer.ts
│   │   └── prompt.ts
│   │
│   ├── grounding/
│   │   ├── contextBuilder.ts
│   │   └── groundingGate.ts
│   │
│   └── types/
│       ├── intent.ts
│       ├── context.ts
│       └── response.ts
│
├── navigation/
│   ├── manifest.ts
│   ├── actions.ts
│   └── executor.ts
│
├── data/
│   ├── types.ts
│   ├── repository.ts
│   ├── mockRepository.ts
│   ├── supabaseRepository.ts
│   └── index.ts
│
├── sarvam/
│   ├── stt.ts
│   └── tts.ts
│
├── components/
│   └── AI Navigator/
│       ├── NavigatorPanel
│       ├── VoiceButton
│       ├── Transcript
│       ├── Message
│       └── AudioPlayer
│
└── api/
    ├── ai/
    │   └── navigator
    │
    └── voice/
        ├── stt
        └── tts
```

Use the project's existing conventions if different.

---

# 29. Implementation Order

Implement in this exact order:

## Step 1
Inspect current codebase.

## Step 2
Identify existing routes, data structures, and AI Navigator.

## Step 3
Create centralized intent types.

## Step 4
Create website manifest.

## Step 5
Create navigation action registry.

## Step 6
Implement Gemini intent router.

## Step 7
Add structured JSON validation.

## Step 8
Connect router to actual frontend navigation.

## Step 9
Create data repository abstraction.

## Step 10
Connect current demo data to repository.

## Step 11
Implement grounding layer.

## Step 12
Implement Gemini grounded answer service.

## Step 13
Create unified `/api/ai/navigator` orchestration endpoint.

## Step 14
Upgrade Navigator UI.

## Step 15
Add Sarvam STT.

## Step 16
Add Sarvam TTS.

## Step 17
Add loading/error/voice states.

## Step 18
Add logging and observability.

## Step 19
Run unit tests.

## Step 20
Run end-to-end tests.

## Step 21
Test hallucination resistance.

## Step 22
Deploy and test production environment variables.

## Step 23
Only after this, replace mock repository with Supabase.

---

# 30. Definition of Done

The feature is complete only when all of the following work:

- [ ] Text questions work.
- [ ] Microphone input works.
- [ ] Sarvam STT produces transcript.
- [ ] Transcript is shown in UI.
- [ ] Gemini classifies intent.
- [ ] Gemini returns strict structured output.
- [ ] Invalid intents are rejected.
- [ ] Only existing website routes can be selected.
- [ ] Only existing well IDs can be selected.
- [ ] Navigation is executed by the application, not Gemini.
- [ ] Current mock data works.
- [ ] Data repository abstraction exists.
- [ ] Grounded questions retrieve verified data.
- [ ] Missing data produces a safe response.
- [ ] Gemini cannot fabricate telemetry.
- [ ] General engineering questions work.
- [ ] Out-of-scope questions are handled safely.
- [ ] Sarvam TTS generates audio.
- [ ] Audio can be played in the browser.
- [ ] API keys remain server-side.
- [ ] Gemini/Sarvam errors have fallbacks.
- [ ] Supabase can later replace the mock repository without changing the AI architecture.
- [ ] End-to-end voice navigation has been tested.
- [ ] Hallucination/missing-data tests pass.

---

# 31. SIH Demo Narrative

Use this architecture as a key differentiator in the presentation.

### User

> "Why is BW-017 production declining?"

### System

```text
Speech
 ↓
Sarvam STT
 ↓
Gemini Intent Router
 ↓
EXPLAIN_WELL
 ↓
Verified Well Twin data
 ↓
Grounding Gate
 ↓
Gemini
 ↓
Engineering explanation
 ↓
Sarvam TTS
 ↓
Voice response
```

Then demonstrate:

> "What is the reservoir pressure of BW-017?"

If that value is not available:

> "I don't have verified reservoir-pressure data for BW-017, so I can't provide a reliable value."

### Judge-facing explanation

> "We deliberately separate intent classification, application actions, data retrieval, and answer generation. Gemini never gets direct control of our UI or database. Operational answers are generated only from verified Well Twin context, and when the required data is unavailable, the system refuses to guess."

This should be one of the core technical points of the SIH presentation.

---

# 32. Important Engineering Rule

Do not try to make this a fully autonomous agent.

For this application, a **constrained AI navigator** is better than an unconstrained agent.

The desired behavior is:

```text
AI decides intent
       ↓
Application validates intent
       ↓
Application executes action
       ↓
Repository provides trusted data
       ↓
AI explains data
```

Not:

```text
AI decides everything
       ↓
AI executes everything
       ↓
AI invents missing information
```

The first architecture is safer, easier to test, easier to demonstrate to judges, and easier to migrate from demo data to Supabase.
