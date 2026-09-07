import { SurfaceProductionTwinState } from '../../types';

export const mockSurfaceProductionTwin: SurfaceProductionTwinState = {
  grossLiquidRate: 320.0,
  netOilRateActual: 184.2,
  netOilRatePredicted: 198.0,
  productionGap: 13.8,
  deviationPct: -7.0,
  confidenceBandP10: 204.5,
  confidenceBandP90: 191.5,
  waterCut: 42.4,
  gasOilRatio: 14.8,
  instantaneousOSR: 0.39,
  cumulativeOilCycle: 4820,
  cycleTargetOil: 9500,
  status: 'Reconciled Separator Skid 03 / Gap -7.0%',
  confidence: 91,
};

export const mockPredictedVsActualHistory = [
  { day: 'Day 20', actual: 210.4, predicted: 212.0, p10: 216.0, p90: 208.0, gap: 1.6 },
  { day: 'Day 23', actual: 203.8, predicted: 206.5, p10: 210.0, p90: 202.0, gap: 2.7 },
  { day: 'Day 26', actual: 198.5, predicted: 202.0, p10: 206.0, p90: 197.5, gap: 3.5 },
  { day: 'Day 29', actual: 194.0, predicted: 199.5, p10: 204.0, p90: 194.5, gap: 5.5 },
  { day: 'Day 32', actual: 189.6, predicted: 198.8, p10: 203.5, p90: 193.8, gap: 9.2 },
  { day: 'Day 35', actual: 186.2, predicted: 198.2, p10: 203.0, p90: 192.5, gap: 12.0 },
  { day: 'Day 38 (Today)', actual: 184.2, predicted: 198.0, p10: 204.5, p90: 191.5, gap: 13.8, isCurrent: true },
  { day: 'Day 42', predicted: 196.2, p10: 203.0, p90: 189.0, isForecast: true },
  { day: 'Day 46', predicted: 193.5, p10: 201.5, p90: 185.0, isForecast: true },
  { day: 'Day 50', predicted: 189.0, p10: 198.0, p90: 180.0, isForecast: true },
];

export const mockProductionWaterfall = [
  { step: 'Reservoir Inflow Potential', value: 205.0, type: 'base' },
  { step: 'Thermal Cooling Effect', value: -4.2, type: 'loss' },
  { step: 'Viscous Wellbore Friction', value: -2.8, type: 'loss' },
  { step: 'SRP Mechanical Capacity', value: 198.0, type: 'subtotal' },
  { step: 'Downstroke Fluid Pound Gap', value: -9.6, type: 'loss' },
  { step: 'Traveling Valve Gas Slip', value: -4.2, type: 'loss' },
  { step: 'Reconciled Net Oil Delivered', value: 184.2, type: 'final' },
];
