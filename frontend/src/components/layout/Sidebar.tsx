import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map,
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
import oilIndiaLogo from '../../oilinidailogo.jpeg';

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
        { id: 'gov-portal', label: 'Gov Portal / SIH', path: '/landing', icon: Map },
        { id: 'field-map', label: 'Field Map', path: '/field-map', icon: Sliders },
        { id: 'overview', label: 'Overview Command', path: '/overview', icon: LayoutDashboard },
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
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarCollapsed(true)}
            className="fixed inset-0 z-30 bg-ink/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen bg-surface border-r border-border flex flex-col transition-all duration-300 ease-in-out shrink-0 select-none ${
          sidebarCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-[64px]' : 'w-[260px] translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-[58px] px-3.5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-lg border border-border bg-white flex items-center justify-center p-0.5 shrink-0 shadow-2xs"
            >
              <img src={oilIndiaLogo} alt="Oil India Limited" className="w-full h-full object-contain" />
            </motion.div>
            {!sidebarCollapsed && (
              <div className="flex flex-col leading-tight overflow-hidden">
                <span className="font-heading font-black text-xs tracking-widest text-ink">
                  WELL TWIN
                </span>
                <span className="text-[9px] font-bold tracking-wider uppercase text-petroleum truncate">
                  Engineering Workstation
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={toggleSidebar}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-surface-secondary text-ink-muted hover:text-ink transition-colors"
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
        <div className="flex-1 overflow-y-auto py-3 px-1.5 space-y-1">
          {navSections.map((section) => {
            const isOpen = expandedSections[section.label] !== false;
            return (
              <div key={section.label} className="mb-2">
                {!sidebarCollapsed ? (
                  <button
                    type="button"
                    onClick={() => toggleSection(section.label)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-[10px] tracking-widest uppercase transition-colors group"
                  >
                    <span className="font-heading font-black text-ink-muted group-hover:text-ink flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-petroleum inline-block shadow-xs" />
                      <span>{section.label}</span>
                    </span>
                    <motion.div animate={{ rotate: isOpen ? 0 : -90 }} transition={{ duration: 0.15 }}>
                      <ChevronDown className="w-3 h-3 text-ink-muted group-hover:text-ink" />
                    </motion.div>
                  </button>
                ) : (
                  <div className="h-px bg-border-subtle my-2 mx-2" />
                )}

                <AnimatePresence initial={false}>
                  {(isOpen || sidebarCollapsed) && (
                    <motion.div
                      initial={sidebarCollapsed ? false : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={sidebarCollapsed ? undefined : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col space-y-0.5"
                    >
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        
                        const isFieldMap = item.path === '/';
                        let isActive = false;
                        if (isFieldMap) {
                          isActive = location.pathname === '/';
                        } else if (item.path === '/overview') {
                          isActive =
                            location.pathname === '/overview' ||
                            location.pathname.endsWith('/overview') ||
                            (/^\/well\/[^/]+$/.test(location.pathname));
                        } else {
                          const sectionKey = item.path.replace('/', '');
                          isActive =
                            location.pathname === item.path ||
                            location.pathname.includes(`/${sectionKey}`);
                        }

                        return (
                          <NavLink
                            key={item.id}
                            to={item.path}
                            title={item.label}
                            className={`group relative flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                              isActive
                                ? 'text-ink font-semibold bg-surface-secondary shadow-xs border border-border/80'
                                : 'text-ink-secondary hover:bg-surface-secondary/70 hover:text-ink'
                            }`}
                          >
                            {/* Animated Active Indicator */}
                            {isActive && (
                              <motion.div
                                layoutId="sidebar-active-pill"
                                className="absolute left-0 top-1 bottom-1 w-[3px] bg-petroleum rounded-r-full shadow-xs"
                                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                              />
                            )}

                            <div className="flex items-center gap-2.5 min-w-0">
                              <Icon
                                className={`w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-110 ${
                                  isActive ? 'text-petroleum' : 'text-ink-muted group-hover:text-ink'
                                }`}
                              />
                              {!sidebarCollapsed && (
                                <span className="truncate">{item.label}</span>
                              )}
                            </div>

                            {!sidebarCollapsed && item.badge !== undefined && (
                              <motion.span
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-status-crit text-white shrink-0 shadow-xs"
                              >
                                {item.badge}
                              </motion.span>
                            )}
                          </NavLink>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Footer User Info */}
        {!sidebarCollapsed && (
          <div className="p-3 border-t border-border flex items-center gap-2.5 bg-surface-secondary/40 text-xs">
            <div className="w-7 h-7 rounded-full bg-petroleum/15 border border-petroleum/30 flex items-center justify-center font-mono text-[11px] font-bold text-petroleum shrink-0 shadow-2xs">
              RV
            </div>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="font-semibold text-ink truncate">Rajesh Verma</span>
              <span className="text-[10px] text-ink-muted truncate">On-duty · Petroleum Eng.</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

