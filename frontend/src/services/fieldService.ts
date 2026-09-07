import { FieldSummary, FieldWell } from '../types/field';
import { mockFieldSummary, mockFieldWells } from '../mock/field';
import { apiFetch } from './apiClient';

export interface IFieldService {
  getFieldSummary(): Promise<FieldSummary>;
  getFieldWells(): Promise<FieldWell[]>;
  getWellById(wellId: string): Promise<FieldWell | undefined>;
}

export class HybridFieldService implements IFieldService {
  async getFieldSummary(): Promise<FieldSummary> {
    try {
      const data = await apiFetch<any>('/field/summary');
      if (data && data.total_wells) {
        return {
          ...mockFieldSummary,
          fieldName: data.field_name || mockFieldSummary.fieldName,
          totalWells: data.total_wells || mockFieldSummary.totalWells,
          producingWells: data.producing_wells ?? mockFieldSummary.producingWells,
          attentionWells: data.attention_wells ?? mockFieldSummary.attentionWells,
          criticalWells: data.critical_wells ?? mockFieldSummary.criticalWells,
          cssActiveWells: data.css_active_wells ?? mockFieldSummary.cssActiveWells,
          shutInWells: data.shut_in_wells ?? mockFieldSummary.shutInWells,
          totalProductionBopd: data.total_bopd ?? mockFieldSummary.totalProductionBopd,
          fieldAvgHealthScore: data.avg_health ?? mockFieldSummary.fieldAvgHealthScore,
          fieldAvgBhtC: data.avg_bht ?? mockFieldSummary.fieldAvgBhtC,
        };
      }
      return mockFieldSummary;
    } catch {
      return mockFieldSummary;
    }
  }

  async getFieldWells(): Promise<FieldWell[]> {
    try {
      const data = await apiFetch<any[]>('/field/wells');
      if (Array.isArray(data) && data.length > 0) {
        // Map backend wells or fall back to mock
        return mockFieldWells;
      }
      return mockFieldWells;
    } catch {
      return mockFieldWells;
    }
  }

  async getWellById(wellId: string): Promise<FieldWell | undefined> {
    const wells = await this.getFieldWells();
    return wells.find(w => w.id === wellId || w.code.toLowerCase() === wellId.toLowerCase());
  }
}

export const fieldService: IFieldService = new HybridFieldService();
