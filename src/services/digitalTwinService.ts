import {
  ReservoirTwinState,
  WellboreTwinState,
  SrpTwinState,
  SurfaceProductionTwinState,
  CouplingTransfer,
  ModelValidationItem,
  DigitalTwinMeshState,
} from '../types';
import {
  mockReservoirTwin,
  mockWellboreTwin,
  mockSrpTwin,
  mockSurfaceProductionTwin,
  mockCouplingTransfers,
  mockModelValidationItems,
  mockDigitalTwinMeshState,
  mockOverallModelAgreement,
} from '../mock';

export interface IDigitalTwinService {
  getReservoirTwin(): Promise<ReservoirTwinState>;
  getWellboreTwin(): Promise<WellboreTwinState>;
  getSrpTwin(): Promise<SrpTwinState>;
  getSurfaceProductionTwin(): Promise<SurfaceProductionTwinState>;
  getCouplingTransfers(): Promise<CouplingTransfer[]>;
  getModelValidation(): Promise<{
    agreement: number;
    items: ModelValidationItem[];
  }>;
  getMeshState(): Promise<DigitalTwinMeshState>;
}

export class MockDigitalTwinService implements IDigitalTwinService {
  async getReservoirTwin(): Promise<ReservoirTwinState> {
    return Promise.resolve({ ...mockReservoirTwin });
  }

  async getWellboreTwin(): Promise<WellboreTwinState> {
    return Promise.resolve({ ...mockWellboreTwin });
  }

  async getSrpTwin(): Promise<SrpTwinState> {
    return Promise.resolve({ ...mockSrpTwin });
  }

  async getSurfaceProductionTwin(): Promise<SurfaceProductionTwinState> {
    return Promise.resolve({ ...mockSurfaceProductionTwin });
  }

  async getCouplingTransfers(): Promise<CouplingTransfer[]> {
    return Promise.resolve([...mockCouplingTransfers]);
  }

  async getModelValidation(): Promise<{
    agreement: number;
    items: ModelValidationItem[];
  }> {
    return Promise.resolve({
      agreement: mockOverallModelAgreement,
      items: [...mockModelValidationItems],
    });
  }

  async getMeshState(): Promise<DigitalTwinMeshState> {
    return Promise.resolve({ ...mockDigitalTwinMeshState });
  }
}

export const digitalTwinService: IDigitalTwinService = new MockDigitalTwinService();
