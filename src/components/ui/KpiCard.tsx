import React from 'react';
import { KpiCardData } from '../../types';

interface KpiCardProps {
  kpi: KpiCardData;
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ kpi, className = '' }) => {
  return (
    <div
      className={`bg-surface rounded-xl p-4 transition-all duration-150 border ${
        kpi.attention
          ? 'border-status-crit/40 border-l-[3px] border-l-status-crit shadow-sm'
          : 'border-border hover:border-border-hover hover:shadow-card'
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold tracking-wider uppercase text-ink-secondary">
          {kpi.label}
        </span>
        {kpi.attention && (
          <span className="w-1.5 h-1.5 rounded-full bg-status-crit animate-pulse"></span>
        )}
      </div>

      <div className="flex items-baseline gap-1 mt-3">
        <span className="font-mono text-[28px] font-medium tracking-tight text-ink leading-none">
          {kpi.value}
        </span>
        <span className="font-mono text-xs text-ink-muted tracking-normal">
          {kpi.unit}
        </span>
      </div>

      {kpi.delta && (
        <div className="flex items-center gap-1.5 mt-2.5 font-mono text-xs">
          <span
            className={
              kpi.attention
                ? 'text-status-crit font-medium'
                : kpi.arrow === '↓' && kpi.id === 'bht'
                ? 'text-status-warn-deep'
                : 'text-ink-muted'
            }
          >
            {kpi.arrow} {kpi.delta}
          </span>
          {kpi.deltaNote && (
            <span className="font-sans text-[11px] text-ink-muted">
              {kpi.deltaNote}
            </span>
          )}
        </div>
      )}

      <div className="border-t border-border-subtle mt-3 pt-2.5 text-[11px] text-ink-muted flex items-center justify-between">
        <span>{kpi.range}</span>
        {kpi.status && (
          <span
            className={`text-[10px] font-medium uppercase ${
              kpi.status === 'Critical'
                ? 'text-status-crit'
                : kpi.status === 'Watch'
                ? 'text-status-warn'
                : 'text-status-green'
            }`}
          >
            {kpi.status}
          </span>
        )}
      </div>
    </div>
  );
};
