import { AiResponse, AiAction, AiEvidence, AiIntent } from './types/ai';
import { isValidPage, normalizePageKey } from './navigationRegistry';

const validIntents: Set<AiIntent> = new Set([
  'NAVIGATION',
  'DATA_LOOKUP',
  'EXPLANATION',
  'COMPARISON',
  'INVESTIGATION',
  'RECOMMENDATION',
  'GENERAL_ENGINEERING',
  'UNKNOWN',
]);

export function validateAction(action: any, fallbackWellId = 'well-bw-017'): AiAction | null {
  if (!action || typeof action !== 'object') return null;
  if (action.type !== 'OPEN_PAGE') return null;

  const rawPage = String(action.page || '').trim();
  if (!isValidPage(rawPage)) {
    return null;
  }

  const normalizedPage = normalizePageKey(rawPage);
  const wellId = String(action.wellId || fallbackWellId).trim();
  const label = String(action.label || `Open ${normalizedPage}`).trim();

  // Safety check: ensure wellId contains only safe alphanumeric/hyphen characters
  const cleanWellId = wellId.replace(/[^a-zA-Z0-9_-]/g, '');

  return {
    type: 'OPEN_PAGE',
    page: normalizedPage,
    wellId: cleanWellId || fallbackWellId,
    label: label.slice(0, 50),
    params: action.params && typeof action.params === 'object' ? action.params : undefined,
  };
}

export function validateEvidence(evidence: any): AiEvidence | null {
  if (!evidence || typeof evidence !== 'object') return null;
  if (!evidence.label || evidence.value === undefined) return null;

  const provenance = ['OBSERVED', 'MODEL_DERIVED', 'AI_INTERPRETATION', 'ACTUAL'].includes(
    evidence.provenance
  )
    ? evidence.provenance
    : 'AI_INTERPRETATION';

  return {
    label: String(evidence.label).slice(0, 60),
    value: evidence.value,
    unit: evidence.unit ? String(evidence.unit).slice(0, 15) : undefined,
    trend: ['up', 'down', 'stable'].includes(evidence.trend) ? evidence.trend : undefined,
    provenance,
  };
}

export function validateAiResponse(raw: any, fallbackWellId = 'well-bw-017'): AiResponse {
  if (!raw || typeof raw !== 'object') {
    return {
      answer: String(raw || 'Unable to process response.'),
      intent: 'UNKNOWN',
    };
  }

  const answer = String(raw.answer || raw.message || raw.text || '').trim();
  const rawIntent = String(raw.intent || 'GENERAL_ENGINEERING').toUpperCase() as AiIntent;
  const intent: AiIntent = validIntents.has(rawIntent) ? rawIntent : 'GENERAL_ENGINEERING';

  let confidence: number | undefined = undefined;
  if (typeof raw.confidence === 'number' && !isNaN(raw.confidence)) {
    confidence = Math.min(1, Math.max(0, raw.confidence));
  }

  const evidence: AiEvidence[] = [];
  if (Array.isArray(raw.evidence)) {
    for (const item of raw.evidence) {
      const valid = validateEvidence(item);
      if (valid) evidence.push(valid);
    }
  }

  const actions: AiAction[] = [];
  if (Array.isArray(raw.actions)) {
    for (const item of raw.actions) {
      const valid = validateAction(item, fallbackWellId);
      if (valid) actions.push(valid);
    }
  }

  const warnings: string[] = [];
  if (Array.isArray(raw.warnings)) {
    for (const w of raw.warnings) {
      if (typeof w === 'string') warnings.push(w);
    }
  }

  return {
    answer: answer || 'Data processed successfully.',
    intent,
    confidence,
    evidence: evidence.length > 0 ? evidence : undefined,
    actions: actions.length > 0 ? actions : undefined,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}
