import { ModelValidationItem, DigitalTwinMeshState } from '../../types';

export const mockOverallModelAgreement = 93; // %

export const mockModelValidationItems: ModelValidationItem[] = [
  {
    twinId: 'reservoir',
    twinName: 'Twin 1: Reservoir / Thermal',
    keyMetric: 'Reservoir BHT & Enthalpy',
    predictedValue: '215.2 °C',
    actualValue: '214.8 °C',
    deviation: '-0.4 °C',
    deviationPct: -0.19,
    confidence: 96,
    status: 'Agreement',
  },
  {
    twinId: 'wellbore',
    twinName: 'Twin 2: Wellbore Hydraulics',
    keyMetric: 'Pump Intake Pressure & Temp',
    predictedValue: '38.8 bar',
    actualValue: '38.2 bar',
    deviation: '-0.6 bar',
    deviationPct: -1.55,
    confidence: 94,
    status: 'Agreement',
  },
  {
    twinId: 'srp',
    twinName: 'Twin 3: Sucker Rod Pump',
    keyMetric: 'Volumetric Pump Fillage',
    predictedValue: '91.5 %',
    actualValue: '84.6 %',
    deviation: '-6.9 pt',
    deviationPct: -7.54,
    confidence: 89,
    status: 'Attention',
  },
  {
    twinId: 'surface',
    twinName: 'Twin 4: Surface Production',
    keyMetric: 'Reconciled Net Oil Rate',
    predictedValue: '198.0 BOPD',
    actualValue: '184.2 BOPD',
    deviation: '-13.8 BOPD',
    deviationPct: -7.0,
    confidence: 91,
    status: 'Attention',
  },
];

export const mockDigitalTwinMeshState: DigitalTwinMeshState = {
  pdeConvergenceL2: '1.4e−5 (tolerance 1.0e−4)',
  pinnVsScadaDelta: '+0.4 % (sensor boundary agreement)',
  overburdenHeatBleed: '14.8 % conductive flux to shale caprock',
  meshIteration: '#14,921 40-node finite difference grid',
  boundaryConditions: [
    { name: 'P_BOUNDARY (Reservoir)', value: '42.60 bar' },
    { name: 'T_BOUNDARY (Reservoir)', value: '214.80 °C' },
    { name: 'P_MANIFOLD (Separator)', value: '12.10 bar' },
    { name: 'P_ANNULUS (Wellhead Casing)', value: '4.20 bar' },
    { name: 'P_PUMP_INTAKE (Hydraulic)', value: '38.20 bar' },
    { name: 'T_PUMP_INTAKE (Hydraulic)', value: '184.20 °C' },
  ],
  recentSolverLogs: [
    { timestamp: '14:32:00 UTC', message: 'Reservoir P-T boundary state vector loaded into hydro-thermal solver.' },
    { timestamp: '14:32:04 UTC', message: 'Beggs-Brill multiphase pipe hydraulics converged in 4 iterations (L2 residual = 1.4e-5).' },
    { timestamp: '14:32:06 UTC', message: 'Gibbs 1D wave equation solved along 3-tier Norris 97 tapered rod string.' },
    { timestamp: '14:32:08 UTC', message: 'Coupled state vector reconciled and committed to SCADA digital-twin bus.' },
  ],
};
