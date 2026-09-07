import { FieldWell, FieldSummary, WellHealth, KpiCardData, Alert } from '../../../types';

export interface AiDataProvider {
  mode: 'demo' | 'api';
  getWell(wellId: string): Promise<FieldWell | null>;
  getAvailableWells(): Promise<FieldWell[]>;
  getHealth(wellId: string): Promise<WellHealth | null>;
  getTelemetryKpis(): Promise<KpiCardData[]>;
  getAlerts(wellId?: string): Promise<Alert[]>;
  getFieldSummary(): Promise<FieldSummary | null>;
}
