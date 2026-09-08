import React from 'react';
import { DataSufficiency } from '../types/ai';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface DataSufficiencyNoticeProps {
  dataSufficiency: DataSufficiency;
}

export const DataSufficiencyNotice: React.FC<DataSufficiencyNoticeProps> = ({ dataSufficiency }) => {
  if (!dataSufficiency) return null;

  const isInsufficient = !dataSufficiency.isSufficient;

  return (
    <div
      className={`mt-2.5 p-3 rounded-lg border text-xs ${
        isInsufficient
          ? 'bg-amber-500/10 border-amber-500/25 text-ink'
          : 'bg-emerald-500/10 border-emerald-500/25 text-ink'
      }`}
    >
      <div className="flex items-center gap-2 mb-2 font-medium">
        {isInsufficient ? (
          <>
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="font-heading font-semibold text-[11px] text-amber-700 dark:text-amber-300 uppercase tracking-wider">
              Data Sufficiency Notice (Hallucination Prevention)
            </span>
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-heading font-semibold text-[11px] text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
              Surveillance Data Complete
            </span>
          </>
        )}
      </div>

      <div className="space-y-1.5 text-[11px]">
        {dataSufficiency.availableMetrics.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-ink-muted text-[10px] uppercase font-semibold">Available:</span>
            {dataSufficiency.availableMetrics.map((m, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono border border-emerald-500/30"
              >
                {m}
              </span>
            ))}
          </div>
        )}

        {dataSufficiency.missingMetrics.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-ink-muted text-[10px] uppercase font-semibold">Missing / Required:</span>
            {dataSufficiency.missingMetrics.map((m, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[10px] font-mono border border-amber-500/30"
              >
                {m}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
