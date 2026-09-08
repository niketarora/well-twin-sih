import { create } from 'zustand';
import { AiConversationState, AiMessage, AiUiContext } from '../types/ai';
import { aiOrchestrator } from '../services/aiOrchestrator';
import { router } from '../../../app/router';
import { resolveRoute } from '../navigationRegistry';
import { useUIStore } from '../../../stores/useUIStore';

interface AiCopilotState {
  isOpen: boolean;
  isLoading: boolean;
  loadingStage: string;
  messages: AiMessage[];
  pendingPrompt: string | null;
  conversationState: AiConversationState;
  setIsOpen: (open: boolean) => void;
  toggleOpen: () => void;
  openWithPrompt: (prompt: string) => void;
  clearPendingPrompt: () => void;
  askQuestion: (prompt: string, uiContext: AiUiContext, isVoice?: boolean) => Promise<void>;
  clearMessages: () => void;
}

const initialMessages: AiMessage[] = [
  {
    id: 'msg-welcome',
    role: 'assistant',
    content:
      'Welcome to the **Well Twin AI Engineering Copilot**. I am connected to the Baghewala Field surveillance twin and telemetry streams.\n\nAsk me about well health, production variance, downhole pump dynamics, or click a suggestion below.',
    timestamp: 'Just now',
  },
];

const initialConversationState: AiConversationState = {
  selectedWellId: 'well-bw-017',
  turnCount: 0,
};

export const useAiCopilot = create<AiCopilotState>((set, get) => ({
  isOpen: false,
  isLoading: false,
  loadingStage: '',
  messages: initialMessages,
  pendingPrompt: null,
  conversationState: initialConversationState,

  setIsOpen: (isOpen) => set({ isOpen }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

  openWithPrompt: (prompt: string) => {
    set({ isOpen: true, pendingPrompt: prompt });
  },

  clearPendingPrompt: () => set({ pendingPrompt: null }),

  askQuestion: async (prompt: string, uiContext: AiUiContext, isVoice: boolean = false) => {
    if (!prompt.trim()) return;

    const state = get();
    const currentWell = uiContext.currentWellId || state.conversationState.selectedWellId || 'well-bw-017';
    
    // Resolve conversational follow-ups like "Why?", "Show me the pump", "What about the pump?"
    let effectivePrompt = prompt.trim();
    const qLower = effectivePrompt.toLowerCase();
    if (qLower === 'why' || qLower === 'why?' || qLower === 'why is that?') {
      effectivePrompt = `Why is ${currentWell} experiencing production decline or anomalies? Explain the multi-twin causal root cause.`;
    } else if (qLower === 'show me the pump' || qLower === 'what about the pump?' || qLower === 'what about the pump') {
      effectivePrompt = `Open SRP lift dynamics diagnostics for ${currentWell}.`;
    }

    const userMessage: AiMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: prompt.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const loadingId = `msg-assistant-${Date.now()}`;
    const initialStage = `Checking ${currentWell.replace('well-', '').toUpperCase()}...`;

    const placeholderAssistantMessage: AiMessage = {
      id: loadingId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isLoading: true,
      loadingStage: initialStage,
      isVoice: Boolean(isVoice),
    };

    set((s) => ({
      messages: [...s.messages, userMessage, placeholderAssistantMessage],
      isLoading: true,
      loadingStage: initialStage,
      pendingPrompt: null,
    }));

    try {
      // Truthful Stage 2
      setTimeout(() => {
        if (get().isLoading) {
          const stage2 = 'Analyzing 4-twin coupled physical states...';
          set((s) => ({
            loadingStage: stage2,
            messages: s.messages.map((m) =>
              m.id === loadingId ? { ...m, loadingStage: stage2 } : m
            ),
          }));
        }
      }, 350);

      const response = await aiOrchestrator.processQuery(
        effectivePrompt,
        {
          ...uiContext,
          currentWellId: currentWell,
        },
        { includeAudio: isVoice }
      );

      const resolvedWellId = response.actions?.[0]?.wellId || currentWell;
      const resolvedPage = response.actions?.[0]?.page;

      // Cleanly execute automatic client-side navigation if requested
      if (response.intent === 'NAVIGATION' && response.actions && response.actions.length > 0) {
        const action = response.actions[0];
        const targetRoute = action.params?.route || resolveRoute(action.page, action.wellId);
        if (targetRoute) {
          if (action.wellId) {
            useUIStore.getState().setSelectedWellId(action.wellId);
          }
          try {
            router.navigate(targetRoute);
          } catch (navErr) {
            console.warn('[useAiCopilot] Automatic navigation failed:', navErr);
          }
        }
      }

      set((s) => ({
        messages: s.messages.map((m) =>
          m.id === loadingId
            ? {
                ...m,
                content: response.answer,
                response,
                audioBase64: response.audioBase64,
                isVoice: Boolean(isVoice),
                isLoading: false,
                loadingStage: undefined,
              }
            : m
        ),
        isLoading: false,
        loadingStage: '',
        conversationState: {
          selectedWellId: resolvedWellId,
          lastIntent: response.intent,
          lastReferencedPage: resolvedPage || s.conversationState.lastReferencedPage,
          turnCount: s.conversationState.turnCount + 1,
        },
      }));
    } catch (err: any) {
      console.error('Failed to process AI query:', err);
      set((s) => ({
        messages: s.messages.map((m) =>
          m.id === loadingId
            ? {
                ...m,
                content:
                  'The AI Copilot encountered a temporary communication issue. You can continue using the Well Twin workstation normally.',
                error: err.message || 'Unable to complete request',
                isLoading: false,
                loadingStage: undefined,
              }
            : m
        ),
        isLoading: false,
        loadingStage: '',
      }));
    }
  },

  clearMessages: () =>
    set({
      messages: initialMessages,
      conversationState: initialConversationState,
      loadingStage: '',
    }),
}));

