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

    // 1. First try calling the FastAPI backend endpoint if in API mode or reachable
    try {
      const backendRes = await apiFetch<any>('/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          well_id: currentWellId,
          current_route: context.ui.currentPage,
          active_tab: context.ui.currentSection,
          context: {
            ui: context.ui,
            well: context.well,
            telemetry: context.telemetry,
          },
        }),
      });

      if (backendRes && (backendRes.answer || backendRes.message)) {
        return validateAiResponse(backendRes, currentWellId);
      }
    } catch {
      // Backend not running or endpoint not yet configured, proceed to client-side dev key or fallback
    }

    // 2. Check for optional developer client key in .env (VITE_GEMINI_API_KEY)
    const clientApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (clientApiKey && typeof clientApiKey === 'string' && clientApiKey.trim().length > 0) {
      try {
        const response = await this.callGeminiDirect(prompt, context, clientApiKey.trim());
        return validateAiResponse(response, currentWellId);
      } catch (err) {
        console.warn('Direct Gemini API call failed, falling back to deterministic engineering engine:', err);
      }
    }

    // 3. Fall back gracefully to deterministic engineering provider
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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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
      throw new Error(`Gemini API HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Empty response from Gemini');

    return JSON.parse(rawText);
  }
}
