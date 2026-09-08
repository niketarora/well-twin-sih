import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AiEvidence } from '../types/ai';
import { DataProvenanceBadge } from '../../../components/ui/DataProvenanceBadge';

interface EvidenceListProps {
  evidence?: AiEvidence[];
}

export const EvidenceList: React.FC<EvidenceListProps> = ({ evidence }) => {
  if (!evidence || evidence.length === 0) return null;

  return (
    <div className="space-y-1.5 pt-2 border-t border-border/60">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted block">
        Physical Telemetry & Model Evidence:
      </span>
      <div className="grid grid-cols-1 gap-1.5">
        {evidence.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-1.5 rounded-md bg-surface-secondary/70 border border-border/70 text-xs"
          >
            <div className="flex items-center gap-1.5 min-w-0 pr-2">
              {item.trend === 'up' && <TrendingUp className="w-3 h-3 text-status-warn shrink-0" />}
              {item.trend === 'down' && <TrendingDown className="w-3 h-3 text-status-crit shrink-0" />}
              {item.trend === 'stable' && <Minus className="w-3 h-3 text-emerald-500 shrink-0" />}
              <span className="font-medium text-ink truncate text-[11px]">{item.label}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="font-mono font-bold text-ink text-[11px]">
                {item.value} {item.unit || ''}
              </span>
              <DataProvenanceBadge
                type={
                  item.provenance === 'OBSERVED'
                    ? 'OBSERVED'
                    : item.provenance === 'ACTUAL'
                    ? 'ACTUAL'
                    : item.provenance === 'MODEL_DERIVED'
                    ? 'MODEL PREDICTION'
                    : 'SYNTHETIC'
                }
                size="sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
