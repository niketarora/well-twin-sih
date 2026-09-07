import { WellboreTwinState } from '../../types';

export const mockWellboreTwin: WellboreTwinState = {
  casingSpec: '7" OD Casing • 26 lb/ft L-80',
  completionType: 'Slotted Sand Control Screen / Perforated Liner',
  status: 'Stable Fluid Inflow / Zero Gas Lock',
  flowRegime: 'Slug / Bubbly Emulsion',
  thermalGradient: 0.12,
  hydrostaticHead: 31.2,
  fluidDensity: 982,
  gasVoidFractionPct: 14.2,
  sandInfluxPct: 0.08,
  pumpIntakePressure: 38.2,
  pumpIntakeTemperature: 184.2,
  pumpIntakeViscosity: 92.0,
  fluidLoading: 'Moderate-High Viscous Drawdown',
  confidence: 94,
};

export const mockWellboreDepthProfile = [
  { depth: 0, label: 'Surface Wellhead (WHP)', pressure: 18.4, temperature: 82.4, item: 'Christmas Tree' },
  { depth: 150, label: 'Upper Casing Annulus', pressure: 22.1, temperature: 104.2, item: '7" Casing String' },
  { depth: 300, label: 'Tubing Intermediate', pressure: 28.5, temperature: 138.6, item: '3.5" Tubing' },
  { depth: 428.5, label: 'Pump Intake Seating TVD', pressure: 38.2, temperature: 184.2, item: 'SRP Downhole Barrel & Gas Anchor', isIntake: true },
  { depth: 650, label: 'Lower Tubing Tail', pressure: 40.1, temperature: 196.4, item: 'Mud Anchor' },
  { depth: 950, label: 'Top Perforations Liner', pressure: 41.8, temperature: 208.5, item: 'Slotted Screen 0.012"' },
  { depth: 1280, label: 'Perforation Midpoint TVD', pressure: 42.6, temperature: 214.8, item: 'Reservoir Inflow Sand', isPerfs: true },
];
