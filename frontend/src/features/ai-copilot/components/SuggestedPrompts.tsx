import React from 'react';
import { Sparkles } from 'lucide-react';

interface SuggestedPromptsProps {
  currentPage: string;
  wellCode: string;
  onSelectPrompt: (prompt: string) => void;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({
  currentPage,
  wellCode,
  onSelectPrompt,
}) => {
  const getPrompts = (): string[] => {
    if (currentPage === 'srp') {
      return [
        `What is the pump fillage on ${wellCode}?`,
        `Explain fluid pound risk on ${wellCode}`,
        `Is polished rod stress within safety limits?`,
        `Why is solution gas breaking out at the pump?`,
      ];
    }

    if (currentPage === 'reservoir') {
      return [
        `What is the sandface temperature on ${wellCode}?`,
        `How is in-situ viscosity trending?`,
        `Explain steam chamber cooling decay`,
        `Compare thermal response with offset wells`,
      ];
    }

    if (currentPage === 'production') {
      return [
        `What is the production variance on ${wellCode}?`,
        `Why is Coriolis net oil rate below target?`,
        `Review 14-day predicted vs actual trend`,
      ];
    }

    // Default overview / general
    return [
      `Why is ${wellCode} production declining?`,
      `Which well needs attention right now?`,
      `Show SRP lift dynamics for ${wellCode}`,
      `Explain active gas interference alert`,
      `What is the current Digital Twin health score?`,
    ];
  };

  const prompts = getPrompts();

  return (
    <div className="space-y-1.5 p-3 rounded-lg bg-surface-secondary/60 border border-border/70">
      <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-ink-muted">
        <Sparkles className="w-3 h-3 text-petroleum dark:text-cyan-400" />
        <span>Suggested Engineering Prompts</span>
      </div>

      <div className="flex flex-wrap gap-1.5 pt-1">
        {prompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(p)}
            className="text-left px-2.5 py-1 rounded-md text-[11px] font-medium bg-surface hover:bg-surface-secondary border border-border hover:border-petroleum/40 text-ink transition-colors shadow-2xs"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};
