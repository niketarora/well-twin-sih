export type NavigatorIntent =
  | 'NAVIGATE'
  | 'SELECT_WELL'
  | 'VIEW_WELL_HEALTH'
  | 'VIEW_PRODUCTION'
  | 'VIEW_TRENDS'
  | 'VIEW_CSS_CYCLE'
  | 'VIEW_ALERTS'
  | 'VIEW_RECOMMENDATIONS'
  | 'VIEW_WORK_ORDERS'
  | 'VIEW_EQUIPMENT'
  | 'VIEW_AI_INSIGHTS'
  | 'EXPLAIN_WELL'
  | 'EXPLAIN_ALERT'
  | 'WEBSITE_DATA_QUERY'
  | 'GENERAL_KNOWLEDGE'
  | 'INSUFFICIENT_DATA'
  | 'NEEDS_CLARIFICATION'
  | 'OUT_OF_SCOPE';

export interface NavigatorIntentResult {
  intent: NavigatorIntent;
  target: string | null;
  wellId: string | null;
  confidence: number;
  reason: string;
}
