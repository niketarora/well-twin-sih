export type ParameterStatus = 'Normal' | 'Watch' | 'Warning' | 'Critical' | 'Locked' | 'Stable' | 'Healthy' | 'Optimal';

export interface TelemetryReading {
  timestamp: string;
  netOilRate: number; // BOPD
  grossLiquidRate: number; // BFPD
  producedWaterRate: number; // BWPD
  waterCut: number; // %
  steamInjectionRate: number; // tonnes/day
  bottomholeTemperature: number; // °C
  bottomholePressure: number; // bar
  inSituViscosity: number; // cP
  pumpFillage: number; // %
  strokeRate: number; // SPM
  motorPower: number; // kW
  gearboxTorque: number; // % rating
  peakRodLoad: number; // kN
  minRodLoad: number; // kN
  tubingHeadPressure: number; // bar
  casingHeadPressure: number; // bar
  flowlineTemperature: number; // °C
  oilSteamRatio: number; // m3/tonne
  chokeOrifice: string; // inch
}

export interface KpiCardData {
  id: string;
  label: string;
  value: string | number;
  unit: string;
  arrow?: '↑' | '↓' | '→';
  delta?: string;
  deltaNote?: string;
  deltaColor?: string;
  range: string;
  status: ParameterStatus;
  attention?: boolean;
}

export interface ParameterRow {
  key: string;
  name: string;
  sub: string;
  value: string | number;
  unit: string;
  range: string;
  delta: string;
  dir: 'good' | 'bad' | 'flat';
  status: ParameterStatus;
  seriesKey?: string;
}

export interface SubsystemParameterGroup {
  id: string;
  title: string;
  context: string;
  status: ParameterStatus;
  tagBlock: string;
  rows: ParameterRow[];
}
