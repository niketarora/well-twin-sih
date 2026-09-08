import React, { useRef, useEffect } from 'react';
import { useAiCopilot } from '../hooks/useAiCopilot';
import { useAiContext } from '../hooks/useAiContext';
import { AiHeader } from './AiHeader';
import { AiMessage } from './AiMessage';
import { AiInput } from './AiInput';
import { SuggestedPrompts } from './SuggestedPrompts';
import { useUIStore } from '../../../stores/useUIStore';

export const AiCopilotDrawer: React.FC = () => {
  const { isOpen, setIsOpen, messages, isLoading, askQuestion, clearMessages, pendingPrompt, clearPendingPrompt } =
    useAiCopilot();
  const uiContext = useAiContext();
  const { selectedWellId } = useUIStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Handle auto-triggered prompts (e.g. from Explain with AI on KPI cards)
  useEffect(() => {
    if (isOpen && pendingPrompt) {
      askQuestion(pendingPrompt, uiContext);
      clearPendingPrompt();
    }
  }, [isOpen, pendingPrompt]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentWellCode = (selectedWellId || 'well-bw-017').replace('well-', '').toUpperCase();

  const handleSend = (text: string, isVoice: boolean = false) => {
    askQuestion(text, uiContext, isVoice);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative w-full sm:w-[440px] h-full bg-surface border-l border-border shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250">
        {/* Header */}
        <AiHeader
          uiContext={uiContext}
          wellCode={currentWellCode}
          onClose={() => setIsOpen(false)}
          onClear={clearMessages}
        />

        {/* Scrollable Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {messages.map((msg) => (
            <AiMessage
              key={msg.id}
              message={msg}
              onActionExecuted={() => {
                // Keep drawer open or focused so engineer can see confirmation
              }}
            />
          ))}

          {/* Suggested Prompts shown below welcome message */}
          {messages.length <= 2 && !isLoading && (
            <div className="pt-2">
              <SuggestedPrompts
                currentPage={uiContext.currentPage}
                wellCode={currentWellCode}
                onSelectPrompt={handleSend}
              />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer Input Bar */}
        <div className="p-3 border-t border-border bg-surface-secondary/40 space-y-2">
          <AiInput
            onSend={handleSend}
            isLoading={isLoading}
            placeholder={`Ask about ${currentWellCode} or request navigation...`}
          />
          <div className="flex items-center justify-between text-[10px] text-ink-muted px-1">
            <span>Powered by Gemini 1.5 & Multi-Physics Twin</span>
            <span>Press Enter to send</span>
          </div>
        </div>
      </div>
    </div>
  );
};
