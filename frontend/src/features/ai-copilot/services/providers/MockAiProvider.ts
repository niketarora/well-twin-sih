import { AiProvider } from './AiProvider';
import { AiContext, AiResponse } from '../../types/ai';

export class MockAiProvider implements AiProvider {
  readonly id = 'mock';
  readonly name = 'Deterministic Engineering Engine';

  async generateResponse(prompt: string, context: AiContext): Promise<AiResponse> {
    const q = prompt.toLowerCase().trim();
    const currentWellCode = context.well?.code || 'BW-17';
    const currentWellId = context.well?.id || context.ui.currentWellId || 'well-bw-017';

    // 1. Navigation requests
    if (q.includes('open srp') || q.includes('show srp') || q.includes('pump') || q.includes('dyno')) {
      return {
        answer: `Navigating to Sucker Rod Pump (SRP) Lift Dynamics for ${currentWellCode}. Here you can inspect surface and downhole dynamometer cards, polished rod loading, and barrel fillage efficiency.`,
        intent: 'NAVIGATION',
        confidence: 0.98,
        actions: [
          {
            type: 'OPEN_PAGE',
            page: 'srp',
            wellId: currentWellId,
            label: `Open ${currentWellCode} SRP`,
          },
        ],
      };
    }

    if (q.includes('open reservoir') || q.includes('show reservoir') || q.includes('thermal')) {
      return {
        answer: `Navigating to Reservoir & Thermal surveillance for ${currentWellCode}. Displays sandface temperature decay, cyclic steam chamber heating radius, and in-situ viscosity response.`,
        intent: 'NAVIGATION',
        confidence: 0.98,
        actions: [
          {
            type: 'OPEN_PAGE',
            page: 'reservoir',
            wellId: currentWellId,
            label: `Open ${currentWellCode} Reservoir`,
          },
        ],
      };
    }

    if (q.includes('open overview') || q.includes('show overview') || q.includes('command center')) {
      return {
        answer: `Opening the Well Command Center Overview for ${currentWellCode}.`,
        intent: 'NAVIGATION',
        confidence: 0.99,
        actions: [
          {
            type: 'OPEN_PAGE',
            page: 'overview',
            wellId: currentWellId,
            label: `Open ${currentWellCode} Overview`,
          },
        ],
      };
    }

    if (q.includes('open field') || q.includes('field map') || q.includes('home') || q.includes('all wells')) {
      return {
        answer: 'Navigating to the Baghewala Field GIS Map and Multi-Well Surveillance view.',
        intent: 'NAVIGATION',
        confidence: 0.99,
        actions: [
          {
            type: 'OPEN_PAGE',
            page: 'home',
            wellId: currentWellId,
            label: 'Open Baghewala Field Map',
          },
        ],
      };
    }

    if (q.includes('open production') || q.includes('surface production')) {
      return {
        answer: `Navigating to Surface Production monitoring for ${currentWellCode}.`,
        intent: 'NAVIGATION',
        confidence: 0.98,
        actions: [
          {
            type: 'OPEN_PAGE',
            page: 'production',
            wellId: currentWellId,
            label: `Open ${currentWellCode} Production`,
          },
        ],
      };
    }

    if (q.includes('open alerts') || q.includes('show alerts') || q.includes('alarms')) {
      return {
        answer: `Opening Operational Alerts triage for ${currentWellCode}.`,
        intent: 'NAVIGATION',
        confidence: 0.97,
        actions: [
          {
            type: 'OPEN_PAGE',
            page: 'alerts',
            wellId: currentWellId,
            label: 'Review Active Alerts',
          },
        ],
      };
    }

    // 2. Multi-Well Comparison: "Which well needs attention?"
    if (q.includes('which well') || q.includes('needs attention') || q.includes('compare')) {
      return {
        answer: `Across the Baghewala Field, **Well BW-22** (Critical, Health 41%) and **Well BW-17** (Attention Required, Health 62%) currently require priority intervention. BW-22 suffers from severe fluid pound and high rod fatigue stress (89%). BW-17 is experiencing gas breakout at the pump intake causing pump fillage degradation to 61%. Wells BW-01 and BW-02 remain in optimal production.`,
        intent: 'COMPARISON',
        confidence: 0.95,
        evidence: [
          { label: 'BW-22 Health Score', value: 41, unit: '%', trend: 'down', provenance: 'OBSERVED' },
          { label: 'BW-22 Rod Stress', value: 89, unit: '%', trend: 'up', provenance: 'ACTUAL' },
          { label: 'BW-17 Health Score', value: 62, unit: '%', trend: 'down', provenance: 'OBSERVED' },
          { label: 'BW-17 Pump Fillage', value: 61.4, unit: '%', trend: 'down', provenance: 'ACTUAL' },
        ],
        actions: [
          {
            type: 'OPEN_PAGE',
            page: 'overview',
            wellId: 'well-bw-017',
            label: 'Inspect BW-17 Overview',
          },
          {
            type: 'OPEN_PAGE',
            page: 'overview',
            wellId: 'well-bw-022',
            label: 'Inspect BW-22 Critical State',
          },
          {
            type: 'OPEN_PAGE',
            page: 'home',
            wellId: 'well-bw-017',
            label: 'Open Field Map',
          },
        ],
      };
    }

    // 3. 4-Twin Causal Investigation: "Why is production declining?"
    if (q.includes('why') || q.includes('declining') || q.includes('investigate') || q.includes('cause')) {
      const oil = context.telemetry?.oilRate ?? 84;
      const bht = context.telemetry?.bht ?? 182;
      const fillage = context.telemetry?.fillage ?? 61.4;
      const visc = context.telemetry?.viscosity ?? 420;

      return {
        answer: `Physical cause attribution indicates that the production deficit on ${currentWellCode} (${oil} BOPD vs 100 BOPD target) is governed by coupled thermal dissipation and downhole gas interference:\n\n1. **Reservoir Cooling**: Sandface BHT has fallen to ${bht}°C (-13°C vs nominal soak curve).\n2. **Viscosity Elevation**: In-situ heavy crude viscosity elevated to ${visc} cP near the perforated sandface.\n3. **Intake Gas Breakout**: Near-wellbore drawdown below 3.8 MPa bubble-point is liberating solution gas.\n4. **Pump Fillage Restriction**: Gas interference reduces pump barrel liquid fillage to ${fillage}%, restricting net surface delivery.`,
        intent: 'INVESTIGATION',
        confidence: 0.91,
        evidence: [
          { label: 'Bottom-Hole Temp (BHT)', value: bht, unit: '°C', trend: 'down', provenance: 'OBSERVED' },
          { label: 'Estimated Viscosity', value: visc, unit: 'cP', trend: 'up', provenance: 'MODEL_DERIVED' },
          { label: 'Pump Barrel Fillage', value: fillage, unit: '%', trend: 'down', provenance: 'ACTUAL' },
          { label: 'Net Oil Extraction', value: oil, unit: 'BOPD', trend: 'down', provenance: 'OBSERVED' },
        ],
        actions: [
          {
            type: 'OPEN_PAGE',
            page: 'reservoir',
            wellId: currentWellId,
            label: 'View Reservoir Thermal Chamber',
          },
          {
            type: 'OPEN_PAGE',
            page: 'srp',
            wellId: currentWellId,
            label: 'Inspect Pump Fillage & Dyno Cards',
          },
          {
            type: 'OPEN_PAGE',
            page: 'recommendations',
            wellId: currentWellId,
            label: 'Review SPM Adjustment Work Order',
          },
        ],
      };
    }

    // 4. Specific Data Lookup: Pump fillage, BHT, production
    if (q.includes('fillage') || q.includes('pump fill')) {
      const fillage = context.telemetry?.fillage ?? 61.4;
      return {
        answer: `Current SRP barrel fillage on ${currentWellCode} is **${fillage}%** (rated as Warning/Attention). Delayed travelling valve closure indicates solution gas breakout at the slotted liner intake. Recommended setpoint is 3.8 SPM to mitigate gas lock risk.`,
        intent: 'DATA_LOOKUP',
        confidence: 0.96,
        evidence: [
          { label: 'Pump Fillage', value: fillage, unit: '%', trend: 'down', provenance: 'ACTUAL' },
          { label: 'Pumping Speed', value: context.telemetry?.spm ?? 4.8, unit: 'SPM', trend: 'stable', provenance: 'OBSERVED' },
        ],
        actions: [
          {
            type: 'OPEN_PAGE',
            page: 'srp',
            wellId: currentWellId,
            label: 'Open SRP Lift Dynamics',
          },
        ],
      };
    }

    if (q.includes('temperature') || q.includes('bht')) {
      const bht = context.telemetry?.bht ?? 182;
      return {
        answer: `Measured bottom-hole temperature (BHT) on ${currentWellCode} is **${bht}°C** at 1,180 m depth. The reading exhibits an accelerating cooling drift of -13°C relative to the nominal Cycle 4 thermal baseline.`,
        intent: 'DATA_LOOKUP',
        confidence: 0.95,
        evidence: [
          { label: 'Observed BHT', value: bht, unit: '°C', trend: 'down', provenance: 'OBSERVED' },
          { label: 'Estimated In-Situ Viscosity', value: context.telemetry?.viscosity ?? 420, unit: 'cP', trend: 'up', provenance: 'MODEL_DERIVED' },
        ],
        actions: [
          {
            type: 'OPEN_PAGE',
            page: 'reservoir',
            wellId: currentWellId,
            label: 'Open Reservoir / Thermal Page',
          },
        ],
      };
    }

    if (q.includes('production') || q.includes('oil rate') || q.includes('bopd')) {
      const oil = context.telemetry?.oilRate ?? 84;
      return {
        answer: `Current net oil production for ${currentWellCode} is **${oil} BOPD** with a water cut of ${context.telemetry?.waterCut ?? 78.2}%. Coriolis Skid 03 confirms an operating variance of -16% against the programmed allocation of 100 BOPD.`,
        intent: 'DATA_LOOKUP',
        confidence: 0.97,
        evidence: [
          { label: 'Net Oil Extraction', value: oil, unit: 'BOPD', trend: 'down', provenance: 'OBSERVED' },
          { label: 'Water Cut', value: context.telemetry?.waterCut ?? 78.2, unit: '%', trend: 'up', provenance: 'OBSERVED' },
        ],
        actions: [
          {
            type: 'OPEN_PAGE',
            page: 'production',
            wellId: currentWellId,
            label: 'View Surface Production Telemetry',
          },
        ],
      };
    }

    // 5. Default General Engineering Explanation
    return {
      answer: `Analyzing surveillance telemetry for **${currentWellCode}** (${context.well?.pad || 'Pad 03'} · ${context.well?.sector || 'Sector 4'}). The well is operating in CSS Cycle #${context.well?.cycle ?? 4} (Day ${context.well?.dayInCycle ?? 38}) in Production phase with a composite Digital Twin health score of ${context.well?.healthScore ?? 62}%. Telemetry shows stable surface pressure with gas interference noted at the pump intake.`,
      intent: 'GENERAL_ENGINEERING',
      confidence: 0.88,
      evidence: [
        { label: 'Digital Twin Health', value: context.well?.healthScore ?? 62, unit: '%', trend: 'stable', provenance: 'MODEL_DERIVED' },
        { label: 'Oil Rate', value: context.telemetry?.oilRate ?? 84, unit: 'BOPD', trend: 'stable', provenance: 'OBSERVED' },
        { label: 'Bottomhole Temp', value: context.telemetry?.bht ?? 182, unit: '°C', trend: 'down', provenance: 'OBSERVED' },
      ],
      actions: [
        {
          type: 'OPEN_PAGE',
          page: 'overview',
          wellId: currentWellId,
          label: `Open ${currentWellCode} Overview`,
        },
        {
          type: 'OPEN_PAGE',
          page: 'srp',
          wellId: currentWellId,
          label: 'Inspect SRP Diagnostics',
        },
      ],
    };
  }
}
