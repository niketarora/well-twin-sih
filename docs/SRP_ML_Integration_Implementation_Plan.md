# SRP ML Model Integration — Full Implementation Plan for Antigravity

## 0. Objective

Integrate the supplied **SRP Condition Monitoring Autoencoder model** into the existing Well Twin website.

### Critical requirements

1. The supplied model is located in:
   `docs/SRP_Model_Handoff.zip`
2. Create a **separate `ml/` folder** in the project for the model and all ML-specific logic/artifacts.
3. **Do NOT create a new website page.**
4. Integrate the model into the existing:
   - **SRP Lift Dynamics** page: `/twin/srp`
   - **Anomalies & Attribution / Anomaly Detection** page: `/anomalies`
5. The frontend must continue to work with the current demo/mock data.
6. The architecture must also support switching to Supabase/real sensor data later without rewriting the ML integration.
7. The ML model must run on the backend/server side, not directly in the browser.
8. Preserve the existing UI design system and do not redesign unrelated pages.

---

# 1. Model Package

The ZIP contains:

```text
SRP_Model_Handoff/
├── README.md
├── requirements.txt
├── models/
│   ├── preprocessing.json
│   ├── scaler.pkl
│   ├── srp_autoencoder.pt
│   └── threshold.json
└── src/
    └── predict.py
```

### Model type

PyTorch autoencoder for SRP anomaly detection.

Architecture:

```text
6
↓
Linear 6 → 32
↓ ReLU
Linear 32 → 16
↓ ReLU
Linear 16 → 8
↓
Linear 8 → 16
↓ ReLU
Linear 16 → 32
↓ ReLU
Linear 32 → 6
```

The anomaly score is the MSE reconstruction error.

The model returns:

```json
{
  "condition": "NORMAL | WARNING | CRITICAL",
  "anomaly_score": 0.000842,
  "warning_threshold": 0.001276,
  "critical_threshold": 0.007778
}
```

---

# 2. Model Inputs

The model accepts five externally supplied values:

```text
SPM
pump_fillage
min_rod_weight
max_rod_weight
dynamometer_area
```

It derives the sixth feature:

```text
rod_load_range = max_rod_weight - min_rod_weight
```

Final feature order MUST remain exactly:

```text
[
  "SPM",
  "pump_fillage",
  "min_rod_weight",
  "max_rod_weight",
  "dynamometer_area",
  "rod_load_range"
]
```

Do not reorder these features.

---

# 3. Existing Website Data Mapping

Before changing code, inspect the existing repository and identify the exact current data structures used by `/twin/srp`.

The current website already contains SRP-related values and a dynamometer card.

Expected mapping:

| ML feature | Existing website source | Action |
|---|---|---|
| `SPM` | Existing SRP `strokeRate` / SPM telemetry | Reuse |
| `pump_fillage` | Existing SRP `barrelFillage` / pump fillage | Reuse |
| `min_rod_weight` | Existing minimum polished-rod-load / dynamometer minimum | Reuse or derive |
| `max_rod_weight` | Existing peak/max polished-rod-load / dynamometer maximum | Reuse or derive |
| `dynamometer_area` | Existing dynamometer surface/card points | Calculate |
| `rod_load_range` | max rod weight - min rod weight | Calculate automatically |

### IMPORTANT

Do NOT add five manual input boxes to the website.

The ML model should consume the SRP data that is already displayed/available in the Digital Twin.

The engineer should not have to re-enter values that the application already knows.

---

# 4. Important Unit Validation

This is a mandatory implementation step.

The model's training data has numerical ranges defined in:

```text
models/preprocessing.json
```

including:

```text
SPM:
1.497062 → 7.0967

pump_fillage:
0.32372 → 100

min_rod_weight:
1760.974745 → 12930.335148

max_rod_weight:
2141.729523 → 16918.200746

dynamometer_area:
0 → 349350.755944

rod_load_range:
234.585381 → 3386.789597
```

The existing website may display rod loads using a different unit/scale.

### DO NOT assume website rod-load numbers can be passed directly to the model.

Create an explicit feature-normalization/mapping layer:

```text
Website SRP data
      ↓
ML feature extraction
      ↓
Unit conversion / normalization
      ↓
Validation
      ↓
Model preprocessing
      ↓
PyTorch model
```

