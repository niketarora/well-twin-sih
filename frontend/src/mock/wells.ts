import { Well } from '../types';

export const mockWell: Well = {
  id: 'well-bw-017',
  code: 'BW-017',
  name: 'Well BW-017 (Baghewala)',
  fieldName: 'Baghewala Heavy Oil Field',
  basin: 'Rajasthan Basin',
  formation: 'Deep Eocene Mandhali Heavy Sand',
  location: 'Pad 03 · Sector 4 North',
  cycle: 4,
  dayInCycle: 38,
  totalCycleDays: 90,
  phase: 'Production',
  scadaStatus: 'Connected',
  lastUpdated: '14:32:08 UTC',
  isSyntheticDemo: true,
  engineerOnDuty: {
    name: 'Rajesh Verma',
    role: 'Petroleum Engineer',
    initials: 'RV',
  },
};

export const mockWellsList: Well[] = [
  mockWell,
  {
    ...mockWell,
    id: 'well-bw-018',
    code: 'BW-018',
    name: 'Well BW-018 (Baghewala)',
    cycle: 3,
    dayInCycle: 72,
    phase: 'Production',
    scadaStatus: 'Connected',
  },
  {
    ...mockWell,
    id: 'well-bw-012',
    code: 'BW-012',
    name: 'Well BW-012 (Baghewala)',
    cycle: 5,
    dayInCycle: 12,
    phase: 'Soak',
    scadaStatus: 'Connected',
  },
];
