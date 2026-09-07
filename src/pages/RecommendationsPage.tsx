import React, { useEffect } from 'react';
import { CheckSquare, CheckCircle2, Clock, ArrowRight, ShieldCheck, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SectionHeader } from '../components/ui/SectionHeader';
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
    <div className="space-y-6">
      <SectionHeader
        title="Actionable Engineering Recommendations"
        subtitle="Prioritized operational adjustments derived from coupled digital twin physics models and expert rules."
        badge={`${recommendations.length} Action Items`}
        badgeType="amber"
      />

      <div className="space-y-4">
        {recommendations.map((rec) => {
          const isHigh = rec.priority === 'High';
          const isAccepted = rec.status === 'Accepted';

          return (
            <div
              key={rec.id}
              className={`bg-surface border rounded-xl p-5 shadow-subtle transition-all ${
                isHigh
                  ? 'border-status-crit/40 border-l-4 border-l-status-crit'
                  : 'border-border border-l-4 border-l-petroleum'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                        isHigh
                          ? 'bg-status-crit-bg text-status-crit-deep border-status-crit'
                          : 'bg-status-warn-bg text-status-warn-deep border-status-warn'
                      }`}
                    >
                      {rec.priority} Priority
                    </span>
                    <span className="text-xs text-ink-muted">·</span>
                    <span className="text-xs text-ink-secondary font-medium font-mono">{rec.category}</span>
                    <span className="text-xs text-ink-muted">·</span>
                    <span className="text-xs text-ink-muted font-mono">{rec.createdAt}</span>
                    <span className="text-xs text-ink-muted">·</span>
                    <span className="text-xs font-mono text-petroleum-deep font-semibold">
                      Confidence: {rec.confidence}%
                    </span>
                  </div>

                  <h2 className="font-heading text-base font-semibold text-ink mt-2">
                    {rec.title}
                  </h2>

                  <p className="text-xs text-ink leading-relaxed mt-1 font-medium max-w-3xl">
                    <strong className="text-ink-secondary">Action:</strong> {rec.action}
                  </p>

                  <p className="text-xs text-ink-secondary leading-relaxed mt-1 max-w-3xl">
                    <strong className="text-ink-muted">Engineering Rationale:</strong> {rec.reason}
                  </p>
                </div>

                {/* Status & Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-start">
                  {rec.status === 'Open' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => updateStatus(rec.id, 'Accepted')}
                        className="h-8 px-3 rounded-lg bg-surface border border-petroleum text-petroleum-deep hover:bg-petroleum-tint text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept Plan</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCreateWorkOrder(rec.title)}
                        className="h-8 px-3 rounded-lg bg-petroleum hover:bg-petroleum-hover text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create Work Order</span>
                      </button>
                    </>
                  ) : (
                    <span className="px-2.5 py-1 rounded bg-status-green-bg text-status-green-deep border border-status-green text-xs font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{rec.status}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Supporting Evidence & Expected Impact */}
              <div className="mt-4 pt-3 border-t border-border-subtle grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10.5px] uppercase font-semibold text-ink-muted block mb-1">
                    Telemetry & Model Evidence
                  </span>
                  <ul className="space-y-1 list-disc pl-4 text-ink-secondary">
                    {rec.evidence.map((ev, idx) => (
                      <li key={idx}>{ev}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[10.5px] uppercase font-semibold text-ink-muted block mb-1">
                    Expected Thermodynamic Impact
                  </span>
                  <p className="p-2.5 bg-surface-secondary rounded-lg border border-border-subtle text-ink leading-relaxed">
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