Document every conversion.

If the exact physical-unit conversion cannot be established from the existing repository/model documentation, do not invent one. Flag it clearly and isolate the conversion in one function so it can be corrected later.

---

# 5. Target Project Structure

Create a dedicated ML folder.

Recommended structure:

```text
project-root/
│
├── docs/
│   └── SRP_Model_Handoff.zip
│
├── ml/
│   └── srp/
│       ├── README.md
│       ├── requirements.txt
│       │
│       ├── models/
│       │   ├── srp_autoencoder.pt
│       │   ├── scaler.pkl
│       │   ├── preprocessing.json
│       │   └── threshold.json
│       │
│       ├── src/
│       │   ├── __init__.py
│       │   ├── model.py
│       │   ├── preprocessing.py
│       │   ├── feature_builder.py
│       │   └── predictor.py
│       │
│       └── tests/
│           ├── test_model_loading.py
│           ├── test_preprocessing.py
│           └── test_prediction.py
│
├── backend/
│   └── ...
│
├── frontend/
│   └── ...
│
└── ...
```

If the repository already has a backend, integrate with it rather than creating a second backend.

If no backend exists, create a small Python FastAPI service.

---

# 6. Do Not Duplicate the Model

The ZIP is the source artifact.

After integration, copy/extract the required model artifacts into:

```text
ml/srp/models/
```

The production application should load:

```text
ml/srp/models/srp_autoencoder.pt
ml/srp/models/scaler.pkl
ml/srp/models/preprocessing.json
ml/srp/models/threshold.json
```

Do not keep multiple copies in random frontend/backend folders.

---

# 7. ML Module Responsibilities

## `model.py`

Define the exact PyTorch model architecture:

```python
class SRPAutoencoder(nn.Module):
    ...
```

The architecture must exactly match the supplied `predict.py`.

Load the `.pt` state dict with CPU/GPU-safe loading.

For the web application, CPU is acceptable initially.

---

## `preprocessing.py`

Responsibilities:

1. Load `preprocessing.json`.
2. Validate required features.
3. Apply the same clipping behavior as the supplied model.
4. Load the supplied scaler.
5. Transform features in the exact required order.

Do not change the model's preprocessing semantics.

---

## `feature_builder.py`

Create a clean function:

```python
build_srp_features(srp_data)
```

It should convert existing website SRP data into:

```python
{
    "SPM": ...,
    "pump_fillage": ...,
    "min_rod_weight": ...,
    "max_rod_weight": ...,
    "dynamometer_area": ...,
    "rod_load_range": ...
}
```

### Responsibilities

- Extract SPM.
- Extract pump fillage.
- Extract min rod weight.
- Extract max rod weight.
- Calculate dynamometer area.
- Calculate rod load range.
- Apply required unit conversion.
- Return feature metadata useful for debugging.

---

## `predictor.py`

Create a reusable service:

```python
class SRPPredictor:
    ...
```

Load all model artifacts ONCE during service initialization.

Do NOT load the `.pt`, `.pkl`, JSON files on every HTTP request.

Recommended lifecycle:

```text
Backend startup
     ↓
Load model
Load scaler
Load preprocessing
Load thresholds
     ↓
Keep in memory
     ↓
Serve predictions
```

Prediction method:

```python
predict(features)
```

Return:

```json
{
  "condition": "NORMAL",
  "anomaly_score": 0.000842,
  "warning_threshold": 0.001276,
  "critical_threshold": 0.007778
}
```

---

# 8. Backend API

Expose a backend endpoint.

Recommended:

```http
POST /api/srp/predict
```

Request:

```json
{
  "spm": 4.5,
  "pump_fillage": 72.5,
  "min_rod_weight": 3500,
  "max_rod_weight": 6500,
  "dynamometer_area": 120000
}
```

Response:

```json
{
  "condition": "NORMAL",
  "anomaly_score": 0.000842,
  "warning_threshold": 0.001276,
  "critical_threshold": 0.007778
}
```

Prefer returning the source features as well:

```json
{
  "inputs": {
    "spm": 4.5,
    "pump_fillage": 72.5,
    "min_rod_weight": 3500,
    "max_rod_weight": 6500,
    "dynamometer_area": 120000,
    "rod_load_range": 3000
  },
  "prediction": {
    "condition": "NORMAL",
    "anomaly_score": 0.000842,
    "warning_threshold": 0.001276,
    "critical_threshold": 0.007778
  }
}
```

