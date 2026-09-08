/**
 * SRP Feature Adapter.
 * Bridges existing Digital Twin SRP state / SCADA telemetry to the SRP Autoencoder ML model inputs.
 */
import { SrpTwinState } from '../types';
import { SRPPredictionInput } from '../services/srpApi';

/**
 * Calculates polygon area of closed dynamometer loop using the Shoelace formula.
 * @param points Array of [displacement_m, load_kN]
 * @returns Area in m*kN (kJ)
 */
export function calculateDynoShoelaceArea(points: number[][]): number {
  if (!points || points.length < 3) return 0;
  const n = points.length;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % n];
    sum += x1 * y2 - x2 * y1;
  }
  return 0.5 * Math.abs(sum);
}

/**
 * Extracts normalized ML features from SrpTwinState and active dynamometer card loop.
 */
export function mapSrpTwinToModelInput(
  twin: SrpTwinState,
  dynoSurfacePoints?: number[][],
  wellId: string = 'well-bw-017'
): SRPPredictionInput {
  // Derive dyno card area if loop points are present
  const dynoArea = dynoSurfacePoints && dynoSurfacePoints.length >= 3
    ? calculateDynoShoelaceArea(dynoSurfacePoints)
    : undefined;

  return {
    spm: twin.strokeRate,
    pump_fillage: twin.barrelFillage,
    min_rod_weight: twin.minPolishedRodLoad,
    max_rod_weight: twin.peakPolishedRodLoad,
    dynamometer_area: dynoArea,
    dyno_surface_points: dynoSurfacePoints,
    well_id: wellId,
    is_metric: true, // indicates kN and m
  };
}
