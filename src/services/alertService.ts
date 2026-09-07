import { Alert } from '../types';
import { mockAlerts } from '../mock';

export interface IAlertService {
  getAlerts(): Promise<Alert[]>;
  acknowledgeAlert(alertId: string): Promise<Alert>;
  resolveAlert(alertId: string): Promise<Alert>;
}

export class MockAlertService implements IAlertService {
  private alerts: Alert[] = [...mockAlerts];

  async getAlerts(): Promise<Alert[]> {
    return Promise.resolve([...this.alerts]);
  }

  async acknowledgeAlert(alertId: string): Promise<Alert> {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert) throw new Error(`Alert ${alertId} not found`);
    alert.status = 'acknowledged';
    alert.acknowledgedAt = 'Just now';
    alert.acknowledgedBy = 'Rajesh Verma (PE)';
    return Promise.resolve({ ...alert });
  }

  async resolveAlert(alertId: string): Promise<Alert> {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert) throw new Error(`Alert ${alertId} not found`);
    alert.status = 'resolved';
    alert.resolvedAt = 'Just now';
    return Promise.resolve({ ...alert });
  }
}

export const alertService: IAlertService = new MockAlertService();
