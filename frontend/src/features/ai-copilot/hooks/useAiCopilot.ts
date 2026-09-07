import { create } from 'zustand';
import { AiMessage, AiUiContext } from '../types/ai';
import { aiOrchestrator } from '../services/aiOrchestrator';

interface AiCopilotState {
  isOpen: boolean;
  isLoading: boolean;
  messages: AiMessage[];
  pendingPrompt: string | null;
  setIsOpen: (open: boolean) => void;
  toggleOpen: () => void;
  openWithPrompt: (prompt: string) => void;
  clearPendingPrompt: () => void;
  askQuestion: (prompt: string, uiContext: AiUiContext) => Promise<void>;
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

export const useAiCopilot = create<AiCopilotState>((set, get) => ({
  isOpen: false,
  isLoading: false,
  messages: initialMessages,
  pendingPrompt: null,

  setIsOpen: (isOpen) => set({ isOpen }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

  openWithPrompt: (prompt: string) => {
    set({ isOpen: true, pendingPrompt: prompt });
  },

  clearPendingPrompt: () => set({ pendingPrompt: null }),

  askQuestion: async (prompt: string, uiContext: AiUiContext) => {
    if (!prompt.trim()) return;

    const userMessage: AiMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: prompt.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const loadingId = `msg-assistant-${Date.now()}`;
    const placeholderAssistantMessage: AiMessage = {
      id: loadingId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isLoading: true,
    };

    set((state) => ({
      messages: [...state.messages, userMessage, placeholderAssistantMessage],
      isLoading: true,
      pendingPrompt: null,
    }));

    try {
      const response = await aiOrchestrator.processQuery(prompt, uiContext);

      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === loadingId
            ? {
                ...m,
                content: response.answer,
                response,
                isLoading: false,
              }
            : m
        ),
        isLoading: false,
      }));
    } catch (err: any) {
      console.error('Failed to process AI query:', err);
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === loadingId
            ? {
                ...m,
                content:
                  'The AI Copilot encountered a temporary communication issue. You can continue using the Well Twin workstation normally.',
                error: err.message || 'Unable to complete request',
                isLoading: false,
              }
            : m
        ),
        isLoading: false,
      }));
    }
  },

  clearMessages: () => set({ messages: initialMessages }),
}));
