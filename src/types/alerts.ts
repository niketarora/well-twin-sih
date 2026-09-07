export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface AlertEvidence {
  label: string;
  value: string;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  status: AlertStatus;
  subsystem: string;
  source: string;
  title: string;
  what: string;
  why: string;
  action: string;
  evidence: AlertEvidence[];
  timestamp: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  metric?: string;
  observedValue?: string;
  threshold?: string;
}
