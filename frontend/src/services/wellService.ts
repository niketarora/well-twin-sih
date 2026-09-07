import { Well, WellHealth } from '../types';
import { mockWell, mockWellsList, mockWellHealth } from '../mock';

export interface IWellService {
  getCurrentWell(): Promise<Well>;
  getWells(): Promise<Well[]>;
  getWellHealth(wellId: string): Promise<WellHealth>;
}

export class MockWellService implements IWellService {
  async getCurrentWell(): Promise<Well> {
    return Promise.resolve({ ...mockWell });
  }

  async getWells(): Promise<Well[]> {
    return Promise.resolve([...mockWellsList]);
  }

  async getWellHealth(_wellId: string): Promise<WellHealth> {
    return Promise.resolve({ ...mockWellHealth });
  }
}

export const wellService: IWellService = new MockWellService();
