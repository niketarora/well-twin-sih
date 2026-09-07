export type AiIntent =
  | 'NAVIGATION'
  | 'DATA_LOOKUP'
  | 'EXPLANATION'
  | 'COMPARISON'
  | 'INVESTIGATION'
  | 'RECOMMENDATION'
  | 'GENERAL_ENGINEERING'
  | 'UNKNOWN';

export type EvidenceProvenance = 'OBSERVED' | 'MODEL_DERIVED' | 'AI_INTERPRETATION' | 'ACTUAL';

export interface AiEvidence {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  provenance: EvidenceProvenance;
}

export interface AiAction {
  type: 'OPEN_PAGE';
  page: string;
  wellId: string;
  label: string;
  params?: Record<string, string>;
}

export interface AiUiContext {
  fieldId: string;
  fieldName: string;
  currentWellId: string;
  currentPage: string;
  currentSection?: string;
}

export interface AiContext {
  ui: AiUiContext;
  well?: {
    id: string;
    code: string;
    name: string;
    pad?: string;
    sector?: string;
    status?: string;
    healthScore?: number;
    cycle?: number;
    dayInCycle?: number;
    phase?: string;
  };
  telemetry?: {
    oilRate?: number;
    waterCut?: number;
    bht?: number;
    bhp?: number;
    viscosity?: number;
    fillage?: number;
    spm?: number;
    rodLoad?: number;
  };
  health?: {
    score: number;
    status: string;
    dominantConcern?: string;
    subsystems: Array<{ id: string; name: string; score: number; dominantFactor?: string }>;
  };
  alerts?: Array<{ id: string; title: string; severity: string; subsystem: string; timestamp: string }>;
  fieldSummary?: {
    totalWells: number;
    producingWells: number;
    attentionWells: number;
    criticalWells: number;
    totalBopd: number;
  };
}

export interface AiResponse {
  answer: string;
  intent: AiIntent;
  confidence?: number;
  evidence?: AiEvidence[];
  actions?: AiAction[];
  warnings?: string[];
}

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  response?: AiResponse;
  isLoading?: boolean;
  error?: string;
}
