import { Recommendation } from '../types';
import { mockRecommendations } from '../mock';

export interface IRecommendationService {
  getRecommendations(): Promise<Recommendation[]>;
  updateStatus(id: string, status: Recommendation['status']): Promise<Recommendation>;
}

export class MockRecommendationService implements IRecommendationService {
  private recs: Recommendation[] = [...mockRecommendations];

  async getRecommendations(): Promise<Recommendation[]> {
    return Promise.resolve([...this.recs]);
  }

  async updateStatus(id: string, status: Recommendation['status']): Promise<Recommendation> {
    const rec = this.recs.find(r => r.id === id);
    if (!rec) throw new Error(`Recommendation ${id} not found`);
    rec.status = status;
    return Promise.resolve({ ...rec });
  }
}

export const recommendationService: IRecommendationService = new MockRecommendationService();
