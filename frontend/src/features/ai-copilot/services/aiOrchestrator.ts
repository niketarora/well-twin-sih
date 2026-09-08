import { apiFetch } from '../../../services/apiClient';
import { AiAction, AiEvidence, AiIntent, AiResponse, AiUiContext, EvidenceProvenance } from '../types/ai';

interface NavigatorNavigationResponse {
  target: string;
  well_id?: string | null;
  route: string;
  label: string;
}

interface NavigatorEvidenceResponse {
  label: string;
  value: string | number;
  unit?: string;
  provenance: string;
}

interface NavigatorApiResponse {
  type: string;
  intent: string;
  message: string;
  well_id?: string | null;
  navigation?: NavigatorNavigationResponse | null;
  evidence?: NavigatorEvidenceResponse[];
  audio_base64?: string | null;
  metadata?: Record<string, any>;
}

export interface ProcessQueryOptions {
  includeAudio?: boolean;
}

class AiOrchestrator {
  /**
   * Routes user questions directly to the unified Gemini + DB + Petroleum Engineer + Sarvam TTS pipeline.
   * Endpoint: POST /api/v1/ai/navigator
   */
  async processQuery(
    prompt: string,
    uiContext: AiUiContext,
    options?: ProcessQueryOptions
  ): Promise<AiResponse> {
    const currentWellId = uiContext.currentWellId || 'well-bw-017';
    const includeAudio = options?.includeAudio ?? true;

    try {
      const payload = {
        message: prompt.trim(),
        current_page: uiContext.currentPage || 'field_map',
        selected_well: currentWellId,
        include_audio: includeAudio,
        context: {
          fieldId: uiContext.fieldId,
          fieldName: uiContext.fieldName,
          section: uiContext.currentSection,
        },
      };

      const res = await apiFetch<NavigatorApiResponse>('/ai/navigator', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // Map backend evidence provenance
      const evidence: AiEvidence[] = (res.evidence || []).map((e) => ({
        label: e.label,
        value: e.value,
        unit: e.unit,
        provenance: (e.provenance || 'OBSERVED') as EvidenceProvenance,
      }));

      // Map backend intent
      let mappedIntent: AiIntent = 'GENERAL_ENGINEERING';
      if (res.intent === 'NAVIGATE' || res.type === 'NAVIGATION') {
        mappedIntent = 'NAVIGATION';
      } else if (
        ['WEBSITE_DATA_QUERY', 'VIEW_PRODUCTION', 'VIEW_WELL_HEALTH', 'SELECT_WELL'].includes(res.intent)
      ) {
        mappedIntent = 'DATA_LOOKUP';
      } else if (['EXPLAIN_WELL', 'EXPLAIN_ALERT'].includes(res.intent)) {
        mappedIntent = 'EXPLANATION';
      } else if (res.intent === 'GENERAL_KNOWLEDGE') {
        mappedIntent = 'GENERAL_ENGINEERING';
      }

      // Map backend navigation action
      const actions: AiAction[] = res.navigation
        ? [
            {
              type: 'OPEN_PAGE',
              page: res.navigation.target,
              wellId: res.navigation.well_id || currentWellId,
              label: res.navigation.label,
              params: { route: res.navigation.route },
            },
          ]
        : [];

      return {
        answer: res.message,
        intent: mappedIntent,
        confidence: res.metadata?.confidence ?? 0.95,
        evidence: evidence.length > 0 ? evidence : undefined,
        actions: actions.length > 0 ? actions : undefined,
        audioBase64: res.audio_base64,
      };
    } catch (err: any) {
      console.error('[AiOrchestrator] Failed to execute live AI Navigator query:', err);
      throw err;
    }
  }
}

export const aiOrchestrator = new AiOrchestrator();
export { AiOrchestrator };
