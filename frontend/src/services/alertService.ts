import { Alert, AlertSeverity, AlertStatus } from '../types';
import { mockAlerts } from '../mock';
import { apiFetch } from './apiClient';

export interface IAlertService {
  getAlerts(): Promise<Alert[]>;
  acknowledgeAlert(alertId: string): Promise<Alert>;
  resolveAlert(alertId: string): Promise<Alert>;
}

export class HybridAlertService implements IAlertService {
  private fallbackAlerts: Alert[] = [...mockAlerts];

  async getAlerts(): Promise<Alert[]> {
    try {
      const data = await apiFetch<any[]>('/wells/well-bw-017/alerts');
      return data.map((a, idx) => {
        const fallback = this.fallbackAlerts[idx] || this.fallbackAlerts[0];
        const sev: AlertSeverity = a.severity.toLowerCase() === 'critical' ? 'critical' : a.severity.toLowerCase() === 'info' ? 'info' : 'warning';
        const st: AlertStatus = a.status.toLowerCase() === 'resolved' ? 'resolved' : a.status.toLowerCase() === 'acknowledged' ? 'acknowledged' : 'active';
        return {
          ...fallback,
          id: a.id,
          title: a.title,
          severity: sev,
          status: st,
          subsystem: a.subsystem,
          source: a.subsystem,
          what: a.explanation || fallback.what,
          why: a.explanation || fallback.why,
          action: a.action_required || fallback.action,
          evidence: fallback.evidence,
          metric: a.metric,
          observedValue: a.observed_value,
          threshold: a.threshold,
          timestamp: new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          acknowledgedBy: a.acknowledged_by,
          acknowledgedAt: a.acknowledged_at ? new Date(a.acknowledged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
          resolvedBy: a.resolved_by,
          resolvedAt: a.resolved_at ? new Date(a.resolved_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
        };
      });
    } catch {
      return [...this.fallbackAlerts];
    }
  }

  async acknowledgeAlert(alertId: string): Promise<Alert> {
    try {
      const a = await apiFetch<any>(`/alerts/${alertId}/acknowledge`, {
        method: 'POST',
        body: JSON.stringify({ engineer_id: 'Rajesh Verma (PE)', notes: 'Acknowledged via workstation' })
      });
      const fallback = this.fallbackAlerts.find(f => f.id === alertId) || this.fallbackAlerts[0];
      return {
        ...fallback,
        id: a.id,
        status: 'acknowledged',
        acknowledgedBy: a.acknowledged_by || 'Rajesh Verma (PE)',
        acknowledgedAt: 'Just now',
      };
    } catch {
      const alert = this.fallbackAlerts.find(a => a.id === alertId);
      if (alert) {
        alert.status = 'acknowledged';
        alert.acknowledgedAt = 'Just now';
        alert.acknowledgedBy = 'Rajesh Verma (PE)';
        return { ...alert };
      }
      throw new Error(`Alert ${alertId} not found`);
    }
  }

  async resolveAlert(alertId: string): Promise<Alert> {
    try {
      const a = await apiFetch<any>(`/alerts/${alertId}/resolve`, {
        method: 'POST',
        body: JSON.stringify({ engineer_id: 'Rajesh Verma (PE)', corrective_action: 'Resolved via workstation' })
      });
      const fallback = this.fallbackAlerts.find(f => f.id === alertId) || this.fallbackAlerts[0];
      return {
        ...fallback,
        id: a.id,
        status: 'resolved',
        resolvedAt: 'Just now',
      };
    } catch {
      const alert = this.fallbackAlerts.find(a => a.id === alertId);
      if (alert) {
        alert.status = 'resolved';
        alert.resolvedAt = 'Just now';
        return { ...alert };
      }
      throw new Error(`Alert ${alertId} not found`);
    }
  }
}

export const alertService: IAlertService = new HybridAlertService();
