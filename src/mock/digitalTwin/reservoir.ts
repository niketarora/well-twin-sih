import { ReservoirTwinState } from '../../types';

export const mockReservoirTwin: ReservoirTwinState = {
  tvdInterval: 'TVD 1,142 m – 1,280 m',
  formationName: 'Eocene Mandhali Heavy Sand',
  thermalZone: 'Cyclic Steam Injection Zone',
  status: 'Thermally Charged / CSS Cycle 4 Soak Decay',
  temperature: 214.8,
  temperatureDelta: -0.4,
  pressure: 42.6,
  viscosity: 84.0,
  coldBaselineViscosity: 8500.0,
  steamChamberRadius: 18.4,
  sweptVolume: 11400,
  effectivePermeability: 410,
  thermalBoundaryEnthalpy: 2480,
  energyRetainedPct: 68.4,
  overburdenBleedPct: 14.8,
  coolingRate: -0.04,
  confidence: 96,
};

export const mockViscosityVsTempCurve = [
  { temp: 50, viscosity: 8500, label: 'Cold Baseline' },
  { temp: 90, viscosity: 1200 },
  { temp: 130, viscosity: 340 },
  { temp: 170, viscosity: 142 },
  { temp: 200, viscosity: 96 },
  { temp: 214.8, viscosity: 84, current: true, label: 'Current BHT 214.8°C (84 cP)' },
  { temp: 230, viscosity: 72 },
  { temp: 250, viscosity: 54, label: 'Post-Soak Peak' },
];

export const mockReservoirThermalTrajectory = [
  { day: 0, bht: 250.0, coolingRate: -0.01, chamberRadius: 18.4 },
  { day: 7, bht: 245.0, coolingRate: -0.03, chamberRadius: 18.4 },
  { day: 14, bht: 238.2, coolingRate: -0.04, chamberRadius: 18.4 },
  { day: 21, bht: 228.6, coolingRate: -0.04, chamberRadius: 18.4 },
  { day: 28, bht: 221.4, coolingRate: -0.04, chamberRadius: 18.4 },
  { day: 35, bht: 216.0, coolingRate: -0.04, chamberRadius: 18.4 },
  { day: 38, bht: 214.8, coolingRate: -0.04, chamberRadius: 18.4, current: true },
  { day: 50, bht: 206.5, coolingRate: -0.04, chamberRadius: 18.2, forecast: true },
  { day: 70, bht: 194.0, coolingRate: -0.04, chamberRadius: 17.9, forecast: true },
  { day: 90, bht: 184.0, coolingRate: -0.038, chamberRadius: 17.5, forecast: true, cutoff: true },
];
