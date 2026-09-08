# CSS Field-Month Surrogate Machine Learning Model

## Overview
This module contains the integration layer for the Cyclic Steam Stimulation (CSS) Field-Month Surrogate model deployed on Render. The model is a **CatBoost Regressor** trained on Brazilian thermal recovery field data (`brazil_oil_production.sqlite`) to forecast aggregate next-month oil production and evaluate steam injection sensitivity.

---

## Model Metadata
- **Model Name:** CSS ML Field-Month Surrogate
- **Algorithm:** CatBoost Regressor (`CatBoostRegressor`, depth=3, iterations=388, learning_rate=0.03, l2_leaf_reg=8.0)
- **Model Version:** `css-field-month-surrogate-v1.0.0`
- **Target Variable:** `next_period_oil_m3`
- **Selected Model Artifact:** `css_field_month_model.cbm` (`css_field_month_catboost.cbm`)
- **Validation RMSE:** 3,184.9 m³ (vs Naive baseline 3,145.9 m³)
- **Test Set Metrics:**
  - MAE: 1,903.95 m³
  - RMSE: 3,247.34 m³
  - R²: 0.7264

---

## Deployed API Contract
- **API Base URL:** `https://cssmodel.onrender.com`
- **Health Check:** `GET /health`
- **Model Info:** `GET /v1/model-info`
- **Inference Endpoint:** `POST /v1/predict`
- **Sensitivity Endpoint:** `POST /v1/steam-sensitivity`
- **HTTP Method:** `POST`
- **Content-Type:** `application/json`

---

## Input Features & Schema

### 1. Request Body Structure
The model expects a JSON object containing field geography and at least 4 continuous monthly history records:
```json
{
  "state": "RJ",
  "basin": "Bikaner-Nagaur",
  "field": "Baghewala",
  "history": [
    {
      "date": "2026-05-01",
      "oil_m3": 1787.0,
      "steam_t": 9800.0,
      "producer_well_count": 1,
      "injector_well_count": 1
    },
    {
      "date": "2026-06-01",
      "oil_m3": 1618.0,
      "steam_t": 10600.0,
      "producer_well_count": 1,
      "injector_well_count": 1
    },
    {
      "date": "2026-07-01",
      "oil_m3": 1469.0,
      "steam_t": 11500.0,
      "producer_well_count": 1,
      "injector_well_count": 1
    },
    {
      "date": "2026-08-01",
      "oil_m3": 766.0,
      "steam_t": 12400.0,
      "producer_well_count": 1,
      "injector_well_count": 1
    }
  ]
}
```

### 2. Field Specifications
| Parameter | Type | Required | Units / Format | Description |
|---|---|---|---|---|
| `state` | string (1–20 chars) | Yes | Text code | State or province (e.g., `"RJ"`, `"RN"`) |
| `basin` | string (1–200 chars)| Yes | Text name | Sedimentary basin (e.g., `"Bikaner-Nagaur"`, `"Potiguar"`) |
| `field` | string (1–200 chars)| Yes | Text name | Field identifier (e.g., `"Baghewala"`, `"CANTO DO AMARO"`) |
| `history` | array of objects | Yes | minItems: 4 | Chronological array of monthly field records |
| `history[].date` | string (date) | Yes | `YYYY-MM-DD` | Start date of the recorded monthly period |
| `history[].oil_m3` | float ($\ge 0$) | Yes | m³ / month | Observed oil production in cubic meters |
| `history[].steam_t` | float ($\ge 0$) | Yes | tonnes / month | Mass of injected steam in metric tonnes |
| `history[].producer_well_count` | integer ($\ge 0$) | No (default 0) | count | Active production wells |
| `history[].injector_well_count` | integer ($\ge 0$) | No (default 0) | count | Active steam injection wells |
| `history[].steam_reported` | boolean / null | No (default null) | boolean flag | Flag indicating steam was reported |
| `history[].water_m3` | float ($\ge 0$) | No (default 0) | m³ / month | Produced water volume |
| `history[].assoc_gas_thousand_m3` | float ($\ge 0$) | No (default 0) | 1,000 m³ | Produced associated gas |

---

## Output Response Specification

### Successful Prediction (`HTTP 200`)
```json
{
  "model_version": "css-field-month-surrogate-v1.0.0",
  "model_scope": "field-month statistical surrogate",
  "field_id": "RJ | Bikaner-Nagaur | Baghewala",
  "input_month": "2026-08-01",
  "forecast_month": "2026-09-01",
  "predicted_next_oil_m3": 2387.444994783915,
  "prediction_interval_m3": null,
  "current_steam_t": 12400.0,
  "steam_production_ratio_t_per_m3": 5.1938369374337405,
  "data_quality_warnings": [
    "Cumulative features use the supplied history. For training-compatible values, provide history beginning at 2019-04.",
    "Input is later than the training period ending 2020-09; this is temporal extrapolation."
  ]
}
```

### Derived Well Twin Metrics
- **Predicted Oil (bbl):** $\text{predicted\_next\_oil\_m3} \div 0.1589873 \approx 15,016.6\ \text{bbl}$
- **Instantaneous Oil-Steam Ratio (OSR):** $1.0 \div \text{steam\_production\_ratio\_t\_per\_m3} \approx 0.1925\ \text{m}^3/\text{t}$
- **Economic Cutoff Comparison:** Compared against the Baghewala economic floor ($0.18\ \text{m}^3/\text{t}$):
  - $\text{OSR} \ge 0.30$: `OPTIMAL`
  - $0.18 \le \text{OSR} < 0.30$: `ECONOMIC DECLINE (WATCH)`
  - $\text{OSR} < 0.18$: `CRITICAL CUTOFF BREACH`

---

## Steam Sensitivity Analysis Endpoint (`POST /v1/steam-sensitivity`)

Allows simulation of what-if candidate steam injection changes:
```json
{
  "state": "RJ",
  "basin": "Bikaner-Nagaur",
  "field": "Baghewala",
  "history": [ ... ],
  "steam_change_percentages": [-20, -10, 0, 10, 20]
}
```

Response:
```json
{
  "model_version": "css-field-month-surrogate-v1.0.0",
  "baseline_steam_t": 12400.0,
  "scenarios": [
    {
      "steam_change_percent": -20.0,
      "candidate_steam_t": 9920.0,
      "predicted_next_field_oil_m3": 2382.49,
      "steam_production_ratio_t_per_m3": 4.16
    },
    ...
  ]
}
```

---

## Unit Conversions
- $1\ \text{bbl} = 0.1589873\ \text{m}^3$
- $1\ \text{m}^3 = 6.28981\ \text{bbl}$
- Steam mass is measured directly in metric tonnes ($t$), $1:1$ with Well Twin sensor values.

---

## Scientific Limitations & Disclaimers
1. **Surrogate Dataset:** The model was trained on Brazilian ANP field-month production records, not proprietary Baghewala core/reservoir data.
2. **Field-Month Aggregation:** Predictions represent aggregate monthly patterns rather than single-well downhole thermal kinetics.
3. **Observational Association:** What-if scenarios provide observational model responses rather than guaranteed physical causality.
