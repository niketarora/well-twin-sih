import { EquipmentSection } from '../types';
import { mockEquipmentList } from '../mock';

export interface IEquipmentService {
  getEquipment(): Promise<EquipmentSection[]>;
}

export class MockEquipmentService implements IEquipmentService {
  async getEquipment(): Promise<EquipmentSection[]> {
    return Promise.resolve([...mockEquipmentList]);
  }
}

export const equipmentService: IEquipmentService = new MockEquipmentService();
