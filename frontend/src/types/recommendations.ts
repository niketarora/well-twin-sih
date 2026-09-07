export interface Recommendation {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  category: 'Artificial Lift' | 'Thermal / Reservoir' | 'Surface / Separator' | 'Field Planning';
  action: string;
  reason: string;
  evidence: string[];
  expectedImpact: string;
  confidence: number;
  status: 'Open' | 'Accepted' | 'Deferred' | 'Implemented';
  createdAt: string;
  subsystem: string;
}
