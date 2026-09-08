import { NavigatorIntent } from './intent';

export interface NavigatorEvidence {
  label: string;
  value: string | number;
  unit?: string;
  provenance: 'OBSERVED' | 'MODEL_DERIVED' | 'AI_INTERPRETATION' | 'ACTUAL';
}

export interface NavigatorNavigationAction {
  target: string;
  wellId?: string;
  route: string;
  label: string;
}

export interface NavigatorResponse {
  type: 'NAVIGATION' | 'ANSWER' | 'CLARIFICATION' | 'INSUFFICIENT_DATA' | 'OUT_OF_SCOPE' | 'ERROR';
  intent: NavigatorIntent;
  message: string;
  well_id?: string;
  navigation?: NavigatorNavigationAction;
  evidence?: NavigatorEvidence[];
  audio_base64?: string | null;
  metadata?: {
    confidence?: number;
    dataSource?: 'mock' | 'supabase';
    latencyMs?: number;
    routerReason?: string;
  };
}
