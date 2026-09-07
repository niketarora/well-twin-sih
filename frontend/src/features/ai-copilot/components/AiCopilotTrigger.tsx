import React from 'react';
import { Sparkles } from 'lucide-react';
import { useAiCopilot } from '../hooks/useAiCopilot';

export const AiCopilotTrigger: React.FC = () => {
  const { isOpen, toggleOpen } = useAiCopilot();

  if (isOpen) return null;

  return (
    <button
      type="button"
      onClick={toggleOpen}
      className="fixed bottom-6 right-6 z-40 h-12 px-4 rounded-full bg-gradient-to-r from-petroleum to-petroleum-hover text-white flex items-center gap-2.5 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 group border border-white/20"
      title="Open Well Twin AI Copilot"
    >
      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
        <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
      </div>
      <div className="flex flex-col text-left leading-none">
        <span className="text-[9px] uppercase tracking-wider text-white/80 font-semibold">
          Ask Copilot
        </span>
        <span className="text-xs font-bold text-white mt-0.5">
          Well Twin AI
        </span>
      </div>
    </button>
  );
};
