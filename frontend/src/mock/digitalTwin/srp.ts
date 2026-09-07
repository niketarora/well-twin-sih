import { SrpTwinState } from '../../types';

export const mockSrpTwin: SrpTwinState = {
  settingDepthTVD: 428.5,
  strokeLength: 3.65,
  strokeRate: 8.4,
  barrelFillage: 84.6,
  fluidPoundInceptionDepth: 2.80,
  peakPolishedRodLoad: 88.4,
  minPolishedRodLoad: 24.6,
  rodYieldLimit: 90.0,
  standingValveIntegrity: 99.1,
  travelingValveIntegrity: 98.4,
  rodStretch: 0.14,
  gearboxTorquePct: 58.2,
  counterbalanceEffect: 54.2,
  crankAngle: 142,
  gasAnchorDiff: 0.42,
  status: 'Fillage Deficit Observed / Envelope Safe',
  confidence: 89,
  floatingRisk: 'High',
  unsettingRisk: 'Low',
};

export const mockDynoLoops = {
  current: {
    cycleNumber: 49211,
    label: 'Current Cycle (Cycle #49,211)',
    surface: [
      [0.02, 26], [0.08, 58], [0.18, 80], [0.4, 86], [1.0, 87], [1.8, 88], [2.6, 88.4],
      [3.3, 87], [3.55, 74], [3.64, 52], [3.6, 34], [3.4, 26], [2.95, 25.4], [2.8, 21.2],
      [2.62, 24.8], [2.0, 25.4], [1.2, 25.8], [0.5, 25.6], [0.12, 24.9]
    ],
    downhole: [
      [0.15, 20], [0.3, 52], [0.6, 58], [1.4, 59], [2.4, 59.5], [3.1, 58], [3.3, 44],
      [3.36, 26], [3.2, 14], [2.9, 13.4], [2.8, 9.6], [2.6, 13], [1.6, 13.6], [0.6, 13.4], [0.2, 12.8]
    ],
    fluidPoundPoint: { x: 2.80, y: 21.2, label: 'Fluid Pound @ 2.80 m downstroke' },
  },
  previous: {
    cycleNumber: 48950,
    label: 'Previous Cycle (24h ago)',
    surface: [
      [0.02, 26], [0.08, 59], [0.18, 81], [0.4, 86], [1.0, 87], [1.8, 88], [2.6, 88.2],
      [3.3, 87], [3.55, 75], [3.64, 53], [3.6, 35], [3.4, 27], [2.95, 26.2], [2.8, 24.6],
      [2.62, 26.0], [2.0, 26.2], [1.2, 26.4], [0.5, 26.2], [0.12, 25.4]
    ],
    downhole: [
      [0.15, 21], [0.3, 54], [0.6, 60], [1.4, 61], [2.4, 61.5], [3.1, 60], [3.3, 46],
      [3.36, 28], [3.2, 16], [2.9, 15.4], [2.8, 14.2], [2.6, 15], [1.6, 15.6], [0.6, 15.4], [0.2, 14.8]
    ],
    fluidPoundPoint: { x: 2.80, y: 24.6, label: 'Incipient Pound @ 2.80 m' },
  },
  baseline: {
    cycleNumber: 41200,
    label: 'Pre-Steam Ideal Baseline',
    surface: [
      [0.02, 27], [0.08, 60], [0.18, 82], [0.4, 87], [1.0, 88], [1.8, 89], [2.6, 89.2],
      [3.3, 88], [3.55, 76], [3.64, 54], [3.6, 36], [3.4, 28], [2.95, 27.4], [2.8, 27.0],
      [2.62, 27.2], [2.0, 27.4], [1.2, 27.6], [0.5, 27.4], [0.12, 26.6]
    ],
    downhole: [
      [0.15, 22], [0.3, 55], [0.6, 62], [1.4, 63], [2.4, 63.5], [3.1, 62], [3.3, 48],
      [3.36, 30], [3.2, 18], [2.9, 17.4], [2.8, 17.0], [2.6, 17.2], [1.6, 17.6], [0.6, 17.4], [0.2, 16.8]
    ],
    fluidPoundPoint: null,
  },
};

export const mockRodTaperAnalysis = [
  {
    section: 'Section 1 — Top',
    material: 'Norris 97 Special Alloy',
    diameter: '1.000 in (25.4 mm)',
    interval: '0 – 120 m',
    peakStress: 184,
    yieldLimit: 260,
    stressRatio: 70.7,
    status: 'Healthy',
    statusColor: '#3FA66B',
  },
  {
    section: 'Section 2 — Middle (Taper)',
    material: 'Norris 97 Special Alloy',
    diameter: '0.875 in (7/8" / 22.2 mm)',
    interval: '120 – 280 m',
    peakStress: 212,
    yieldLimit: 260,
    stressRatio: 81.5,
    status: 'Watch - Fatigue Critical',
    statusColor: '#D49A3A',
  },
  {
    section: 'Section 3 — Lower',
    material: 'Norris 97 Special Alloy',
    diameter: '0.750 in (3/4" / 19.1 mm)',
    interval: '280 – 410 m',
    peakStress: 198,
    yieldLimit: 260,
    stressRatio: 76.1,
    status: 'Healthy',
    statusColor: '#3FA66B',
  },
  {
    section: 'Sinker Bar Assembly',
    material: 'Heavy Alloy Tool Joint',
    diameter: '1.500 in (38.1 mm)',
    interval: '410 – 428.5 m',
    peakStress: 42,
    yieldLimit: 320,
    stressRatio: 13.1,
    status: 'Normal',
    statusColor: '#3FA66B',
  },
];
