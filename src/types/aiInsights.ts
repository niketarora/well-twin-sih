export interface CausalChainStep {
  stepNumber: number;
  title: string;
  description: string;
  metricChange: string;
  progressPct: number;
  status: 'Critical' | 'Warning' | 'Info' | 'Nominal';
}

export interface FeatureImportance {
  featureName: string;
  importancePct: number;
  impactDirection: 'Negative' | 'Positive';
  subsystem: string;
}

export interface ForecastHorizonData {
  id: '24h' | '72h' | '7d' | '90d';
  label: string;
  forecastOilRate: number; // BOPD
  upperP10: number;
  lowerP90: number;
  oilDeltaPct: number;
  bhtForecast: number; // °C
  bhtDelta: number;
  coolingRate: number; // °C/h
  liftMotorPower: number; // kW
  motorPowerDelta: number;
  oilSteamRatio: number;
  economicCutoffOSR: number;
}

export interface AiInsight {
  id: string;
  title: string;
  confidence: number;
  severity: 'critical' | 'warning' | 'info';
  summary: string;
  whatHappened: string;
  evidence: { label: string; value: string; delta?: string }[];
  likelyCause: string;
  recommendedAction: string;
  causalChain: CausalChainStep[];
  featureImportance: FeatureImportance[];
  horizons: Record<'24h' | '72h' | '7d' | '90d', ForecastHorizonData>;
}
