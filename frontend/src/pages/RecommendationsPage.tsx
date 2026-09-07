import React, { useEffect } from 'react';
import { CheckSquare, CheckCircle2, Clock, ArrowRight, ShieldCheck, Plus, AlertTriangle, Lightbulb, FileSpreadsheet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SectionHeader } from '../components/ui/SectionHeader';
import { DataProvenanceBadge } from '../components/ui/DataProvenanceBadge';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { useRecommendationStore } from '../stores/useRecommendationStore';
import { useUIStore } from '../stores/useUIStore';

export const RecommendationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { recommendations, isLoading, loadRecommendations, updateStatus } = useRecommendationStore();
  const { setCreateWorkOrderModalOpen } = useUIStore();

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  const handleCreateWorkOrder = (recTitle: string) => {
    navigate('/work-orders');
    setCreateWorkOrderModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="card" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Actionable Engineering Recommendations"
        subtitle="Prescriptive operational adjustments derived from coupled digital twin physics models and petroleum engineering heuristics."
        badge={`${recommendations.length} Action Items`}
        badgeType="amber"
      />

      {/* Visual Operational Workflow Pipeline */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-ink-muted uppercase font-sans text-[10px] font-bold">Operational Workflow:</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap text-ink">
          <span className="flex items-center gap-1 text-status-crit font-semibold bg-status-crit-bg px-2 py-0.5 rounded border border-status-crit/30">
            <AlertTriangle className="w-3 h-3" /> Alert
          </span>
          <span className="text-ink-muted">→</span>
          <span className="flex items-center gap-1 text-petroleum font-semibold bg-petroleum-tint px-2 py-0.5 rounded border border-petroleum/30">
            <Lightbulb className="w-3 h-3" /> Engineering Insight
          </span>
          <span className="text-ink-muted">→</span>
          <span className="flex items-center gap-1 text-status-warn font-semibold bg-status-warn-bg px-2 py-0.5 rounded border border-status-warn/30">
            <CheckSquare className="w-3 h-3" /> Recommendation (Active)
          </span>
          <span className="text-ink-muted">→</span>
          <span className="flex items-center gap-1 text-status-green font-semibold bg-status-green-bg px-2 py-0.5 rounded border border-status-green/30">
            <FileSpreadsheet className="w-3 h-3" /> Work Order
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => {
          const isHigh = rec.priority === 'High';

          return (
            <div
              key={rec.id}
              className={`bg-surface border rounded-xl p-5 shadow-subtle transition-all ${
                isHigh
                  ? 'border-status-crit/40 border-l-4 border-l-status-crit'
                  : 'border-border border-l-4 border-l-petroleum'
              }`}
            >
              {/* Header & Badges */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        isHigh
                          ? 'bg-status-crit-bg text-status-crit border-status-crit/40'
                          : 'bg-status-warn-bg text-status-warn border-status-warn/40'
                      }`}
                    >
                      {rec.priority} Priority
                    </span>
                    <span className="text-xs text-ink-muted">·</span>
                    <span className="text-xs text-ink-secondary font-mono font-semibold">{rec.category}</span>
                    <span className="text-xs text-ink-muted">·</span>
                    <span className="text-xs text-ink-muted font-mono">{rec.createdAt}</span>
                    <span className="text-xs text-ink-muted">·</span>
                    <span className="text-xs font-mono text-petroleum font-bold">
                      Confidence: {rec.confidence}%
                    </span>
                    <DataProvenanceBadge type="MODEL PREDICTION" size="sm" />
                  </div>

                  {/* 1. Issue */}
                  <h2 className="font-heading text-base font-bold text-ink mt-2">
                    Issue: {rec.title}
                  </h2>

                  {/* 2. Suggested Action */}
                  <p className="text-xs text-ink leading-relaxed mt-1 font-medium max-w-3xl">
                    <strong className="text-petroleum uppercase font-semibold text-[10.5px]">Suggested Action:</strong> {rec.action}
                  </p>

                  {/* 3. Likely Cause */}
                  <p className="text-xs text-ink-secondary leading-relaxed mt-1 max-w-3xl">
                    <strong className="text-ink-muted uppercase font-semibold text-[10.5px]">Likely Cause:</strong> {rec.reason}
                  </p>
                </div>

                {/* Status & Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-start">
                  {rec.status === 'Open' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => updateStatus(rec.id, 'Accepted')}
                        className="h-8 px-3 rounded-lg bg-surface border border-petroleum text-petroleum hover:bg-petroleum-tint text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCreateWorkOrder(rec.title)}
                        className="h-8 px-3 rounded-lg bg-petroleum hover:bg-petroleum-hover text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Dispatch Work Order</span>
                      </button>
                    </>
                  ) : (
                    <span className="px-2.5 py-1 rounded bg-status-green-bg text-status-green border border-status-green/40 text-xs font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{rec.status}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* 4. Evidence & 5. Expected Impact Grid */}
              <div className="mt-4 pt-3 border-t border-border-subtle grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-ink-muted block mb-1 tracking-wider">
                    Supporting Physical Evidence
                  </span>
                  <ul className="space-y-1 list-disc pl-4 text-ink font-mono text-[11px]">
                    {rec.evidence.map((ev, idx) => (
                      <li key={idx}>{ev}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-ink-muted block mb-1 tracking-wider">
                    Expected Thermodynamic & Mechanical Impact
                  </span>
                  <p className="p-2.5 bg-surface-secondary rounded-lg border border-border-subtle text-ink leading-relaxed font-sans">
                    {rec.expectedImpact}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
