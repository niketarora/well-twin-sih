import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Download, Filter, Maximize2, Minimize2, Sliders } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { DataProvenanceBadge } from '../components/ui/DataProvenanceBadge';
import { Sparkline } from '../components/ui/Sparkline';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { telemetryService } from '../services';
import { SubsystemParameterGroup } from '../types';

export const WellStatePage: React.FC = () => {
  const [groups, setGroups] = useState<SubsystemParameterGroup[]>([]);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    reservoir: true,
    production: true,
    operating: false,
    css: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    telemetryService.getParameterGroups().then((data) => {
      setGroups(data);
      setLoading(false);
    });
  }, []);

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const allOpen: Record<string, boolean> = {};
    groups.forEach((g) => {
      allOpen[g.id] = true;
    });
    setOpenGroups(allOpen);
  };

  const collapseAll = () => {
    setOpenGroups({});
  };

  // Sparkline data generator for parameter rows
  const getSparklineData = (key: string, dir: string) => {
    if (key === 'bht') return [215.8, 215.6, 215.5, 215.3, 215.2, 215.0, 214.9, 214.8];
    if (key === 'bhfp') return [42.4, 42.5, 42.6, 42.5, 42.7, 42.6, 42.6, 42.6];
    if (key === 'visc') return [80.5, 81.2, 81.8, 82.4, 82.9, 83.4, 83.8, 84.0];
    if (key === 'netOil') return [186.1, 187.4, 186.8, 188.2, 187.0, 186.2, 185.4, 184.2];
    if (key === 'liquid') return [321.4, 320.8, 321.0, 320.6, 320.2, 320.4, 320.1, 320.0];
    if (key === 'water') return [135.1, 135.3, 135.4, 135.6, 135.5, 135.7, 135.8, 135.8];
    if (dir === 'good') return [10, 11, 13, 14, 16, 17, 18, 19];
    if (dir === 'bad') return [90, 89, 88, 87, 86, 85, 84.8, 84.6];
    return [50, 50.1, 49.9, 50.0, 50.2, 50.1, 50.0, 50.0];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="table" rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Well State Parameter Matrix"
        subtitle="Engineering parameters grouped by subsurface and surface subsystems, mapped continuously against normal design envelopes."
        actions={
          <>
            <button
              type="button"
              onClick={expandAll}
              className="h-8 px-3 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-ink text-xs font-medium transition-colors shadow-subtle"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="h-8 px-3 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-ink text-xs font-medium transition-colors shadow-subtle"
            >
              Collapse All
            </button>
            <button
              type="button"
              onClick={() => alert('Exporting complete Well State matrix (.csv)...')}
              className="h-8 px-3.5 rounded-lg bg-petroleum hover:bg-petroleum-hover text-white text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </>
        }
      />

      {/* Top Parameter Summary Strip */}
      <div className="bg-surface border border-border rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 shadow-subtle">
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-semibold text-ink-muted">Bottomhole Temp</span>
            <DataProvenanceBadge type="OBSERVED" size="sm" />
          </div>
          <span className="font-mono text-xl font-bold text-ink mt-1">
            214.8 <span className="text-xs text-ink-muted">°C</span>
          </span>
          <span className="text-[11px] text-ink-muted">Thermal front ~18.4 m</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-semibold text-ink-muted">In-Situ Viscosity</span>
            <DataProvenanceBadge type="ESTIMATED" size="sm" />
          </div>
          <span className="font-mono text-xl font-bold text-status-warn mt-1">
            84.0 <span className="text-xs text-ink-muted">cP</span>
          </span>
          <span className="text-[11px] text-ink-muted">Cold baseline 8,500 cP</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-semibold text-ink-muted">Cycle 4 Net Yield</span>
            <DataProvenanceBadge type="ACTUAL" size="sm" />
          </div>
          <span className="font-mono text-xl font-bold text-ink mt-1">
            184.2 <span className="text-xs text-ink-muted">BOPD</span>
          </span>
          <span className="text-[11px] text-ink-muted">WC 42.4 % · GOR 14.8 Sm³/m³</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-semibold text-ink-muted">Instantaneous OSR</span>
            <DataProvenanceBadge type="ESTIMATED" size="sm" />
          </div>
          <span className="font-mono text-xl font-bold text-status-green mt-1">
            0.39 <span className="text-xs text-ink-muted">m³/t</span>
          </span>
          <span className="text-[11px] text-ink-muted">+0.21 above economic floor</span>
        </div>
      </div>

      {/* Subsystem Parameter Matrix Tables */}
      <div className="space-y-3.5">
        {groups.map((group) => {
          const isOpen = !!openGroups[group.id];
          return (
            <section
              key={group.id}
              className="bg-surface border border-border rounded-xl shadow-subtle overflow-hidden transition-all"
            >
              {/* Expandable Group Header */}
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between px-5 py-3 bg-surface hover:bg-surface-secondary/70 transition-colors border-b border-border text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-ink-muted">
                    {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </span>
                  <div>
                    <span className="font-heading font-semibold text-sm text-ink mr-3">
                      {group.title}
                    </span>
                    <span className="text-xs text-ink-muted hidden sm:inline">
                      {group.context}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-ink-muted hidden md:inline">
                    {group.rows.length} parameters
                  </span>
                  <StatusBadge status={group.status} />
                </div>
              </button>

              {/* High-Density Parameter Table */}
              {isOpen && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-surface-secondary text-ink-secondary font-semibold text-[10.5px] uppercase tracking-wider border-b border-border">
                        <th className="py-2.5 px-5">Parameter & Sensor Source</th>
                        <th className="py-2.5 px-4 text-right">Value</th>
                        <th className="py-2.5 px-3">Unit</th>
                        <th className="py-2.5 px-4">Normal Design Range</th>
                        <th className="py-2.5 px-4">Trend (6h)</th>
                        <th className="py-2.5 px-5">State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {group.rows.map((row) => (
                        <tr
                          key={row.key}
                          className="hover:bg-canvas-subtle transition-colors"
                        >
                          <td className="py-2.5 px-5">
                            <div className="font-medium text-ink">{row.name}</div>
                            <div className="text-[11px] text-ink-muted mt-0.5">{row.sub}</div>
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-semibold text-sm text-ink whitespace-nowrap">
                            {row.value}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-ink-muted text-[11px] whitespace-nowrap">
                            {row.unit}
                          </td>
                          <td className="py-2.5 px-4 font-mono text-ink-secondary text-[11px] whitespace-nowrap">
                            {row.range}
                          </td>
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-2">
                              <Sparkline
                                data={getSparklineData(row.key, row.dir)}
                                color={
                                  row.dir === 'bad'
                                    ? 'var(--status-crit)'
                                    : row.dir === 'good'
                                    ? 'var(--status-green)'
                                    : 'var(--ink-muted)'
                                }
                              />
                              <span
                                className={`font-mono text-[11px] whitespace-nowrap ${
                                  row.dir === 'bad'
                                    ? 'text-status-crit font-semibold'
                                    : row.dir === 'good'
                                    ? 'text-status-green font-semibold'
                                    : 'text-ink-muted'
                                }`}
                              >
                                {row.delta}
                              </span>
                            </div>
                          </td>
                          <td className="py-2.5 px-5">
                            <StatusBadge status={row.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
