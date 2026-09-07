import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface ConfidenceBadgeProps {
  confidence?: number;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ confidence }) => {
  if (confidence === undefined || isNaN(confidence)) return null;

  const pct = Math.round(confidence * 100);

  const getStyle = () => {
    if (pct >= 85) {
      return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25';
    }
    if (pct >= 70) {
      return 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/25';
    }
    return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25';
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStyle()}`}
      title="Physics & Surveillance Telemetry Confidence"
    >
      <ShieldCheck className="w-3 h-3" />
      <span>{pct}% Confidence</span>
    </span>
  );
};
