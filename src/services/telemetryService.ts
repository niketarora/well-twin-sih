import { KpiCardData, SubsystemParameterGroup } from '../types';
import { mockKpis, mockParameterGroups, mockTimeseries, mockOverview14DayChart } from '../mock';

export interface ITelemetryService {
  getOverviewKpis(): Promise<KpiCardData[]>;
  getParameterGroups(): Promise<SubsystemParameterGroup[]>;
  getTimeseries(): Promise<typeof mockTimeseries>;
  getOverview14DayChart(): Promise<typeof mockOverview14DayChart>;
}

export class MockTelemetryService implements ITelemetryService {
  async getOverviewKpis(): Promise<KpiCardData[]> {
    return Promise.resolve([...mockKpis]);
  }

  async getParameterGroups(): Promise<SubsystemParameterGroup[]> {
    return Promise.resolve([...mockParameterGroups]);
  }

  async getTimeseries(): Promise<typeof mockTimeseries> {
    return Promise.resolve({ ...mockTimeseries });
  }

  async getOverview14DayChart(): Promise<typeof mockOverview14DayChart> {
    return Promise.resolve([...mockOverview14DayChart]);
  }
}

export const telemetryService: ITelemetryService = new MockTelemetryService();
