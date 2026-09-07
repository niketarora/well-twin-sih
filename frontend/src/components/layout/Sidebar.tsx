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
  Sliders,
  Scale,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useAlertStore } from '../../stores/useAlertStore';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  accent?: boolean;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, setSidebarCollapsed, toggleSidebar } = useUIStore();
  const { alerts } = useAlertStore();
  const location = useLocation();

  const activeAlertCount = alerts.filter((a) => a.status === 'active').length || 3;

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    MONITORING: true,
    'DIGITAL TWIN': true,
    INTELLIGENCE: true,
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
        { id: 'trends', label: 'Trends & Analytics', path: '/trends', icon: LineChart },
        { id: 'css-cycle', label: 'CSS Cycle Tracker', path: '/css-cycle', icon: Flame },
        { id: 'alerts', label: 'Operational Alerts', path: '/alerts', icon: AlertTriangle, badge: activeAlertCount },
      ],
    },
    {
      label: 'DIGITAL TWIN',
      items: [
        { id: 'digital-twin', label: 'Twin Overview', path: '/digital-twin', icon: Cpu, accent: true },
        { id: 'reservoir', label: 'Reservoir / Thermal', path: '/reservoir', icon: Flame },
        { id: 'wellbore', label: 'Wellbore Hydrodynamics', path: '/wellbore', icon: Layers },
        { id: 'srp-pump', label: 'SRP Lift Dynamics', path: '/srp-pump', icon: Activity },
        { id: 'surface-production', label: 'Surface Production', path: '/surface-production', icon: Sliders },
        { id: 'well-diagram', label: 'Wellbore Schematic', path: '/well-diagram', icon: GitCommit },
        { id: 'model-comparison', label: 'Model Validation', path: '/model-comparison', icon: Scale },
      ],
    },
    {
      label: 'INTELLIGENCE',
      items: [
        { id: 'ai-insights', label: 'AI Insights', path: '/ai-insights', icon: Lightbulb },
        { id: 'anomalies', label: 'Anomalies & Attribution', path: '/anomalies', icon: Radar },
      ],
    },
    {
      label: 'OPERATIONS',
      items: [
        { id: 'equipment', label: 'Equipment Health', path: '/equipment', icon: Wrench },
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
          sidebarCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-[60px]' : 'w-[250px] translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-[58px] px-3.5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded border border-petroleum bg-surface flex items-center justify-center font-heading font-bold text-xs text-petroleum shrink-0 shadow-sm">
              W
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col leading-tight overflow-hidden">
                <span className="font-heading font-bold text-xs tracking-wider text-ink">
                  WELL TWIN
                </span>
                <span className="text-[9.5px] tracking-wider uppercase text-ink-muted truncate">
                  Engineering Workstation
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={toggleSidebar}
            className="hidden lg:flex p-1 rounded hover:bg-surface-secondary text-ink-muted hover:text-ink transition-colors"
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
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
                    className="w-full flex items-center justify-between px-3.5 py-1.5 text-[9.5px] font-semibold tracking-wider text-ink-muted hover:text-ink uppercase transition-colors"
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
                            {/* Active indicator amber/cyan bar */}
                            {isActive && (
                              <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-petroleum rounded-r" />
                            )}
                            <Icon
                              className={`w-4 h-4 shrink-0 ${
                                isActive ? 'text-petroleum' : 'text-ink-muted'
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
