export interface ReservoirTwinState {
  tvdInterval: string;
  formationName: string;
  thermalZone: string;
  status: string;
  temperature: number; // °C
  temperatureDelta: number; // °C / 24h
  pressure: number; // bar
  viscosity: number; // cP
  coldBaselineViscosity: number; // cP
  steamChamberRadius: number; // m
  sweptVolume: number; // m3
  effectivePermeability: number; // mD
  thermalBoundaryEnthalpy: number; // kJ/kg
  energyRetainedPct: number; // %
  overburdenBleedPct: number; // %
  coolingRate: number; // °C/h
  confidence: number; // %
}

export interface WellboreTwinState {
  casingSpec: string;
  completionType: string;
  status: string;
  flowRegime: string;
  thermalGradient: number; // °C/m
  hydrostaticHead: number; // bar
  fluidDensity: number; // kg/m3
  gasVoidFractionPct: number; // %
  sandInfluxPct: number; // %
  pumpIntakePressure: number; // bar
  pumpIntakeTemperature: number; // °C
  pumpIntakeViscosity: number; // cP
  fluidLoading: string;
  confidence: number; // %
}

export interface DynamometerPoint {
  position: number; // m (0 to stroke length)
  load: number; // kN
}

export interface SrpTwinState {
  settingDepthTVD: number; // m
  strokeLength: number; // m
  strokeRate: number; // SPM
  barrelFillage: number; // %
  fluidPoundInceptionDepth?: number; // m
  peakPolishedRodLoad: number; // kN
  minPolishedRodLoad: number; // kN
  rodYieldLimit: number; // kN
  standingValveIntegrity: number; // %
  travelingValveIntegrity: number; // %
  rodStretch: number; // m
  gearboxTorquePct: number; // %
  counterbalanceEffect: number; // kN
  crankAngle: number; // degrees
  gasAnchorDiff: number; // MPa
  status: string;
  confidence: number; // %
  floatingRisk: 'Low' | 'Moderate' | 'High';
  unsettingRisk: 'Low' | 'Moderate' | 'High';
}

export interface SurfaceProductionTwinState {
  grossLiquidRate: number; // BFPD
  netOilRateActual: number; // BOPD
  netOilRatePredicted: number; // BOPD
  productionGap: number; // BOPD
  deviationPct: number; // %
  confidenceBandP10: number; // BOPD
  confidenceBandP90: number; // BOPD
  waterCut: number; // %
  gasOilRatio: number; // Sm3/m3
  instantaneousOSR: number; // m3/t
  cumulativeOilCycle: number; // bbl
  cycleTargetOil: number; // bbl
  status: string;
  confidence: number; // %
}

export interface CouplingTransfer {
  fromTwin: 'Twin 1: Reservoir' | 'Twin 2: Wellbore' | 'Twin 3: SRP';
  toTwin: 'Twin 2: Wellbore' | 'Twin 3: SRP' | 'Twin 4: Surface';
  variables: {
    name: string;
    value: string;
    unit: string;
    status: 'Nominal' | 'Alert' | 'Shift';
  }[];
}

export interface ModelValidationItem {
  twinId: 'reservoir' | 'wellbore' | 'srp' | 'surface';
  twinName: string;
  keyMetric: string;
  predictedValue: string;
  actualValue: string;
  deviation: string;
  deviationPct: number;
  confidence: number;
  status: 'Agreement' | 'Attention' | 'Drift Alert';
}

export interface DigitalTwinMeshState {
  pdeConvergenceL2: string;
  pinnVsScadaDelta: string;
  overburdenHeatBleed: string;
  meshIteration: string;
  boundaryConditions: {
    name: string;
    value: string;
  }[];
  recentSolverLogs: {
    timestamp: string;
    message: string;
  }[];
}
