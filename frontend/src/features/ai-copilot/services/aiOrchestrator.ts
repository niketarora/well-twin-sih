import { AiContext, AiResponse, AiUiContext } from '../types/ai';
import { buildAiContext } from './contextBuilder';
import { GeminiProvider } from './providers/GeminiProvider';
import { MockAiProvider } from './providers/MockAiProvider';
import { AiProvider } from './providers/AiProvider';
import { resolveRoute, normalizePageKey, isValidPage } from '../navigationRegistry';

class AiOrchestrator {
  private activeProvider: AiProvider;

  constructor() {
    // Default to GeminiProvider which auto-falls back to MockAiProvider if Gemini is unreachable
    this.activeProvider = new GeminiProvider();
  }

  setProvider(provider: AiProvider) {
    this.activeProvider = provider;
  }

  async processQuery(prompt: string, uiContext: AiUiContext): Promise<AiResponse> {
    const q = prompt.toLowerCase().trim();
    const currentWellId = uiContext.currentWellId || 'well-bw-017';

    // 1. FAST PATH: Direct Navigation Command via Local Intent Router (< 5ms)
    const directNavigation = this.tryDirectNavigation(q, currentWellId);
    if (directNavigation) {
      return directNavigation;
    }

    // 2. Build full multi-physics context
    const context: AiContext = await buildAiContext(uiContext);

    // 3. Delegate complex queries to active AI provider
    try {
      return await this.activeProvider.generateResponse(prompt, context);
    } catch (err: any) {
      console.warn('AI Provider execution failed, using fallback engine:', err);
      const fallback = new MockAiProvider();
      return fallback.generateResponse(prompt, context);
    }
  }

  private tryDirectNavigation(query: string, wellId: string): AiResponse | null {
    const navPatterns: Array<{ patterns: string[]; page: string; label: string; answer: string }> = [
      {
        patterns: ['open srp', 'go to srp', 'show srp', 'open pump', 'show pump', 'view dyno'],
        page: 'srp',
        label: 'Open SRP Lift Dynamics',
        answer: 'Opening Sucker Rod Pump (SRP) Lift Dynamics workstation.',
      },
      {
        patterns: ['open reservoir', 'go to reservoir', 'show reservoir', 'open thermal', 'view thermal'],
        page: 'reservoir',
        label: 'Open Reservoir / Thermal',
        answer: 'Opening Reservoir and Thermal monitoring workstation.',
      },
      {
        patterns: ['open overview', 'go to overview', 'show overview', 'open command center'],
        page: 'overview',
        label: 'Open Well Overview',
        answer: 'Opening Well Twin Command Center overview.',
      },
      {
        patterns: ['open production', 'go to production', 'show production', 'surface production'],
        page: 'production',
        label: 'Open Surface Production',
        answer: 'Opening Surface Production monitoring workstation.',
      },
      {
        patterns: ['open wellbore', 'go to wellbore', 'show wellbore', 'wellbore hydraulics'],
        page: 'wellbore',
        label: 'Open Wellbore Hydrodynamics',
        answer: 'Opening Wellbore Hydrodynamics workstation.',
      },
      {
        patterns: ['open field', 'go home', 'open map', 'field map', 'all wells'],
        page: 'home',
        label: 'Open Baghewala Field Map',
        answer: 'Navigating to Baghewala Field GIS Map.',
      },
      {
        patterns: ['open alerts', 'go to alerts', 'show alerts', 'review alerts'],
        page: 'alerts',
        label: 'Open Operational Alerts',
        answer: 'Opening Operational Alerts triage page.',
      },
      {
        patterns: ['open css', 'show css', 'css cycle', 'cycle tracker'],
        page: 'css',
        label: 'Open CSS Cycle Tracker',
        answer: 'Opening Cyclic Steam Stimulation (CSS) Cycle Tracker.',
      },
    ];

    for (const item of navPatterns) {
      if (item.patterns.some(p => query === p || query === `take me to ${p.replace('open ', '')}`)) {
        return {
          answer: item.answer,
          intent: 'NAVIGATION',
          confidence: 1.0,
          actions: [
            {
              type: 'OPEN_PAGE',
              page: item.page,
              wellId,
              label: item.label,
            },
          ],
        };
      }
    }

    return null;
  }
}

export const aiOrchestrator = new AiOrchestrator();
export { AiOrchestrator };
