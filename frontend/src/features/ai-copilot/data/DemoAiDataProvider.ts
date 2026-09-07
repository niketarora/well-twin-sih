import { AiDataProvider } from './AiDataProvider';
import { FieldWell, FieldSummary, WellHealth, KpiCardData, Alert } from '../../../types';
import { fieldService, wellService, telemetryService, alertService } from '../../../services';

export class DemoAiDataProvider implements AiDataProvider {
  readonly mode = 'demo' as const;

  async getWell(wellId: string): Promise<FieldWell | null> {
    const well = await fieldService.getWellById(wellId);
    return well || null;
  }

  async getAvailableWells(): Promise<FieldWell[]> {
    return fieldService.getFieldWells();
  }

  async getHealth(wellId: string): Promise<WellHealth | null> {
    return wellService.getWellHealth(wellId);
  }

  async getTelemetryKpis(): Promise<KpiCardData[]> {
    return telemetryService.getOverviewKpis();
  }

  async getAlerts(wellId?: string): Promise<Alert[]> {
    const alerts = await alertService.getAlerts();
    if (!wellId) return alerts;
    return alerts;
  }

  async getFieldSummary(): Promise<FieldSummary | null> {
    return fieldService.getFieldSummary();
  }
}
