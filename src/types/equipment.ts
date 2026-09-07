export interface EquipmentSection {
  id: string;
  name: string;
  category: 'Surface' | 'Wellhead' | 'Downhole' | 'Separation';
  model: string;
  manufacturer: string;
  installedDate: string;
  healthScore: number;
  status: 'Operational' | 'Degraded' | 'Attention' | 'Offline';
  operatingHours: number;
  nextInspectionDays: number;
  parameters: {
    label: string;
    value: string;
    unit: string;
    status: 'Normal' | 'Watch' | 'Critical';
  }[];
  activeAlertsCount: number;
}
