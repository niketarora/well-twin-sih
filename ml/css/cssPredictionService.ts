/**
 * High-level CSS Prediction Service.
 * Coordinates feature adapter extraction, caching, and response normalization.
 */

import { CSS_ML_CONFIG } from './config';
import {
  RawCSSPredictionResponse,
  CSSNormalizedPrediction,
  RawCSSSensitivityResponse,
  CSSEconomicStatus,
} from './types';
import {
  buildCSSModelInput,
  buildCSSSensitivityInput,
  GenericCssCycleState,
} from './featureBuilder';
import { cssApi } from './cssApi';

export class CssPredictionService {
  private cache = new Map<string, { timestamp: number; data: CSSNormalizedPrediction }>();
  private readonly CACHE_TTL_MS = 60 * 1000; // 1 minute cache

  /**
   * Normalizes raw API response into domain-specific Well Twin metrics.
   */
  public normalizePrediction(raw: RawCSSPredictionResponse): CSSNormalizedPrediction {
    const oilM3 = raw.predicted_next_oil_m3 || 0;
    const oilBbl = oilM3 * CSS_ML_CONFIG.M3_TO_BARRELS;
    const steamIntensity = raw.steam_production_ratio_t_per_m3 || 0;

    // Instantaneous OSR = 1 / steam-production-ratio (m³ bitumen per tonne steam)
    const forecastOsr = steamIntensity > 0 ? 1 / steamIntensity : 0;

    let economicStatus: CSSEconomicStatus = 'OPTIMAL';
    if (forecastOsr < CSS_ML_CONFIG.ECONOMIC_CUTOFF_OSR) {
      economicStatus = 'CUTOFF_WARNING';
    } else if (forecastOsr < CSS_ML_CONFIG.OPTIMAL_OSR_THRESHOLD) {
      economicStatus = 'WATCH';
    }

    return {
      predicted_oil_m3: parseFloat(oilM3.toFixed(1)),
      predicted_oil_bbl: parseFloat(oilBbl.toFixed(0)),
      forecast_osr: parseFloat(forecastOsr.toFixed(3)),
      steam_intensity: parseFloat(steamIntensity.toFixed(2)),
      baseline_steam_t: raw.current_steam_t,
      economic_status: economicStatus,
      economic_floor_osr: CSS_ML_CONFIG.ECONOMIC_CUTOFF_OSR,
      model_version: raw.model_version,
      forecast_month: raw.forecast_month,
      warnings: raw.data_quality_warnings || [],
      is_fallback: raw.model_scope?.includes('fallback') || false,
      raw_response: raw,
    };
  }

  /**
   * Orchestrates feature building, API call, and normalization with smart in-memory caching.
   */
  public async getPredictionForCycle(
    cycleData: GenericCssCycleState,
    options: { forceRefresh?: boolean; signal?: AbortSignal } = {}
  ): Promise<CSSNormalizedPrediction> {
    const cacheKey = `cycle-${cycleData.currentCycle}-${cycleData.cumulativeOilThisCycle || 0}-${cycleData.history?.length || 0}`;

    if (!options.forceRefresh) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
        return cached.data;
      }
    }

    const input = buildCSSModelInput(cycleData);
    const raw = await cssApi.predictCSS(input, { signal: options.signal });
    const normalized = this.normalizePrediction(raw);

    this.cache.set(cacheKey, { timestamp: Date.now(), data: normalized });
    return normalized;
  }

  /**
   * Evaluates what-if sensitivity analysis for candidate steam adjustments.
   */
  public async getSensitivityForCycle(
    cycleData: GenericCssCycleState,
    percentages: number[] = [-20, -10, 0, 10, 20],
    options: { signal?: AbortSignal } = {}
  ): Promise<RawCSSSensitivityResponse> {
    const input = buildCSSSensitivityInput(cycleData, percentages);
    return await cssApi.evaluateSensitivity(input, { signal: options.signal });
  }
}

export const cssPredictionService = new CssPredictionService();
