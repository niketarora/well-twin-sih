import { create } from 'zustand';
import { Recommendation } from '../types';
import { recommendationService } from '../services';

interface RecommendationStoreState {
  recommendations: Recommendation[];
  isLoading: boolean;
  loadRecommendations: () => Promise<void>;
  updateStatus: (id: string, status: Recommendation['status']) => Promise<void>;
}

export const useRecommendationStore = create<RecommendationStoreState>((set) => ({
  recommendations: [],
  isLoading: false,

  loadRecommendations: async () => {
    set({ isLoading: true });
    try {
      const data = await recommendationService.getRecommendations();
      set({ recommendations: data, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  updateStatus: async (id, status) => {
    const updated = await recommendationService.updateStatus(id, status);
    set((state) => ({
      recommendations: state.recommendations.map((r) => (r.id === id ? updated : r)),
    }));
  },
}));
