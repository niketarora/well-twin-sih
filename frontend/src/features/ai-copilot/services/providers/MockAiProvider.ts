import { AiProvider } from './AiProvider';
import { AiContext, AiResponse, WellComparisonItem } from '../../types/ai';

export class MockAiProvider implements AiProvider {
  readonly id = 'mock';
  readonly name = 'Deterministic Engineering Engine';

  private readonly fieldComparisonDataset: WellComparisonItem[] = [
    {
      wellId: 'well-bw-022',
      wellCode: 'BW-22',
      oilRateBopd: 52.0,
      waterCutPct: 84.5,
      bhtC: 174,
      fillagePct: 48.0,
      healthScore: 41,
      dominantConcern: 'Severe fluid pound & Goodman rod stress (81.5% > 80%)',
      status: 'Critical',
    },
    {
      wellId: 'well-bw-017',
      wellCode: 'BW-17',
      oilRateBopd: 84.0,
      waterCutPct: 78.2,
      bhtC: 182,
      fillagePct: 61.4,
      healthScore: 62,
      dominantConcern: 'Solution gas breakout & delayed traveling valve closure',
      status: 'Attention Required',
    },
    {
      wellId: 'well-bw-004',
      wellCode: 'BW-04',
      oilRateBopd: 120.0,
      waterCutPct: 75.0,
      bhtC: 196,
      fillagePct: 82.0,
      healthScore: 85,
      dominantConcern: 'Mild rod friction in deviated section',
      status: 'Optimal',
    },
    {
      wellId: 'well-bw-001',
      wellCode: 'BW-01',
      oilRateBopd: 184.2,
      waterCutPct: 71.0,
      bhtC: 212,
      fillagePct: 91.5,
      healthScore: 92,
      dominantConcern: 'Stable CSS production · Nominal soak decline',
      status: 'Optimal',
    },
    {
      wellId: 'well-bw-023',
      wellCode: 'BW-23',
      oilRateBopd: 210.0,
      waterCutPct: 64.0,
      bhtC: 218,
      fillagePct: 94.0,
      healthScore: 94,
      dominantConcern: 'Optimal steam chamber heating · Full barrel fillage',
      status: 'Optimal',
    },
  ];

