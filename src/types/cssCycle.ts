export interface CssPhase {
  id: 'injection' | 'soak' | 'production' | 'cooling';
  number: string;
  name: string;
  state: string;
  severity: 'stable' | 'watch' | 'critical';
  summary: string;
  parameters: {
    label: string;
    value: string;
    unit: string;
  }[];
}

export interface HistoricalCycle {
  cycle: string;
  steamInjectedTonnes: number;
  cumulativeOilBbl: number;
  osr: number;
  peakRateBOPD: number;
  durationDays: number;
  status: 'Complete' | 'Active';
}

export interface CssCycleState {
  currentCycle: number;
  currentPhase: 'injection' | 'soak' | 'production' | 'cooling';
  dayInPhase: number;
  totalPhaseDays: number;
  cumulativeSteamInjected: number; // tonnes
  targetCompliancePct: number; // %
  meanInjectionPressure: number; // bar
  fractureMarginBar: number; // bar
  cumulativeOilThisCycle: number; // bbl
  cycleTargetOilBbl: number; // bbl
  instantaneousOSR: number; // m3/tonne
  economicCutoffOSR: number; // m3/tonne
  estimatedDaysToCutoff: number;
  phases: CssPhase[];
  history: HistoricalCycle[];
}