This is useful for debugging and transparency.

---

# 9. Backend Validation

Validate before inference.

Required:

```text
All five input values exist
All are numeric
No NaN
No invalid infinity values
max_rod_weight >= min_rod_weight
```

Follow the supplied model's clipping behavior for values outside the training/preprocessing ranges.

However, distinguish:

```text
UI warning:
"Value is outside the model's expected training range."

from:

Internal preprocessing:
clip to model preprocessing bounds
```

Do not silently hide potentially problematic sensor data from the engineer.

---

# 10. FastAPI Example Endpoint Design

If FastAPI is used:

```text
backend/
├── main.py
├── routes/
│   └── srp.py
└── services/
    └── srp_service.py
```

The route should be thin:

```text
POST /api/srp/predict
        ↓
Validate request
        ↓
SRP service
        ↓
Feature builder
        ↓
Predictor
        ↓
Response
```

Do not put PyTorch implementation directly inside the route handler.

---

# 11. Frontend Integration — NO NEW PAGE

Use the existing page:

```text
/twin/srp
```

This is the primary ML integration page.

Do not create:

```text
/ml
/srp-ml
/prediction
/model
```

or any similar page.

---

# 12. Existing SRP Page Changes

Find the existing SRP page/component.

The ML result should appear in the existing SRP diagnostics area.

Recommended UI:

```text
┌──────────────────────────────────────┐
│ SRP ML CONDITION                     │
│                                      │
│ 🟢 NORMAL                            │
│                                      │
│ Anomaly Score                        │
│ 0.000842                             │
│                                      │
│ Warning     0.001276                 │
│ Critical    0.007778                 │
└──────────────────────────────────────┘
```

For WARNING:

```text
🟡 WARNING
Anomaly Score: 0.003151
```

For CRITICAL:

```text
🔴 CRITICAL
Anomaly Score: 0.012843
```

Use the website's existing status colors/components/design tokens rather than introducing a new visual system.

---

# 13. Put the Result Near the Dynamometer

The strongest UX is to place the ML status close to the existing:

```text
Interactive Full-Cycle Dynamometer Card
```

Reason:

```text
SRP telemetry
      +
Dynamometer card
      ↓
ML anomaly detection
      ↓
SRP condition
```

The engineer can immediately understand what data produced the anomaly result.

Do not duplicate the entire dynamometer chart.

---

# 14. Existing Diagnostic Grid

If the SRP page already has a diagnostic card such as:

```text
Floating Risk
Normal
```

reuse/augment that card for the ML result if appropriate.

Do not unnecessarily add another large section.

The goal is:

```text
Existing SRP page
      +
Small ML status/result component
```

not:

```text
Existing SRP page
      +
Huge new ML dashboard
```

---

# 15. Frontend Data Flow

The frontend should not manually enter the ML parameters.

Use the existing SRP state:

```text
Existing SRP data
      ↓
Feature extraction
      ↓
POST /api/srp/predict
      ↓
Prediction response
      ↓
SRP ML Condition Card
```

Create a small API client, e.g.:

```text
frontend/src/services/srpApi.ts
```

or use the repository's existing API/service pattern.

---

# 16. Mock/Demo Data Compatibility

The website currently uses demo/mock SRP data.

The implementation must work immediately with that data.

Create an adapter layer:

```text
Mock SRP Data
      ↓
SRP Feature Adapter
      ↓
ML API
```

Later:

```text
Supabase SRP Data
      ↓
Same SRP Feature Adapter
      ↓
ML API
```

The frontend should not need a major rewrite when Supabase is connected.

---

# 17. Supabase Compatibility

Do NOT make the ML model directly dependent on Supabase.

Recommended future architecture:

```text
                 ┌───────────────┐
                 │    Frontend   │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │    Backend    │
                 └───────┬───────┘
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
        Supabase data          SRP ML model
              │                     │
              └──────────┬──────────┘
                         ▼
                    Prediction
```

The model should receive normalized feature data, not database-specific objects.

---

# 18. Prediction Persistence

