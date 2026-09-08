import { AiProvider } from './AiProvider';
import { MockAiProvider } from './MockAiProvider';
import { AiContext, AiResponse } from '../../types/ai';
import { validateAiResponse } from '../../validators';
import { apiFetch } from '../../../../services/apiClient';

export class GeminiProvider implements AiProvider {
  readonly id = 'gemini';
  readonly name = 'Gemini 1.5 Flash (Petroleum AI)';
  private mockFallback = new MockAiProvider();

  async generateResponse(prompt: string, context: AiContext): Promise<AiResponse> {
    const currentWellId = context.well?.id || context.ui.currentWellId || 'well-bw-017';

    // 1. Check for optional developer client key in .env (VITE_GEMINI_API_KEY) or window
    const clientApiKey =
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
      (typeof window !== 'undefined' && (window as any).__GEMINI_API_KEY__);

    if (clientApiKey && typeof clientApiKey === 'string' && clientApiKey.trim().length > 0) {
      try {
        const response = await this.callGeminiDirect(prompt, context, clientApiKey.trim());
        return validateAiResponse(response, currentWellId);
      } catch (err) {
        console.warn('[GeminiProvider] Direct Gemini API call failed, falling back to deterministic engineering engine:', err);
      }
    }

    // 2. Fall back gracefully to deterministic multi-physics engineering provider
    return this.mockFallback.generateResponse(prompt, context);
  }

  private async callGeminiDirect(prompt: string, context: AiContext, apiKey: string): Promise<any> {
    const systemInstruction = `You are the Well Twin AI Engineering Copilot for the Baghewala Heavy Oil Field (Rajasthan Basin, Mandhali Sandstone).
You assist petroleum engineers in real-time surveillance across 4 coupled physical domains:
1. Reservoir / Thermal (CSS steam chamber heating, sandface BHT, in-situ viscosity decay)
2. Wellbore Hydrodynamics (inflow hydraulics, pump intake pressure)
3. SRP Lift Dynamics (dyno cards, barrel fillage %, polished rod stress, fluid pound)
4. Surface Production (Coriolis skid gross liquid/oil rate BOPD, water cut, manifold pressure)

GROUNDING RULES:
- Never invent telemetry, unrecorded wells, fake alerts, or unauthorized URLs.
- Available active wells are: BW-01, BW-02, BW-03, BW-17 (well-bw-017), BW-22, BW-23, BW-05.
- Distinguish between OBSERVED sensor data, MODEL_DERIVED simulation, and AI_INTERPRETATION.
- Provide actionable navigation actions using valid pages: 'home', 'overview', 'reservoir', 'wellbore', 'srp', 'production', 'css', 'alerts', 'trends', 'recommendations'.

JSON OUTPUT FORMAT:
Respond ONLY with a JSON object matching this schema:
{
  "answer": "Clear, grounded engineering explanation...",
  "intent": "NAVIGATION" | "DATA_LOOKUP" | "EXPLANATION" | "COMPARISON" | "INVESTIGATION" | "RECOMMENDATION" | "GENERAL_ENGINEERING",
  "confidence": 0.0 to 1.0,
  "evidence": [
    { "label": "string", "value": number or "string", "unit": "string", "trend": "up"|"down"|"stable", "provenance": "OBSERVED"|"MODEL_DERIVED"|"AI_INTERPRETATION"|"ACTUAL" }
  ],
  "actions": [
    { "type": "OPEN_PAGE", "page": "srp"|"reservoir"|"production"|"overview"|"home"|"alerts", "wellId": "${context.well?.id || 'well-bw-017'}", "label": "Action label" }
  ]
}`;

    const contextPayload = {
      activeWell: context.well,
      activeTelemetry: context.telemetry,
      activeHealth: context.health,
      activeAlerts: context.alerts?.slice(0, 3),
      uiContext: context.ui,
    };

    const model = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_MODEL) || 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `APPLICATION CONTEXT:\n${JSON.stringify(contextPayload, null, 2)}\n\nUSER QUESTION:\n${prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
          maxOutputTokens: 1000,
        },
      }),
    });

    if (!res.ok) {
      let errText = '';
      try {
        const errJson = await res.json();
        errText = errJson.error?.message || res.statusText;
      } catch {
        errText = res.statusText;
      }
      throw new Error(`Gemini API HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Empty response from Gemini');

    let cleanedText = rawText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    return JSON.parse(cleanedText);
  }
}
