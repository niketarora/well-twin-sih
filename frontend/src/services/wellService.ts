import { Well, WellHealth } from '../types';
import { mockWell, mockWellsList, mockWellHealth } from '../mock';
import { apiFetch } from './apiClient';

export interface IWellService {
  getCurrentWell(): Promise<Well>;
  getWells(): Promise<Well[]>;
  getWellHealth(wellId: string): Promise<WellHealth>;
}

export class HybridWellService implements IWellService {
  async getCurrentWell(): Promise<Well> {
    try {
      const data = await apiFetch<any>('/wells/well-bw-017');
      return {
        ...mockWell,
        id: data.id,
        name: data.name,
        code: data.well_code,
        fieldName: data.field_name,
        basin: data.basin,
        formation: data.formation,
        cycle: data.current_cycle,
        phase: (data.operating_phase as any) || 'Production',
        scadaStatus: 'Connected',
      };
    } catch {
      return { ...mockWell };
    }
  }

  async getWells(): Promise<Well[]> {
    try {
      const list = await apiFetch<any[]>('/wells');
      return list.map(w => ({
        ...mockWell,
        id: w.id,
        name: w.name,
        code: w.well_code,
        fieldName: w.field_name,
        basin: w.basin,
        formation: w.formation,
        cycle: w.current_cycle,
        phase: (w.operating_phase as any) || 'Production',
        scadaStatus: 'Connected',
      }));
    } catch {
      return [...mockWellsList];
    }
  }

  async getWellHealth(wellId: string): Promise<WellHealth> {
    try {
      const h = await apiFetch<any>(`/wells/${wellId}/health`);
      return {
        ...mockWellHealth,
        score: h.overall_score,
        status: (h.overall_status === 'Good' ? 'Optimal' : h.overall_status === 'Warning' ? 'Critical intervention' : 'Attention advised'),
        dominantConcern: h.dominant_concern,
        subsystems: mockWellHealth.subsystems.map(s => {
          if (s.id === 'reservoir' && h.subsystems?.reservoir) {
            return { ...s, score: h.subsystems.reservoir.score, dominantFactor: h.subsystems.reservoir.dominant_concern };
          }
          if (s.id === 'wellbore' && h.subsystems?.wellbore) {
            return { ...s, score: h.subsystems.wellbore.score, dominantFactor: h.subsystems.wellbore.dominant_concern };
          }
          if (s.id === 'lift' && h.subsystems?.srp) {
            return { ...s, score: h.subsystems.srp.score, dominantFactor: h.subsystems.srp.dominant_concern };
          }
          if (s.id === 'surface' && h.subsystems?.surface) {
            return { ...s, score: h.subsystems.surface.score, dominantFactor: h.subsystems.surface.dominant_concern };
          }
          return s;
        })
      };
    } catch {
      return { ...mockWellHealth };
    }
  }
}

export const wellService: IWellService = new HybridWellService();
