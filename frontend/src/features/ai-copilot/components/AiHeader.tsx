import React from 'react';
import { Bot, X, Trash2 } from 'lucide-react';
import { AiUiContext } from '../types/ai';

interface AiHeaderProps {
  uiContext: AiUiContext;
  wellCode: string;
  onClose: () => void;
  onClear: () => void;
}

export const AiHeader: React.FC<AiHeaderProps> = ({
  uiContext,
  wellCode,
  onClose,
  onClear,
}) => {
  return (
    <div className="p-4 border-b border-border bg-surface-secondary/80 flex items-center justify-between select-none">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-petroleum text-white flex items-center justify-center shadow-xs">
          <Bot className="w-4.5 h-4.5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-ink tracking-tight">WELL TWIN AI</h2>
            <span className="text-[10px] px-2 py-0.2 rounded-full font-semibold bg-petroleum/10 text-petroleum dark:bg-petroleum/20 dark:text-cyan-400 border border-petroleum/20">
              Copilot
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-ink-muted mt-0.5">
            <span className="font-semibold text-ink">{wellCode}</span>
            <span>·</span>
            <span className="capitalize">{uiContext.currentPage}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onClear}
          className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors"
          title="Clear chat history"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors"
          title="Close Copilot"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
