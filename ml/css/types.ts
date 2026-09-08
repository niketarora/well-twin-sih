/**
 * TypeScript Type Definitions for CSS ML Field-Month Surrogate Model.
 * Mirrors the exact OpenAPI schema exposed by https://cssmodel.onrender.com/
 */

export interface MonthlyFieldRecord {
  date: string; // "YYYY-MM-DD"
  oil_m3: number;
  steam_t: number;
  steam_reported?: boolean | null;
  water_m3?: number;
  assoc_gas_thousand_m3?: number;
  nonassoc_gas_thousand_m3?: number;
  secondary_water_injection_m3?: number;
  wastewater_injection_m3?: number;
  gas_injection_thousand_m3?: number;
  co2_injection_thousand_m3?: number;
  nitrogen_injection_thousand_m3?: number;
  injector_well_count?: number;
  producer_well_count?: number;
  negative_water_count?: number;
}

export interface CSSPredictionRequest {
  state: string;
  basin: string;
  field: string;
  history: MonthlyFieldRecord[];
}

export interface CSSSensitivityRequest {
  state: string;
  basin: string;
  field: string;
  history: MonthlyFieldRecord[];
  steam_change_percentages?: number[];
}

export interface RawCSSPredictionResponse {
  model_version: string;
  model_scope: string;
  field_id: string;
  input_month: string;
  forecast_month: string;
  predicted_next_oil_m3: number;
  prediction_interval_m3: [number, number] | null;
  current_steam_t: number;
  steam_production_ratio_t_per_m3: number;
  data_quality_warnings: string[];
}

export interface SensitivityScenario {
  steam_change_percent: number;
  candidate_steam_t: number;
  predicted_next_field_oil_m3: number;
  steam_production_ratio_t_per_m3: number;
}

export interface RawCSSSensitivityResponse {
  model_version: string;
  model_scope: string;
  analysis_type: string;
  field_id: string;
  input_month: string;
  forecast_month: string;
  baseline_steam_t: number;
  scenarios: SensitivityScenario[];
  data_quality_warnings: string[];
}

export type CSSEconomicStatus = 'OPTIMAL' | 'WATCH' | 'CUTOFF_WARNING';

export interface CSSNormalizedPrediction {
  predicted_oil_m3: number;
  predicted_oil_bbl: number;
  forecast_osr: number; // m³/t (thermodynamic recovery efficiency)
  steam_intensity: number; // t/m³ (steam required per m³ bitumen)
  baseline_steam_t: number;
  economic_status: CSSEconomicStatus;
  economic_floor_osr: number; // 0.18
  model_version: string;
  forecast_month: string;
  warnings: string[];
  is_fallback?: boolean;
  raw_response?: RawCSSPredictionResponse;
}

export interface CSSModelInfoResponse {
  model_version: string;
  scope: string;
  input_feature_count: number;
  features: string[];
  output: string;
  test_metrics: {
    MAE_m3: number;
    RMSE_m3: number;
    R2: number;
  };
  limitations: string[];
}
