export interface Anomaly {
  id: string;
  score: number; // 0 - 100
  severity: 'critical' | 'warning' | 'info';
  affectedMetric: string;
  timeWindow: string;
  status: 'Open' | 'Investigating' | 'Resolved';
  title: string;
  evidence: string[];
  possibleCause: string;
  relatedAlertId?: string;
  impact: string;
  recommendedAction: string;
}
