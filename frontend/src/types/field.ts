export type WellOperationalStatus = 'Optimal' | 'Attention Required' | 'Critical' | 'CSS-Active' | 'Shut-In';

export type MapLayerType = 'health' | 'production' | 'temperature' | 'fillage' | 'cssCycle';

export type WellStatusFilter = 'all' | 'producing' | 'attention' | 'critical' | 'css' | 'shutin';

export interface FieldWell {
  id: string;
  code: string;
  name: string;
  pad: string;
  sector: string;
  lat: number;
  lng: number;
  status: WellOperationalStatus;
  statusReason?: string;
  healthScore: number;
  oilRateBopd: number;
  waterCutPct: number;
  bottomHoleTempC: number;
  bottomHolePressMpa: number;
  srpFillagePct: number;
  fluidViscosityCp: number;
  spm: number;
  rodStressPct: number;
  cycle: number;
  dayInCycle: number;
  totalCycleDays: number;
  phase: 'Injection' | 'Soak' | 'Production' | 'Cooling' | 'Workover';
  activeAlertsCount: number;
  topAlert?: string;
  scadaStatus: 'Connected' | 'Intermittent' | 'Disconnected';
  lastUpdated: string;
  isSyntheticDemo: boolean;
}

export interface FieldSummary {
  fieldName: string;
  fieldCode: string;
  basin: string;
  formation: string;
  reservoirType: string;
  driveMechanism: string;
  totalWells: number;
  producingWells: number;
  attentionWells: number;
  criticalWells: number;
  cssActiveWells: number;
  shutInWells: number;
  totalProductionBopd: number;
  fieldAvgHealthScore: number;
  fieldAvgBhtC: number;
  lastUpdated: string;
  coordinates: {
    lat: number;
    lng: number;
    zoom: number;
  };
}
