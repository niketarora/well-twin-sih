/**
 * CSS Feature Adapter for Frontend.
 * Maps existing Digital Twin CSS cycle surveillance state to the CatBoost ML surrogate input schema.
 */

import { CssCycleState } from '../types';
import {
  CSSPredictionRequest,
  CSSSensitivityRequest,
  buildCSSModelInput as mlBuildCSSModelInput,
  buildCSSSensitivityInput as mlBuildCSSSensitivityInput,
} from '../../../ml/css';

/**
 * Transforms CssCycleState into a validated CSSPredictionRequest payload.
 */
export function mapCssCycleToModelInput(
  cycleState: CssCycleState,
  options?: { state?: string; basin?: string; field?: string }
): CSSPredictionRequest {
  return mlBuildCSSModelInput(cycleState, options);
}

/**
 * Transforms CssCycleState into a CSSSensitivityRequest payload.
 */
export function mapCssCycleToSensitivityInput(
  cycleState: CssCycleState,
  percentages?: number[],
  options?: { state?: string; basin?: string; field?: string }
): CSSSensitivityRequest {
  return mlBuildCSSSensitivityInput(cycleState, percentages, options);
}
