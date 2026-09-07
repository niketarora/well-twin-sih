import { CssCycleState } from '../types';
import { mockCssCycle } from '../mock';

export interface ICssCycleService {
  getCssCycle(): Promise<CssCycleState>;
}

export class MockCssCycleService implements ICssCycleService {
  async getCssCycle(): Promise<CssCycleState> {
    return Promise.resolve({ ...mockCssCycle });
  }
}

export const cssCycleService: ICssCycleService = new MockCssCycleService();
