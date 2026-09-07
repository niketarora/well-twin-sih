import { AiInsight } from '../types';
import { mockAiInsight } from '../mock';

export interface IAiInsightService {
  getTopInsight(): Promise<AiInsight>;
  getInsights(): Promise<AiInsight[]>;
}

export class MockAiInsightService implements IAiInsightService {
  async getTopInsight(): Promise<AiInsight> {
    return Promise.resolve({ ...mockAiInsight });
  }

  async getInsights(): Promise<AiInsight[]> {
    return Promise.resolve([{ ...mockAiInsight }]);
  }
}

export const aiInsightService: IAiInsightService = new MockAiInsightService();