If the project already has a backend/Supabase layer, add prediction persistence later or as part of this implementation if practical.

Suggested table:

```text
srp_predictions
```

Fields:

```text
id
well_id
timestamp
spm
pump_fillage
min_rod_weight
max_rod_weight
dynamometer_area
rod_load_range
anomaly_score
condition
warning_threshold
critical_threshold
model_version
```

This allows the Anomalies page to display historical predictions.

---

# 19. Existing Anomalies Page Integration

Use the existing:

```text
/anomalies
```

page for historical/field-level anomaly information.

Do not create another page.

Possible display:

```text
SRP AUTOENCODER

BW-17    WARNING
BW-23    NORMAL
BW-03    NORMAL
```

Historical data:

```text
Timestamp
Well
Condition
Anomaly Score
```

Example:

```text
Sep 1   BW-17   NORMAL     0.0007
Sep 2   BW-17   NORMAL     0.0008
Sep 3   BW-17   WARNING    0.0021
Sep 4   BW-17   WARNING    0.0031
Sep 5   BW-17   CRITICAL   0.0092
```

Only implement this if it fits the existing anomaly page architecture.

---

# 20. Important Model Interpretation Rule

Do NOT label the ML result as a confirmed equipment failure.

The model is an:

```text
Autoencoder-based anomaly detector
```

It detects deviation from learned normal operating behavior.

Therefore:

```text
CRITICAL
```

means:

> The observed SRP feature pattern is significantly anomalous relative to the model's learned normal operating patterns.

It does NOT automatically mean:

```text
Pump failed
Rod broke
Gas interference confirmed
```

Keep this distinction in the UI and documentation.

---

# 21. Optional Gemini Integration

Do not replace the ML model with Gemini.

Recommended future pipeline:

```text
SRP telemetry
      ↓
SRP Autoencoder
      ↓
NORMAL / WARNING / CRITICAL
      ↓
Gemini explanation layer
      ↓
Engineer-friendly explanation
```

Example:

```text
ML:
WARNING

Gemini:
"The current SRP operating pattern differs from the learned
normal pattern. Review pump fillage and rod-load behavior
against recent operating history."
```

Gemini should explain/assist, not manufacture the numerical anomaly score.

---

# 22. Loading/Error/Unavailable States

The frontend must handle:

### Loading

```text
Analyzing SRP condition...
```

### API error

```text
SRP ML analysis unavailable

The latest SRP telemetry is still available.
```

### Missing feature

```text
Insufficient SRP data for ML analysis.
```

### Successful

```text
NORMAL / WARNING / CRITICAL
```

Never show a fake ML result when the API failed.

---

# 23. Testing Plan

## Test 1 — Model loading

Confirm:

```text
.pt loads
scaler loads
preprocessing.json loads
threshold.json loads
```

---

## Test 2 — Feature construction

Given:

```json
{
  "spm": 4.5,
  "pump_fillage": 72.5,
  "min_rod_weight": 3500,
  "max_rod_weight": 6500,
  "dynamometer_area": 120000
}
```

verify:

```text
rod_load_range = 3000
```

---

## Test 3 — Missing input

Should return validation error.

---

## Test 4 — Invalid rod weights

Input:

```text
min = 7000
max = 3000
```

Expected:

```text
400 validation error
Maximum rod weight cannot be less than minimum rod weight.
```

---

## Test 5 — Out-of-range values

Confirm the same clipping behavior as the supplied prediction script.

---

## Test 6 — Prediction consistency

Run the original supplied `predict.py` and the new backend implementation using the same inputs.

The:

```text
anomaly_score
condition
```

must match within floating-point tolerance.

This is a mandatory acceptance test.

---

# 24. Model Regression Test

Create fixed test cases.

For each case store:

```text
input features
expected anomaly score
expected condition
```

Then ensure future frontend/backend changes do not silently alter ML behavior.

Do not modify:

```text
model weights
thresholds
feature order
scaler
preprocessing logic
```

unless explicitly changing the model version.

---

# 25. Model Versioning

Add:

```text
model_version
```

to the backend response and, if predictions are persisted, to the database.

Example:

```json
{
  "model_version": "srp-autoencoder-v1"
}
```

This will make future retraining safer.

When a new model is trained:

```text
srp-autoencoder-v1
srp-autoencoder-v2
```

