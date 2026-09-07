export interface NavigationTarget {
  id: string;
  name: string;
  pattern: string;
  description: string;
}

export const navigationRegistry: Record<string, NavigationTarget> = {
  home: {
    id: 'home',
    name: 'Baghewala Field Map',
    pattern: '/',
    description: 'Field-level GIS map, well selector, and asset surveillance overview',
  },
  overview: {
    id: 'overview',
    name: 'Well Command Center',
    pattern: '/well/:wellId/overview',
    description: 'Well-level surveillance, KPIs, health score, cause chain, and operational log',
  },
  reservoir: {
    id: 'reservoir',
    name: 'Reservoir / Thermal Domain',
    pattern: '/well/:wellId/reservoir',
    description: 'Sandface temperature, steam chamber drainage radius, in-situ viscosity, and thermal decay',
  },
  wellbore: {
    id: 'wellbore',
    name: 'Wellbore Hydrodynamics',
    pattern: '/well/:wellId/wellbore',
    description: 'Inflow hydraulics, pump intake pressure, flowing gradient, and multiphase holdup',
  },
  srp: {
    id: 'srp',
    name: 'SRP Lift Dynamics',
    pattern: '/well/:wellId/srp-pump',
    description: 'Surface and downhole dyno cards, pump barrel fillage, polished rod stress, and fluid pound',
  },
  production: {
    id: 'production',
    name: 'Surface Production',
    pattern: '/well/:wellId/surface-production',
    description: 'Coriolis skid measurements, gross liquid/net oil rates, water cut, and header backpressure',
  },
  digitalTwin: {
    id: 'digitalTwin',
    name: 'Twin Overview',
    pattern: '/well/:wellId/digital-twin',
    description: 'Coupled 4-domain digital twin architecture, subsystem scoring, and sync status',
  },
  wellState: {
    id: 'wellState',
    name: 'Well State Analytics',
    pattern: '/well/:wellId/well-state',
    description: 'Comprehensive physical state vector and operating parameter matrices',
  },
  trends: {
    id: 'trends',
    name: 'Trends & Analytics',
    pattern: '/well/:wellId/trends',
    description: 'Multi-parameter historical trends, cross-domain correlations, and time-series',
  },
  css: {
    id: 'css',
    name: 'CSS Cycle Tracker',
    pattern: '/well/:wellId/css-cycle',
    description: 'Cyclic steam stimulation phases, cumulative steam injection, and oil-steam ratio (OSR)',
  },
  alerts: {
    id: 'alerts',
    name: 'Operational Alerts',
    pattern: '/well/:wellId/alerts',
    description: 'Active alarms, engineering triage, gas interference, and thermal breakthrough alerts',
  },
  anomalies: {
    id: 'anomalies',
    name: 'Anomalies & Attribution',
    pattern: '/well/:wellId/anomalies',
    description: 'Physics-residual anomaly detection, sensor drift, and root-cause attribution',
  },
  aiInsights: {
    id: 'aiInsights',
    name: 'AI Insights',
    pattern: '/well/:wellId/ai-insights',
    description: 'Synthesized multi-physics diagnostics and automated engineering summaries',
  },
  equipment: {
    id: 'equipment',
    name: 'Equipment Health',
    pattern: '/well/:wellId/equipment',
    description: 'Sucker rod string fatigue, pumping unit gearbox, and wellhead integrity',
  },
  wellDiagram: {
    id: 'wellDiagram',
    name: 'Wellbore Schematic',
    pattern: '/well/:wellId/well-diagram',
    description: 'Downhole mechanical completion, casing strings, tubing, pump seating, and perforations',
  },
  modelComparison: {
    id: 'modelComparison',
    name: 'Model Validation',
    pattern: '/well/:wellId/model-comparison',
    description: 'Predicted vs actual reconciliation, CMG-STARS physics fidelity, and drift error',
  },
  recommendations: {
    id: 'recommendations',
    name: 'Engineering Recommendations',
    pattern: '/well/:wellId/recommendations',
    description: 'Prescriptive optimization actions, SPM adjustment, and casing venting proposals',
  },
  workOrders: {
    id: 'workOrders',
    name: 'Work Orders',
    pattern: '/well/:wellId/work-orders',
    description: 'Field execution orders, maintenance schedules, and intervention tracking',
  },
};

// Aliases for user query and model flexibility
const pageAliases: Record<string, string> = {
  pump: 'srp',
  lift: 'srp',
  'srp-pump': 'srp',
  thermal: 'reservoir',
  steam: 'css',
  'css-cycle': 'css',
  surface: 'production',
  'surface-production': 'production',
  schematic: 'wellDiagram',
  diagram: 'wellDiagram',
  'well-diagram': 'wellDiagram',
  validation: 'modelComparison',
  'model-comparison': 'modelComparison',
  field: 'home',
  map: 'home',
  alarm: 'alerts',
  anomaly: 'anomalies',
  insight: 'aiInsights',
  insights: 'aiInsights',
  'ai-insights': 'aiInsights',
  'digital-twin': 'digitalTwin',
  twin: 'digitalTwin',
  'well-state': 'wellState',
  state: 'wellState',
};

export function normalizePageKey(pageKey: string): string {
  const clean = pageKey.trim().toLowerCase().replace(/_/g, '-');
  return pageAliases[clean] || pageAliases[clean.replace(/-/g, '')] || clean;
}

export function isValidPage(pageKey: string): boolean {
  const normalized = normalizePageKey(pageKey);
  return normalized in navigationRegistry;
}

export function resolveRoute(pageKey: string, wellId?: string): string | null {
  const normalized = normalizePageKey(pageKey);
  const target = navigationRegistry[normalized];
  if (!target) return null;

  if (target.pattern === '/') {
    return '/';
  }

  const effectiveWellId = wellId || 'well-bw-017';
  return target.pattern.replace(':wellId', effectiveWellId);
}
