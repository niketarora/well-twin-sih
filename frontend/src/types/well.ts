export interface Well {
  id: string;
  code: string;
  name: string;
  fieldName: string;
  basin: string;
  formation: string;
  location: string;
  cycle: number;
  dayInCycle: number;
  totalCycleDays: number;
  phase: 'Injection' | 'Soak' | 'Production' | 'Cooling';
  scadaStatus: 'Connected' | 'Intermittent' | 'Disconnected';
  lastUpdated: string;
  isSyntheticDemo: boolean;
  engineerOnDuty: {
    name: string;
    role: string;
    initials: string;
  };
}