can coexist conceptually.

---

# 26. Security

Never expose:

```text
.pt
.pkl
threshold.json
scaler.pkl
```

through the frontend's public static assets.

The browser should only communicate with the prediction API.

Do not put model files under:

```text
frontend/public/
```

or any browser-accessible static directory.

---

# 27. Performance

The model is small and CPU inference should be sufficient.

Important optimization:

### Bad

```text
Every request:
load model
load scaler
load JSON
predict
```

### Good

```text
Server startup:
load model
load scaler
load config
        ↓
Requests:
feature build
predict
return result
```

Use `model.eval()` and `torch.no_grad()` during inference.

---

# 28. Environment / Dependencies

Use the supplied model dependencies as the baseline:

```text
torch==2.5.1
pandas
numpy
scikit-learn
joblib
```

If FastAPI is used, add:

```text
fastapi
uvicorn
pydantic
```

Do not upgrade PyTorch or alter model dependencies without testing prediction consistency.

---

# 29. Deployment

Recommended architecture:

```text
Frontend
   ↓
Existing deployment
   ↓
Backend API
   ↓
Python + FastAPI
   ↓
PyTorch SRP model
```

If the existing frontend is deployed on Vercel, do not attempt to run the PyTorch model inside the Vercel frontend runtime unless the repository already has a compatible server setup.

Use a Python-capable backend deployment.

For example:

```text
Frontend → Vercel
Backend  → Render / Python-capable service
Database → Supabase
ML       → Backend process
```

Use environment variables for:

```text
API_BASE_URL
SUPABASE_URL
SUPABASE_ANON_KEY
```

Do not hardcode secrets.

---

# 30. Exact Implementation Sequence

Antigravity MUST implement in this order.

## Step 1 — Inspect repository

Before changing anything:

- inspect frontend framework
- inspect routing
- inspect existing SRP page
- inspect existing SRP mock data
- inspect existing API/backend setup
- inspect existing anomaly page
- inspect package manager
- inspect deployment configuration

Do not overwrite existing architecture blindly.

---

## Step 2 — Inspect the model ZIP

Read:

```text
docs/SRP_Model_Handoff.zip
```

Extract/copy required files into:

```text
ml/srp/models/
```

Preserve the original artifacts.

---

## Step 3 — Implement ML package

Create:

```text
ml/srp/src/model.py
ml/srp/src/preprocessing.py
ml/srp/src/feature_builder.py
ml/srp/src/predictor.py
```

Port the supplied prediction behavior exactly.

---

## Step 4 — Add unit/feature mapping

Map existing website SRP data into the model features.

Pay special attention to rod-load units.

Calculate:

```text
rod_load_range
dynamometer_area
```

automatically.

---

## Step 5 — Implement backend API

Create:

```text
POST /api/srp/predict
```

Do not expose model files publicly.

---

## Step 6 — Verify API independently

Test with known input.

Compare result against the supplied `predict.py`.

Do not continue until consistency is confirmed.

---

## Step 7 — Connect `/twin/srp`

Use existing SRP data.

Automatically trigger prediction when appropriate.

Avoid unnecessary API calls.

A reasonable first implementation is:

```text
SRP page loads
      ↓
Current SRP data available
      ↓
Request ML prediction
      ↓
Display result
```

If the page already has refresh/live telemetry behavior, integrate with that mechanism rather than creating another polling system.

---

## Step 8 — Add ML status UI

Reuse existing cards/components.

Display:

```text
Condition
Anomaly Score
Warning Threshold
Critical Threshold
```

Do not add a new page.

---

## Step 9 — Integrate `/anomalies`

If the existing application has anomaly data flow, add SRP ML predictions to it.

Use it for historical/field-level monitoring.

---

## Step 10 — Preserve mock-data compatibility

Confirm the application still works if:

```text
Supabase = unavailable
```

and only mock SRP data exists.

---

## Step 11 — Add Supabase compatibility

Keep data access abstract.

The ML feature builder should accept a normalized SRP object, regardless of whether its source is:

```text
mock data
Supabase
future sensor/IoT stream
```

---

## Step 12 — Final regression test

Verify:

```text
Existing pages still load
Existing navigation still works
SRP page still works
Dynamometer chart still works
ML result appears
Anomaly page still works
No new page was created
Model prediction matches original implementation
No model artifacts are publicly exposed
```