  async generateResponse(prompt: string, context: AiContext): Promise<AiResponse> {
    const q = prompt.toLowerCase().trim();
    const currentWellCode = context.well?.code || 'BW-17';
    const currentWellId = context.well?.id || context.ui.currentWellId || 'well-bw-017';

    // 0. Data Sufficiency & Hallucination Prevention for Unknown Wells (Spec Section 24)
    if (q.includes('bw-99') || q.includes('bw99') || q.includes('unknown') || q.includes('bw-999')) {
      return {
        answer: `**Well BW-99** is not found in the Baghewala Field Registry.\n\nThe digital twin surveillance network currently monitors active wells: **BW-01**, **BW-04**, **BW-17**, **BW-22**, **BW-23**, and **BW-31**.\n\nPlease select an active well from the registry or navigate to the Field Map to review monitored pads.`,
        intent: 'DATA_LOOKUP',
        confidence: 0.99,
        dataSufficiency: {
          isSufficient: false,
          availableMetrics: ['Field Registry: BW-01, BW-04, BW-17, BW-22, BW-23, BW-31'],
          missingMetrics: ['Well BW-99 Master Record', 'Downhole Telemetry Stream', 'SCADA RTU Node'],
        },
        actions: [
          {
            type: 'OPEN_PAGE',
            page: 'home',
            wellId: currentWellId,
            label: 'Open Field Map Registry',
          },
        ],
      };
    }

    // 1. Navigation requests & "Show me the pump"
    if (
      q.includes('show me the pump') ||
      q.includes('open srp') ||
      q.includes('show srp') ||
      q === 'srp' ||
      q.includes('pump dynamics')
    ) {
      return {
        answer: `Navigating directly to **Sucker Rod Pump (SRP) Lift Dynamics** for **${currentWellCode}**. Here you can inspect full-cycle surface and downhole dynamometer cards, polished rod loading, and pump barrel fillage efficiency.`,
        intent: 'NAVIGATION',
        confidence: 0.98,
        actions: [
          {
            type: 'OPEN_PAGE',
            page: 'srp',
            wellId: currentWellId,
            label: `Open ${currentWellCode} SRP Diagnostics`,
          },
        ],
      };
    }

    if (q.includes('open reservoir') || q.includes('show reservoir') || q.includes('thermal')) {
      return {
        answer: `Navigating to **Reservoir & Thermal surveillance** for **${currentWellCode}**. Displays sandface temperature decay, cyclic steam chamber heating radius, and in-situ viscosity response.`,
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
        answer: `Opening the **Well Command Center Overview** for **${currentWellCode}**.`,
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
        answer: 'Navigating to the **Baghewala Field GIS Map** and Multi-Well Surveillance view.',
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
        answer: `Navigating to **Surface Production monitoring** for **${currentWellCode}**.`,
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
        answer: `Opening **Operational Alerts triage** for **${currentWellCode}**.`,
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

    // 2. Alert Investigation deep links ("Investigate alert ALM-4415", "ALM-4412", etc.)
    if (q.includes('alm-4415') || q.includes('goodman') || (q.includes('investigate alert') && q.includes('4415'))) {
      return {
        answer: `**Investigative Attribution for Alert ALM-4415 (Critical Goodman Fatigue Stress)**:\n\n1. **Root Cause**: The 0.875" Norris 97 rod section at 420–780 m is experiencing a cyclic Goodman stress ratio of **81.5%**, exceeding the 80.0% structural fatigue safety ceiling.\n2. **4-Twin Mechanism**: Heavy oil drag (+6.2%) combined with sharp downstroke deceleration following fluid pound at 2.80 m creates harmonic compression shock waves traveling up the rod taper.\n3. **Immediate Mitigation Protocol**:\n   - Reduce VFD pumping speed from **4.8 SPM to 3.8 SPM** (or trim from 8.4 to 7.8 SPM on high-speed units).\n   - This lowers peak polished rod load below 84.0 kN and returns the Goodman stress ratio to **74.2%** (within nominal green envelope).`,
        intent: 'INVESTIGATION',
        confidence: 0.96,
        evidence: [
          { label: 'Goodman Stress Ratio', value: 81.5, unit: '%', trend: 'up', provenance: 'ACTUAL' },
          { label: 'Fatigue Threshold', value: 80.0, unit: '%', trend: 'stable', provenance: 'MODEL_DERIVED' },
          { label: 'Downstroke Inception', value: '2.80 m', unit: 'stroke', trend: 'stable', provenance: 'OBSERVED' },
          { label: 'Section 2 Taper Diameter', value: '0.875', unit: 'in', trend: 'stable', provenance: 'OBSERVED' },
        ],
        actions: [
          {
            type: 'OPEN_PAGE',
            page: 'srp',
            wellId: currentWellId,
            label: 'Inspect Taper Stress Table',
          },
          {
            type: 'OPEN_PAGE',
            page: 'recommendations',
            wellId: currentWellId,
            label: 'Review VFD Trim Work Order',
          },
        ],
      };
    }

    if (q.includes('alm-4412') || (q.includes('investigate alert') && q.includes('4412'))) {
      return {
        answer: `**Investigative Attribution for Alert ALM-4412 (Fluid Pound Detection)**:\n\n1. **Kinematic Anomaly**: SRP barrel fillage has fallen to **61.4%** with downstroke traveling valve slam detected at 2.80 m displacement.\n2. **Thermodynamic Driver**: Bottomhole temperature cooling to 182°C causes localized crude viscosity to elevate to 420 cP, restricting inflow into the pump chamber while near-wellbore pressure drop releases dissolved solution gas.\n3. **Recommended Mitigation**: Decrease pumping cadence to allow chamber recharge and suppress cyclic shock loading.`,
        intent: 'INVESTIGATION',
        confidence: 0.95,
        evidence: [
          { label: 'Pump Barrel Fillage', value: 61.4, unit: '%', trend: 'down', provenance: 'ACTUAL' },
          { label: 'Impact Displacement', value: '2.80 m', unit: 'stroke', trend: 'stable', provenance: 'OBSERVED' },
          { label: 'Estimated Viscosity', value: 420, unit: 'cP', trend: 'up', provenance: 'MODEL_DERIVED' },
        ],
        actions: [
          {
            type: 'OPEN_PAGE',
            page: 'srp',
            wellId: currentWellId,
            label: 'Open SRP Dyno Cards',
          },
        ],
      };
    }

    // 3. Dynamometer Load Card Explanation ("Explain Card with AI")
    if (q.includes('dynamometer') || q.includes('load card') || q.includes('explain card') || q.includes('card classification')) {
      return {
        answer: `**Full-Cycle Dynamometer Load Card Kinematic Decomposition**:\n\n- **Card Diagnostic Classification**: Severe Fluid Pound / Incomplete Chamber Fill.\n- **Surface vs Downhole Dynamics**: The surface loop exhibits premature load shedding during the downstroke. Mathematical wave equation projection confirms traveling valve closure delay, indicating that the pump chamber is only partially filled with liquid crude (${context.telemetry?.fillage ?? 61.4}% fillage).\n- **Inception Point**: Fluid pound impact occurs sharply at **2.80 m downstroke displacement** as the traveling valve contacts liquid crude under high rod deceleration.\n- **Mitigation**: Trim pumping frequency by **−1.0 SPM** via the surface VFD to balance wellbore inflow and eliminate cyclic fatigue shock.`,
        intent: 'EXPLANATION',
        confidence: 0.97,
        evidence: [
          { label: 'Pump Fillage', value: context.telemetry?.fillage ?? 61.4, unit: '%', trend: 'down', provenance: 'ACTUAL' },
          { label: 'Impact Inception', value: '2.80 m', unit: 'stroke', trend: 'stable', provenance: 'OBSERVED' },
          { label: 'Peak Polished Rod Load', value: 88.4, unit: 'kN', trend: 'stable', provenance: 'OBSERVED' },
          { label: 'Rod Tension Margin', value: '+24.6', unit: 'kN', trend: 'stable', provenance: 'MODEL_DERIVED' },
        ],
        actions: [
          {
            type: 'OPEN_PAGE',
            page: 'srp',
            wellId: currentWellId,
            label: 'Review Rod Taper Stress',
          },
          {
            type: 'OPEN_PAGE',
            page: 'recommendations',
            wellId: currentWellId,
            label: 'Generate SPM Trim Order',
          },
        ],
      };
    }

    // 4. Target Scenario: "Which well needs attention right now?"
    if (
      q.includes('which well needs attention') ||
      q.includes('needs attention right now') ||
      q.includes('which well requires attention') ||
      q.includes('critical well')
    ) {
      return {
        answer: `**Well BW-17** and **Well BW-22** currently require priority operational intervention across the Baghewala Field:\n\n1. **Well BW-17** (Health **62%**, Attention Required): Experiencing severe solution gas breakout at the slotted liner and pump fillage degradation to 61.4%. Net oil production has dropped to 84.0 BOPD.\n2. **Well BW-22** (Health **41%**, Critical): Active critical alarm ALM-4415 for rod fatigue (Goodman stress 81.5%) and severe fluid pound at 48% fillage.\n\nWells **BW-01**, **BW-04**, and **BW-23** are producing within normal operating envelopes.`,
        intent: 'COMPARISON',
        confidence: 0.97,
        evidence: [
          { label: 'BW-17 Health Score', value: 62, unit: '%', trend: 'down', provenance: 'MODEL_DERIVED' },
          { label: 'BW-17 Fillage', value: 61.4, unit: '%', trend: 'down', provenance: 'ACTUAL' },
          { label: 'BW-22 Health Score', value: 41, unit: '%', trend: 'down', provenance: 'MODEL_DERIVED' },
          { label: 'BW-22 Goodman Stress', value: 81.5, unit: '%', trend: 'up', provenance: 'ACTUAL' },
        ],
        comparison: this.fieldComparisonDataset,
        actions: [
          {
            type: 'OPEN_PAGE',
            page: 'overview',
            wellId: 'well-bw-017',
            label: 'Open BW-17 Overview',
          },
          {
            type: 'OPEN_PAGE',
            page: 'overview',
            wellId: 'well-bw-022',
            label: 'Inspect BW-22 Critical State',
          },
          {
            type: 'OPEN_PAGE',
            page: 'alerts',
            wellId: 'well-bw-017',
            label: 'Triage Active Alarms',
          },
        ],
      };
    }

    // 5. Multi-Well Query: "Which well has the lowest production?"
    if (
      q.includes('lowest production') ||
      q.includes('least production') ||
      q.includes('lowest oil') ||
      q.includes('lowest rate')
    ) {
      return {
        answer: `Across the Baghewala Field surveillance network, **Well BW-22** currently has the **lowest net oil production** at **52.0 BOPD**, followed by **Well BW-17** at **84.0 BOPD**.\n\n**Field Production Ranking**:\n1. **BW-22**: 52.0 BOPD (Critical · 48% fillage, 41% health)\n2. **BW-17**: 84.0 BOPD (Attention · 61% fillage, 62% health)\n3. **BW-04**: 120.0 BOPD (Optimal · 82% fillage, 85% health)\n4. **BW-01**: 184.2 BOPD (Optimal · 91% fillage, 92% health)\n5. **BW-23**: 210.0 BOPD (Optimal · 94% fillage, 94% health)`,
        intent: 'COMPARISON',
        confidence: 0.98,
        comparison: this.fieldComparisonDataset,
        actions: [
          {
            type: 'OPEN_PAGE',
            page: 'overview',
            wellId: 'well-bw-022',
            label: 'Open BW-22 (Lowest Producer)',
          },
          {
            type: 'OPEN_PAGE',
            page: 'overview',
            wellId: 'well-bw-017',
            label: 'Open BW-17 Overview',
          },
        ],
      };
    }

    // 6. Direct Well Comparison: "Compare BW-17 and BW-23"
    if (
      (q.includes('compare') && (q.includes('bw-17') || q.includes('bw17')) && (q.includes('bw-23') || q.includes('bw23'))) ||
      q.includes('bw-17 vs bw-23') ||
      q.includes('bw17 vs bw23')
    ) {
      const bw17 = this.fieldComparisonDataset.find((w) => w.wellCode === 'BW-17')!;
      const bw23 = this.fieldComparisonDataset.find((w) => w.wellCode === 'BW-23')!;

      return {
        answer: `**Comparative Analysis: Well BW-17 vs Well BW-23**:\n\n- **Thermal State & Inflow**: BW-23 operates in an earlier CSS soak cycle with hot sandface temperature (**218°C** vs **182°C** on BW-17), providing lower viscosity crude and abundant inflow.\n- **Pump Performance**: BW-23 maintains **94.0%** barrel fillage with zero fluid pound, delivering **210.0 BOPD**. In contrast, BW-17 experiences gas breakout and incomplete fillage (**61.4%**), delivering **84.0 BOPD**.\n- **Composite Twin Health**: BW-23 scores **94%** (Optimal) versus **62%** (Attention Required) on BW-17.`,
        intent: 'COMPARISON',
        confidence: 0.96,
        evidence: [
          { label: 'BW-17 Net Oil', value: bw17.oilRateBopd, unit: 'BOPD', trend: 'down', provenance: 'ACTUAL' },
          { label: 'BW-23 Net Oil', value: bw23.oilRateBopd, unit: 'BOPD', trend: 'stable', provenance: 'ACTUAL' },
          { label: 'BW-17 Bottomhole Temp', value: bw17.bhtC, unit: '°C', trend: 'down', provenance: 'OBSERVED' },
          { label: 'BW-23 Bottomhole Temp', value: bw23.bhtC, unit: '°C', trend: 'stable', provenance: 'OBSERVED' },
          { label: 'BW-17 Pump Fillage', value: bw17.fillagePct, unit: '%', trend: 'down', provenance: 'ACTUAL' },
          { label: 'BW-23 Pump Fillage', value: bw23.fillagePct, unit: '%', trend: 'stable', provenance: 'ACTUAL' },
        ],
        comparison: [bw17, bw23],
        actions: [
          {
            type: 'OPEN_PAGE',
            page: 'overview',
            wellId: 'well-bw-017',
            label: 'Inspect BW-17',
          },
          {
            type: 'OPEN_PAGE',
            page: 'overview',
            wellId: 'well-bw-023',
            label: 'Inspect BW-23',
          },
        ],
      };
    }

    // 7. General Comparison queries ("compare wells", "field comparison")
    if (q.includes('compare') || q.includes('benchmark')) {
      return {
        answer: `Below is the surveillance comparison across all monitored wells in the Baghewala CSS pilot. **BW-22** and **BW-17** exhibit the lowest composite health and fillage scores, while **BW-23** and **BW-01** operate at peak thermal efficiency.`,
        intent: 'COMPARISON',
        confidence: 0.94,
        comparison: this.fieldComparisonDataset,
        actions: [
          {
            type: 'OPEN_PAGE',
            page: 'home',
            wellId: currentWellId,
            label: 'Open Field Map Benchmark',
          },
        ],
      };
    }

    // 8. 4-Twin Causal Investigation: "Why?", "Why is production declining?", "Explain the root cause"
    if (
      q === 'why' ||
      q === 'why?' ||
      q.includes('why') ||
      q.includes('declining') ||
      q.includes('decline') ||
      q.includes('investigate') ||
      q.includes('cause')
    ) {
      const oil = context.telemetry?.oilRate ?? 84;
      const bht = context.telemetry?.bht ?? 182;
      const fillage = context.telemetry?.fillage ?? 61.4;
      const visc = context.telemetry?.viscosity ?? 420;

      return {
        answer: `Physical cause attribution indicates that the production deficit on **${currentWellCode}** (${oil} BOPD vs 100 BOPD target) is governed by a **4-twin coupled causal cascade**:\n\n1. **Reservoir & Thermal Twin**: Sandface BHT has fallen to **${bht}°C** (−13°C vs nominal soak curve on Day 38 of CSS Cycle 4).\n2. **Wellbore Hydraulics Twin**: Cooling raises in-situ heavy crude viscosity to **${visc} cP**, elevating wellbore friction head.\n3. **SRP Lift Dynamics Twin**: Localized near-wellbore drawdown below 3.8 MPa liberates solution gas, causing gas breakout and reducing pump liquid fillage to **${fillage}%** with fluid pound at 2.80 m.\n4. **Surface Production Twin**: Restricted pump displacement directly curtails net surface delivery to **${oil} BOPD**.\n\n**Recommended Action**: Trim VFD speed to 3.8 SPM to eliminate fluid pound and prevent rod fatigue.`,
        intent: 'INVESTIGATION',
        confidence: 0.95,
        evidence: [
          { label: 'Bottomhole Temp (BHT)', value: bht, unit: '°C', trend: 'down', provenance: 'OBSERVED' },
          { label: 'Effective Viscosity', value: visc, unit: 'cP', trend: 'up', provenance: 'MODEL_DERIVED' },
          { label: 'SRP Barrel Fillage', value: fillage, unit: '%', trend: 'down', provenance: 'ACTUAL' },
          { label: 'Net Oil Extraction', value: oil, unit: 'BOPD', trend: 'down', provenance: 'OBSERVED' },
        ],
        actions: [
          {
            type: 'OPEN_PAGE',
            page: 'srp',
            wellId: currentWellId,
            label: 'Inspect SRP Dyno Cards',
          },
          {
            type: 'OPEN_PAGE',
            page: 'reservoir',
            wellId: currentWellId,
            label: 'View Reservoir Thermal Chamber',
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

    // 9. Specific Telemetry Data Lookup: Fillage, BHT, Oil Rate
    if (q.includes('fillage') || q.includes('pump fill')) {
      const fillage = context.telemetry?.fillage ?? 61.4;
      return {
        answer: `Current SRP barrel fillage on **${currentWellCode}** is **${fillage}%** (rated as Warning/Attention). Delayed traveling valve closure indicates solution gas breakout at the slotted liner intake. Recommended setpoint is 3.8 SPM to mitigate gas lock risk.`,
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
        answer: `Measured bottom-hole temperature (BHT) on **${currentWellCode}** is **${bht}°C** at 1,180 m depth. The reading exhibits an accelerating cooling drift of −13°C relative to the nominal Cycle 4 thermal baseline.`,
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
        answer: `Current net oil production for **${currentWellCode}** is **${oil} BOPD** with a water cut of **${context.telemetry?.waterCut ?? 78.2}%**. Coriolis Skid 03 confirms an operating variance of −16% against the programmed allocation of 100 BOPD.`,
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

    // 10. Default General Engineering Overview
    return {
      answer: `Analyzing surveillance telemetry for **${currentWellCode}** (${context.well?.pad || 'Pad 03'} · ${context.well?.sector || 'Sector 4'}). The well is operating in CSS Cycle #${context.well?.cycle ?? 4} (Day ${context.well?.dayInCycle ?? 38}) in Production phase with a composite Digital Twin health score of **${context.well?.healthScore ?? 62}%**. Telemetry shows stable surface pressure with gas interference noted at the pump intake.`,
      intent: 'GENERAL_ENGINEERING',
      confidence: 0.91,
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
