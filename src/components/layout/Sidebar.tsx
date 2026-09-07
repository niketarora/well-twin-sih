import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  Layers,
  Activity,
  LineChart,
  Flame,
  AlertTriangle,
  Lightbulb,
  Radar,
  Wrench,
  GitCommit,
  CheckSquare,
  FileSpreadsheet,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  Sliders,
  Scale,
} from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useAlertStore } from '../../stores/useAlertStore';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const { alerts } = useAlertStore();
  const location = useLocation();

  const activeAlertCount = alerts.filter((a) => a.status === 'active').length || 3;

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    MONITORING: true,
    'DIGITAL TWIN': true,
    INTELLIGENCE: true,
    FIELD: true,
    OPERATIONS: true,
  });

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const navSections: NavSection[] = [
    {
      label: 'MONITORING',
      items: [
        { id: 'overview', label: 'Overview', path: '/overview', icon: LayoutDashboard },
        { id: 'well-state', label: 'Well State', path: '/well-state', icon: Sliders },
        { id: 'srp-pump', label: 'SRP / Pump Diagnostics', path: '/srp-pump', icon: Activity },
        { id: 'trends', label: 'Trends & Analytics', path: '/trends', icon: LineChart },
        { id: 'css-cycle', label: 'CSS Cycle Tracker', path: '/css-cycle', icon: Flame },
        { id: 'alerts', label: 'Operational Alerts', path: '/alerts', icon: AlertTriangle, badge: activeAlertCount },
      ],
    },
    {
      label: 'DIGITAL TWIN',
      items: [
        { id: 'digital-twin', label: 'Twin Overview', path: '/digital-twin', icon: Cpu },
        { id: 'reservoir', label: 'Reservoir / Thermal', path: '/reservoir', icon: Flame },
        { id: 'wellbore', label: 'Wellbore Hydraulics', path: '/wellbore', icon: Layers },
        { id: 'surface-production', label: 'Surface Production', path: '/surface-production', icon: Activity },
        { id: 'model-comparison', label: 'Model Validation', path: '/model-comparison', icon: Scale },
      ],
    },
    {
      label: 'INTELLIGENCE',
      items: [
        { id: 'ai-insights', label: 'AI Insights & Physics', path: '/ai-insights', icon: Lightbulb },
        { id: 'anomalies', label: 'Subsurface Anomalies', path: '/anomalies', icon: Radar },
      ],
    },
    {
      label: 'FIELD',
      items: [
        { id: 'equipment', label: 'Equipment Health', path: '/equipment', icon: Wrench },
        { id: 'well-diagram', label: 'Wellbore Diagram', path: '/well-diagram', icon: GitCommit },
      ],
    },
    {
      label: 'OPERATIONS',
      items: [
        { id: 'recommendations', label: 'Recommendations', path: '/recommendations', icon: CheckSquare },
        { id: 'work-orders', label: 'Work Orders', path: '/work-orders', icon: FileSpreadsheet },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {!sidebarCollapsed && (
        <div
          onClick={() => setSidebarCollapsed(true)}
          className="fixed inset-0 z-30 bg-ink/30 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen bg-surface border-r border-border flex flex-col transition-all duration-200 shrink-0 select-none ${
          sidebarCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-[60px]' : 'w-[245px] translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-[58px] px-4 border-b border-border flex items-center gap-2.5">
          <div className="w-7 h-7 rounded border border-petroleum bg-surface flex items-center justify-center font-heading font-bold text-xs text-petroleum-deep shrink-0 shadow-sm">
            W
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col leading-tight overflow-hidden">
              <span className="font-heading font-bold text-xs tracking-wider text-ink">
                WELL TWIN
              </span>
              <span className="text-[10px] tracking-wider uppercase text-ink-muted">
                Decision Support
              </span>
            </div>
          )}
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto py-2">
          {navSections.map((section) => {
            const isOpen = expandedSections[section.label] !== false;
            return (
              <div key={section.label} className="mb-2">
                {!sidebarCollapsed ? (
                  <button
                    type="button"
                    onClick={() => toggleSection(section.label)}
                    className="w-full flex items-center justify-between px-4 py-1.5 text-[10px] font-semibold tracking-wider text-ink-muted hover:text-ink uppercase transition-colors"
                  >
                    <span>{section.label}</span>
                    {isOpen ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>
                ) : (
                  <div className="h-px bg-border-subtle my-2 mx-2" />
                )}

                {(isOpen || sidebarCollapsed) && (
                  <div className="flex flex-col">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        location.pathname === item.path ||
                        (item.path === '/overview' && location.pathname === '/');

                      return (
                        <NavLink
                          key={item.id}
                          to={item.path}
                          title={item.label}
                          className={`flex items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors relative ${
                            isActive
                              ? 'bg-surface-secondary text-ink font-semibold'
                              : 'text-ink-secondary hover:bg-surface-secondary/60 hover:text-ink'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Active indicator amber bar */}
                            {isActive && (
                              <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-petroleum rounded-r" />
                            )}
                            <Icon
                              className={`w-4 h-4 shrink-0 ${
                                isActive ? 'text-petroleum-deep' : 'text-ink-muted'
                              }`}
                            />
                            {!sidebarCollapsed && (
                              <span className="truncate">{item.label}</span>
                            )}
                          </div>

                          {!sidebarCollapsed && item.badge !== undefined && (
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-status-crit text-white shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer User Info */}
        {!sidebarCollapsed && (
          <div className="p-3 border-t border-border flex items-center gap-2.5 bg-surface-secondary/40 text-xs">
            <div className="w-6 h-6 rounded bg-surface border border-border flex items-center justify-center font-mono text-[10px] font-semibold text-ink-secondary shrink-0">
              RV
            </div>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="font-medium text-ink truncate">Rajesh Verma</span>
              <span className="text-[10px] text-ink-muted truncate">On-duty · Petroleum Eng.</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
