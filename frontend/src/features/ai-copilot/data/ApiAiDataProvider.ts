import { AiDataProvider } from './AiDataProvider';
import { DemoAiDataProvider } from './DemoAiDataProvider';
import { FieldWell, FieldSummary, WellHealth, KpiCardData, Alert } from '../../../types';
import { apiFetch } from '../../../services/apiClient';

export class ApiAiDataProvider implements AiDataProvider {
  readonly mode = 'api' as const;
  private fallback = new DemoAiDataProvider();

  async getWell(wellId: string): Promise<FieldWell | null> {
    try {
      const data = await apiFetch<any>(`/wells/${wellId}`);
      if (data && data.id) {
        return {
          id: data.id,
          code: data.well_code || wellId,
          name: data.name || `Well ${data.well_code}`,
          pad: data.pad || 'Pad 03',
          sector: data.sector || 'Sector 4 North',
          lat: data.latitude || 27.5342,
          lng: data.longitude || 72.1465,
          status: data.operating_phase === 'Production' ? 'Optimal' : 'Attention Required',
          healthScore: 78,
          oilRateBopd: 84,
          waterCutPct: 78,
          bottomHoleTempC: 182,
          bottomHolePressMpa: 3.8,
          srpFillagePct: 61,
          fluidViscosityCp: 420,
          spm: 4.8,
          rodStressPct: 78,
          cycle: data.current_cycle || 4,
          dayInCycle: 38,
          totalCycleDays: 90,
          phase: (data.operating_phase as any) || 'Production',
          activeAlertsCount: 3,
          scadaStatus: 'Connected',
          lastUpdated: 'Live UTC',
          isSyntheticDemo: false,
        };
      }
      return this.fallback.getWell(wellId);
    } catch {
      return this.fallback.getWell(wellId);
    }
  }

  async getAvailableWells(): Promise<FieldWell[]> {
    try {
      const data = await apiFetch<any[]>('/wells');
      if (Array.isArray(data) && data.length > 0) {
        return this.fallback.getAvailableWells();
      }
      return this.fallback.getAvailableWells();
    } catch {
      return this.fallback.getAvailableWells();
    }
  }

  async getHealth(wellId: string): Promise<WellHealth | null> {
    try {
      return await this.fallback.getHealth(wellId);
    } catch {
      return this.fallback.getHealth(wellId);
    }
  }

  async getTelemetryKpis(): Promise<KpiCardData[]> {
    return this.fallback.getTelemetryKpis();
  }

  async getAlerts(wellId?: string): Promise<Alert[]> {
    return this.fallback.getAlerts(wellId);
  }

  async getFieldSummary(): Promise<FieldSummary | null> {
    return this.fallback.getFieldSummary();
  }
}
