export interface RouteManifestEntry {
  id: string;
  label: string;
  routePattern: string;
  description: string;
  requiresWell: boolean;
}

export const WEBSITE_MANIFEST: RouteManifestEntry[] = [
  {
    id: 'field_map',
    label: 'Field Map',
    routePattern: '/',
    description: 'Baghewala Field GIS map showing all active wells and pad networks',
    requiresWell: false,
  },
  {
    id: 'overview',
    label: 'Well Overview',
    routePattern: '/well/:wellId/overview',
    description: 'Command Center overview with composite health and real-time surveillance KPIs',
    requiresWell: true,
  },
  {
    id: 'well_state',
    label: 'Well State',
    routePattern: '/well/:wellId/well-state',
    description: 'Current mechanical and thermodynamic operating state',
    requiresWell: true,
  },
  {
    id: 'trends',
    label: 'Trends & Analytics',
    routePattern: '/well/:wellId/trends',
    description: 'Historical production rates, water cut, BHT, and pressure telemetry trends',
    requiresWell: true,
  },
  {
    id: 'srp',
    label: 'SRP Lift Dynamics',
    routePattern: '/well/:wellId/srp-pump',
    description: 'Sucker rod pump dynamometer load cards, fillage efficiency, and Goodman rod stress analysis',
    requiresWell: true,
  },
  {
    id: 'reservoir',
    label: 'Reservoir / Thermal',
    routePattern: '/well/:wellId/reservoir',
    description: 'CSS steam chamber heating radius, enthalpy front, and temperature decay',
    requiresWell: true,
  },
  {
    id: 'wellbore',
    label: 'Wellbore Hydraulics',
    routePattern: '/well/:wellId/wellbore',
    description: 'In-situ heavy crude viscosity, tubing friction gradients, and sandface intake',
    requiresWell: true,
  },
  {
    id: 'production',
    label: 'Surface Production',
    routePattern: '/well/:wellId/surface-production',
    description: 'Fiscal Coriolis meter net oil extraction, separator delivery, and line pressures',
    requiresWell: true,
  },
  {
    id: 'css_cycle',
    label: 'CSS Cycle Tracker',
    routePattern: '/well/:wellId/css-cycle',
    description: 'Cyclic steam stimulation stage tracker (Injection, Soak, Production)',
    requiresWell: true,
  },
  {
    id: 'alerts',
    label: 'Operational Alerts',
    routePattern: '/alerts',
    description: 'Active SCADA alarms and physics-informed threshold triage list',
    requiresWell: false,
  },
  {
    id: 'recommendations',
    label: 'Recommendations',
    routePattern: '/recommendations',
    description: 'Engineering optimization work orders and VFD setpoint trim protocols',
    requiresWell: false,
  },
  {
    id: 'work_orders',
    label: 'Work Orders',
    routePattern: '/work-orders',
    description: 'Operational intervention dispatch and maintenance work orders',
    requiresWell: false,
  },
];

export const getManifestEntryById = (id: string): RouteManifestEntry | undefined => {
  return WEBSITE_MANIFEST.find((entry) => entry.id === id);
};

export const resolveManifestRoute = (targetId: string, wellId?: string): string => {
  const entry = getManifestEntryById(targetId);
  if (!entry) return '/';
  if (!entry.requiresWell) return entry.routePattern;

  const cleanWellId = wellId || 'well-bw-017';
  return entry.routePattern.replace(':wellId', cleanWellId);
};