---

# 31. Acceptance Criteria

The implementation is complete only when ALL are true.

### ML

- [ ] `docs/SRP_Model_Handoff.zip` has been inspected.
- [ ] Model artifacts are stored under `ml/srp/models/`.
- [ ] Autoencoder architecture exactly matches supplied model.
- [ ] Feature order exactly matches supplied model.
- [ ] Preprocessing exactly matches supplied model.
- [ ] Thresholds come from supplied `threshold.json`.
- [ ] Model loads once, not once per request.
- [ ] Prediction matches original `predict.py`.

### Backend

- [ ] SRP prediction API exists.
- [ ] Validation exists.
- [ ] Errors are handled.
- [ ] Model files are not publicly exposed.
- [ ] Response is structured and documented.

### Frontend

- [ ] No new page created.
- [ ] `/twin/srp` displays current ML condition.
- [ ] Existing SRP data feeds the model.
- [ ] No unnecessary manual input form.
- [ ] Loading/error states exist.
- [ ] Existing UI style is preserved.

### Anomaly Monitoring

- [ ] `/anomalies` can display SRP ML anomalies where appropriate.
- [ ] Historical prediction data can be persisted when backend/database is enabled.

### Future compatibility

- [ ] Mock data works.
- [ ] Supabase can later provide the same normalized SRP inputs.
- [ ] ML code does not depend directly on React components.
- [ ] Model version is tracked.

---

# 32. Final Desired Architecture

```text
                         WELL TWIN WEBSITE
                                │
              ┌─────────────────┴─────────────────┐
              │                                   │
              ▼                                   ▼
       /twin/srp                              /anomalies
              │                                   │
              │                                   │
       Existing SRP data                    Historical ML
              │                              predictions
              ▼
      SRP Feature Adapter
              │
       ┌──────┼────────┐
       │      │        │
      SPM  Fillage   Rod Loads
       │      │        │
       └──────┼────────┘
              │
              ▼
       Dynamometer Card
              │
              ▼
       Feature Builder
              │
              ▼
        FastAPI Backend
              │
              ▼
       SRP Predictor
              │
       ┌──────┼───────────────┐
       │      │               │
       ▼      ▼               ▼
     Model  Scaler       Thresholds
       │      │               │
       └──────┼───────────────┘
              ▼
        Anomaly Score
              │
       ┌──────┼───────┐
       ▼      ▼       ▼
    NORMAL WARNING CRITICAL
       │      │       │
       └──────┼───────┘
              ▼
       SRP Condition UI
              │
              ▼
       Engineer Dashboard
```

---

# 33. Antigravity Working Rules

While implementing, follow these rules:

1. **Do not create a new page for the ML model.**
2. **Do not redesign the existing website.**
3. **Do not replace existing mock data.**
4. **Do not hardcode the example prediction.**
5. **Do not put PyTorch/model files in the frontend.**
6. **Do not retrain or modify the supplied model.**
7. **Do not change feature order.**
8. **Do not change thresholds.**
9. **Do not silently invent rod-load unit conversions.**
10. **Do not claim CRITICAL means confirmed equipment failure.**
11. **Keep ML logic isolated inside `ml/srp/`.**
12. **Keep frontend/backend integration thin and clean.**
13. **Use existing `/twin/srp` and `/anomalies` pages.**
14. **Verify prediction parity with the original supplied `predict.py`.**
15. **After implementation, provide a concise list of every file created/modified and why.**

---

# 34. Final Deliverable

At the end, Antigravity should provide:

```text
1. ML model integrated
2. Dedicated ml/srp folder
3. Backend prediction API
4. Existing SRP page connected
5. Existing anomaly page connected where appropriate
6. No new page
7. Mock data compatibility
8. Clear Supabase-ready architecture
9. Prediction parity test
10. Documentation
```

The final user experience should feel like the ML model was always part of the Digital Twin:

```text
Existing SRP telemetry
        ↓
Existing dynamometer
        ↓
Automatic ML analysis
        ↓
NORMAL / WARNING / CRITICAL
        ↓
Engineer sees result
```

**The engineer should never have to manually enter the five model inputs when those values are already available in the Digital Twin.**
