import { CouplingTransfer } from '../../types';
import { mockReservoirTwin } from './reservoir';
import { mockWellboreTwin } from './wellbore';
import { mockSrpTwin } from './srp';
import { mockSurfaceProductionTwin } from './surfaceProduction';
import { mockModelValidationItems, mockDigitalTwinMeshState, mockOverallModelAgreement } from './modelValidation';

export * from './reservoir';
export * from './wellbore';
export * from './srp';
export * from './surfaceProduction';
export * from './modelValidation';

export const mockCouplingTransfers: CouplingTransfer[] = [
  {
    fromTwin: 'Twin 1: Reservoir',
    toTwin: 'Twin 2: Wellbore',
    variables: [
      { name: 'Formation Temp (T_res)', value: '214.8', unit: '°C', status: 'Shift' },
      { name: 'Formation Pressure (P_res)', value: '42.6', unit: 'bar', status: 'Nominal' },
      { name: 'In-Situ Oil Viscosity (μ_o)', value: '84.0', unit: 'cP', status: 'Shift' },
      { name: 'Bitumen Mobility (k/μ)', value: '4.88', unit: 'mD/cP', status: 'Shift' },
      { name: 'Radial Inflow Potential', value: '205.0', unit: 'BOPD', status: 'Nominal' },
    ],
  },
  {
    fromTwin: 'Twin 2: Wellbore',
    toTwin: 'Twin 3: SRP',
    variables: [
      { name: 'Pump Intake Pressure (PIP)', value: '38.2', unit: 'bar', status: 'Nominal' },
      { name: 'Pump Intake Temp (PIT)', value: '184.2', unit: '°C', status: 'Nominal' },
      { name: 'Fluid Viscosity @ Intake', value: '92.0', unit: 'cP', status: 'Alert' },
      { name: 'Fluid Inflow Drawdown', value: '198.0', unit: 'BFPD', status: 'Nominal' },
      { name: 'Gas Void Fraction (α_g)', value: '14.2', unit: '%', status: 'Nominal' },
    ],
  },
  {
    fromTwin: 'Twin 3: SRP',
    toTwin: 'Twin 4: Surface',
    variables: [
      { name: 'Pump Displacement Capacity', value: '205.0', unit: 'BOPD', status: 'Nominal' },
      { name: 'Pump Volumetric Efficiency', value: '84.6', unit: '%', status: 'Alert' },
      { name: 'Fluid Pound Inception Depth', value: '2.80', unit: 'm', status: 'Alert' },
      { name: 'Polished Rod Peak Load', value: '88.4', unit: 'kN', status: 'Alert' },
      { name: 'Gross Liquid Delivery', value: '320.0', unit: 'BFPD', status: 'Nominal' },
    ],
  },
];

export const mockCoupledDigitalTwinData = {
  reservoir: mockReservoirTwin,
  wellbore: mockWellboreTwin,
  srp: mockSrpTwin,
  surface: mockSurfaceProductionTwin,
  couplings: mockCouplingTransfers,
  validation: mockModelValidationItems,
  mesh: mockDigitalTwinMeshState,
  agreement: mockOverallModelAgreement,
};
