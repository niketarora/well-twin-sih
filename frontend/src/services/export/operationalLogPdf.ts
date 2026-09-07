import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface OperationalLogReportData {
  well: {
    id: string;
    code: string;
    name: string;
    fieldName: string;
    basin: string;
    formation: string;
    location: string;
    cycle: number;
    dayInCycle: number;
    totalCycleDays: number;
    phase: string;
    scadaStatus: string;
    status: string;
    isSyntheticDemo?: boolean;
    engineerOnDuty?: {
      name: string;
      role: string;
      initials: string;
    };
  };
  health?: {
    score: number;
    status: string;
    dominantConcern?: string;
    subsystems?: Array<{
      id: string;
      name: string;
      score: number;
      dominantFactor?: string;
    }>;
  };
  kpis?: Array<{
    id: string;
    label: string;
    value: string | number;
    unit?: string;
    status?: string;
    sublabel?: string;
  }>;
  digitalTwinDomains?: Array<{
    domain: string;
    status: string;
    healthScore: number;
    keyMetric: string;
    value: string;
    deviation: string;
  }>;
  productionReconciliation?: Array<{
    date: string;
    actualBopd: number;
    predictedBopd: number;
    variancePct: string;
    waterCutPct: number;
    bhtC: number;
  }>;
  modelHealth?: {
    overallScore: number;
    physicsFidelity: number;
    dataConfidence: number;
    driftStatus: string;
    modelVersion: string;
    lastRetrained: string;
  };
  alerts?: Array<{
    id: string;
    severity: string;
    subsystem: string;
    title: string;
    timestamp: string;
    status: string;
  }>;
  insights?: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    confidence: number;
  }>;
  recommendations?: Array<{
    id: string;
    title: string;
    priority: string;
    expectedImpact: string;
    status: string;
  }>;
  causeChain?: Array<{
    stage: string;
    status: string;
    detail: string;
  }>;
}

export async function generateOperationalLogPdf(data: OperationalLogReportData): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const primaryDark = [15, 76, 92]; // #0f4c5c petroleum teal
  const textDark = [15, 23, 42];    // #0f172a slate-900
  const textMuted = [71, 85, 105];  // #475569 slate-600
  const borderGray = [226, 232, 240]; // #e2e8f0 slate-200
  const bgLight = [248, 250, 252];  // #f8fafc slate-50

  const now = new Date();
  const formattedDate = now.toISOString().split('T')[0];
  const formattedTime = now.toUTCString().slice(17, 25) + ' UTC';

  // Helper: Section title block
  const renderSectionHeader = (title: string, subtitle?: string) => {
    if (cursorY > pageHeight - 35) {
      doc.addPage();
      cursorY = margin + 8;
    }
    doc.setFillColor(primaryDark[0], primaryDark[1], primaryDark[2]);
    doc.rect(margin, cursorY, 3, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(title.toUpperCase(), margin + 5, cursorY + 4);

    if (subtitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      const titleWidth = doc.getTextWidth(title.toUpperCase());
      doc.text(`—  ${subtitle}`, margin + 6 + titleWidth, cursorY + 4);
    }
    cursorY += 8;
  };

  // ================= PAGE 1 =================
  // Top Header Banner
  doc.setFillColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.rect(margin, cursorY, contentWidth, 20, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('WELL TWIN · OPERATIONAL LOG REPORT', margin + 6, cursorY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(220, 235, 240);
  doc.text(`${data.well.fieldName} · ${data.well.basin} · Well ${data.well.code}`, margin + 6, cursorY + 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  const dateStr = `Export Date: ${formattedDate} ${formattedTime}`;
  doc.text(dateStr, pageWidth - margin - 6 - doc.getTextWidth(dateStr), cursorY + 8);

  doc.setFont('helvetica', 'normal');
  const dutyStr = `Engineer: ${data.well.engineerOnDuty?.name || 'R. Verma'} (${data.well.engineerOnDuty?.initials || 'RV'})`;
  doc.text(dutyStr, pageWidth - margin - 6 - doc.getTextWidth(dutyStr), cursorY + 14);

  cursorY += 23;

  // Data Classification Banner
  doc.setFillColor(254, 243, 199); // amber-100
  doc.setDrawColor(245, 158, 11);  // amber-500
  doc.setLineWidth(0.3);
  doc.rect(margin, cursorY, contentWidth, 7, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(146, 64, 14);   // amber-800
  doc.text('DATA CLASSIFICATION: DEMO / SYNTHETIC DATA — BAGHEWALA HEAVY OIL DIGITAL TWIN', margin + 4, cursorY + 4.8);
  const twinStatusBadge = `SCADA Status: ${data.well.scadaStatus} | Twin Model: Active`;
  doc.text(twinStatusBadge, pageWidth - margin - 4 - doc.getTextWidth(twinStatusBadge), cursorY + 4.8);
  cursorY += 10;

  // Section 1: Well Identity & Operational Context
  renderSectionHeader('1. Well Identification & Operational Parameters');
  const wellIdData = [
    [
      { content: 'Well Code / ID:', styles: { fontStyle: 'bold' as const, fillColor: bgLight as [number, number, number] } },
      `${data.well.code} (${data.well.id})`,
      { content: 'Formation / Sand:', styles: { fontStyle: 'bold' as const, fillColor: bgLight as [number, number, number] } },
      data.well.formation,
    ],
    [
      { content: 'Surface Pad / Sector:', styles: { fontStyle: 'bold' as const, fillColor: bgLight as [number, number, number] } },
      data.well.location,
      { content: 'CSS Cycle State:', styles: { fontStyle: 'bold' as const, fillColor: bgLight as [number, number, number] } },
      `Cycle ${data.well.cycle} · Day ${data.well.dayInCycle} of ${data.well.totalCycleDays} (${data.well.phase})`,
    ],
    [
      { content: 'Well Surveillance Status:', styles: { fontStyle: 'bold' as const, fillColor: bgLight as [number, number, number] } },
      data.well.status || 'Active Production',
      { content: 'Drive Mechanism:', styles: { fontStyle: 'bold' as const, fillColor: bgLight as [number, number, number] } },
      'Cyclic Steam Stimulation (CSS) + Sucker Rod Pump (SRP)',
    ],
  ];

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    body: wellIdData,
    theme: 'plain',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: textDark as [number, number, number],
      lineColor: borderGray as [number, number, number],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { cellWidth: 42 },
      1: { cellWidth: 49 },
      2: { cellWidth: 42 },
      3: { cellWidth: 49 },
    },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 6;

  // Section 2: Well Health & Coupled Subsystems
  renderSectionHeader('2. Multi-Physics Digital Twin Health Score');
  const overallHealth = data.health?.score ?? 62;
  const healthStatus = data.health?.status ?? (overallHealth > 80 ? 'Optimal' : overallHealth > 55 ? 'Attention Advised' : 'Critical Intervention');

  const subsystems = data.health?.subsystems || [
    { id: 'reservoir', name: 'Reservoir & Thermal Domain', score: 58, dominantFactor: 'Thermal dissipation & Viscosity elevation' },
    { id: 'wellbore', name: 'Wellbore Inflow & Hydraulics', score: 65, dominantFactor: 'Bottom-hole fluid temperature decline' },
    { id: 'lift', name: 'SRP Mechanical & Dyno Health', score: 61, dominantFactor: 'Incomplete barrel fillage (61%) & Gas lock risk' },
    { id: 'surface', name: 'Surface Facility & Flowline', score: 88, dominantFactor: 'Header backpressure nominal @ 0.42 MPa' },
  ];

  const healthBgColor: [number, number, number] = overallHealth > 80 ? [220, 252, 231] : overallHealth > 55 ? [254, 243, 199] : [254, 226, 226];
  const healthTextColor: [number, number, number] = overallHealth > 80 ? [21, 128, 61] : overallHealth > 55 ? [180, 83, 9] : [185, 28, 28];

  const healthRows: any[] = [
    [
      {
        content: `Overall Twin Health: ${overallHealth}/100 [${healthStatus.toUpperCase()}]`,
        colSpan: 4,
        styles: {
          fontStyle: 'bold' as const,
          fillColor: healthBgColor,
          textColor: healthTextColor,
        },
      },
    ],
    ...subsystems.map(s => [
      s.name,
      `${s.score}/100`,
      s.score > 80 ? 'Optimal' : s.score > 55 ? 'Degraded' : 'Critical',
      s.dominantFactor || 'Normal operational envelope',
    ]),
  ];

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    head: [['Subsystem Domain', 'Health Score', 'Status', 'Dominant Governing Factor / Concern']],
    body: healthRows,
    theme: 'grid',
    headStyles: {
      fillColor: primaryDark as [number, number, number],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      cellPadding: 2,
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      textColor: textDark as [number, number, number],
      lineColor: borderGray as [number, number, number],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 24, halign: 'center' },
      2: { cellWidth: 26, halign: 'center' },
      3: { cellWidth: 82 },
    },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 6;

  // Section 3: Key Telemetry KPIs
  renderSectionHeader('3. Key Operational Telemetry & Surveillance KPIs');
  const kpiItems = data.kpis || [
    { label: 'Gross Oil Rate', value: '84', unit: 'BOPD', status: 'Warning', sublabel: '-16% vs Target 100 BOPD' },
    { label: 'Water Cut', value: '78.2', unit: '%', status: 'Attention', sublabel: '+4.1% 7d Drift' },
    { label: 'Bottom-Hole Temp (BHT)', value: '182', unit: '°C', status: 'Degrading', sublabel: '-13°C vs Baseline Curve' },
    { label: 'Bottom-Hole Pressure (BHP)', value: '3.8', unit: 'MPa', status: 'Stable', sublabel: 'Hydrostatic Reservoir P' },
    { label: 'Pump Barrel Fillage', value: '61.4', unit: '%', status: 'Critical', sublabel: 'Gas Interference Present' },
    { label: 'Estimated In-Situ Viscosity', value: '420', unit: 'cP', status: 'Elevated', sublabel: '+140 cP Thermal Decay' },
    { label: 'SRP Pumping Speed', value: '4.8', unit: 'SPM', status: 'Nominal', sublabel: 'Stroke Length 120 in' },
    { label: 'Peak Polished Rod Stress', value: '78.4', unit: '%', status: 'Warning', sublabel: 'Fatigue Limit 85%' },
  ];

  const kpiGridRows: any[] = [];
  for (let i = 0; i < kpiItems.length; i += 4) {
    const slice = kpiItems.slice(i, i + 4);
    kpiGridRows.push(slice.map(k => `${k.label}\n${k.value} ${k.unit || ''}\n${k.sublabel || k.status || ''}`));
  }

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    body: kpiGridRows,
    theme: 'grid',
    styles: {
      fontSize: 7.5,
      cellPadding: 2.5,
      valign: 'middle',
      halign: 'center',
      textColor: textDark as [number, number, number],
      lineColor: borderGray as [number, number, number],
      lineWidth: 0.2,
      fillColor: bgLight as [number, number, number],
    },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 6;

  // Section 4: Engineering Cause Chain
  renderSectionHeader('4. Physical Cause-and-Effect Propagation Chain', 'Coupled Multi-Physics Attribution');
  const causeChain = data.causeChain || [
    { stage: 'Reservoir Heat Dissipation', status: 'Trigger', detail: 'Cycle 4 thermal chamber enthalpy declining (-13°C deviation from design soak decay)' },
    { stage: 'In-Situ Viscosity Elevation', status: 'Physical Impact', detail: 'Crude viscosity rose from 280 cP to 420 cP near sandface, slowing relative inflow mobility' },
    { stage: 'Solution Gas Release at Pump Intake', status: 'Downhole Inflow', detail: 'Drawdown below bubble-point (3.8 MPa) triggered free gas breakout at slotted liner' },
    { stage: 'Pump Barrel Incomplete Fill (61%)', status: 'Artificial Lift', detail: 'Compressible gas pocket causes delayed traveling valve closure and incomplete liquid displacement' },
    { stage: 'Net Production Rate Deficit (-16 BOPD)', status: 'Surface Impact', detail: 'Fluid production restricted to 84 BOPD vs 100 BOPD programmed allocation' },
  ];

  const causeRows = causeChain.map((c, idx) => [
    `Stage ${idx + 1}`,
    c.stage,
    c.status,
    c.detail,
  ]);

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    head: [['Step', 'Physical Mechanism', 'Role', 'Coupled Diagnostics & Observational Evidence']],
    body: causeRows,
    theme: 'grid',
    headStyles: {
      fillColor: primaryDark as [number, number, number],
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold',
      cellPadding: 2,
    },
    styles: {
      fontSize: 7,
      cellPadding: 1.8,
      textColor: textDark as [number, number, number],
      lineColor: borderGray as [number, number, number],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { cellWidth: 16, halign: 'center' },
      1: { cellWidth: 44, fontStyle: 'bold' },
      2: { cellWidth: 26, halign: 'center' },
      3: { cellWidth: 96 },
    },
  });

  // ================= PAGE 2 =================
  doc.addPage();
  cursorY = margin;

  // Page 2 Header strip
  doc.setFillColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.rect(margin, cursorY, contentWidth, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`WELL TWIN · SURVEILLANCE & RECONCILIATION LOG · ${data.well.code}`, margin + 4, cursorY + 5.5);
  const p2Date = `${formattedDate} · Confidential Technical Report`;
  doc.text(p2Date, pageWidth - margin - 4 - doc.getTextWidth(p2Date), cursorY + 5.5);
  cursorY += 12;

  // Section 5: 14-Day Production Reconciliation Table
  renderSectionHeader('5. 14-Day Production Reconciliation & History', 'Predicted vs Actual Daily Output');
  const reconciliationData = data.productionReconciliation || [
    { date: '2026-08-25', actualBopd: 96, predictedBopd: 98, variancePct: '-2.0%', waterCutPct: 76.1, bhtC: 189 },
    { date: '2026-08-26', actualBopd: 95, predictedBopd: 97, variancePct: '-2.1%', waterCutPct: 76.4, bhtC: 188 },
    { date: '2026-08-27', actualBopd: 93, predictedBopd: 96, variancePct: '-3.1%', waterCutPct: 76.8, bhtC: 187 },
    { date: '2026-08-28', actualBopd: 92, predictedBopd: 95, variancePct: '-3.2%', waterCutPct: 77.0, bhtC: 186 },
    { date: '2026-08-29', actualBopd: 90, predictedBopd: 94, variancePct: '-4.3%', waterCutPct: 77.3, bhtC: 185 },
    { date: '2026-08-30', actualBopd: 89, predictedBopd: 93, variancePct: '-4.3%', waterCutPct: 77.5, bhtC: 185 },
    { date: '2026-08-31', actualBopd: 88, predictedBopd: 92, variancePct: '-4.3%', waterCutPct: 77.7, bhtC: 184 },
    { date: '2026-09-01', actualBopd: 87, predictedBopd: 91, variancePct: '-4.4%', waterCutPct: 77.9, bhtC: 183 },
    { date: '2026-09-02', actualBopd: 86, predictedBopd: 90, variancePct: '-4.4%', waterCutPct: 78.0, bhtC: 183 },
    { date: '2026-09-03', actualBopd: 85, predictedBopd: 89, variancePct: '-4.5%', waterCutPct: 78.1, bhtC: 182 },
    { date: '2026-09-04', actualBopd: 84, predictedBopd: 88, variancePct: '-4.5%', waterCutPct: 78.2, bhtC: 182 },
    { date: '2026-09-05', actualBopd: 84, predictedBopd: 87, variancePct: '-3.4%', waterCutPct: 78.2, bhtC: 182 },
    { date: '2026-09-06', actualBopd: 84, predictedBopd: 86, variancePct: '-2.3%', waterCutPct: 78.2, bhtC: 182 },
    { date: '2026-09-07', actualBopd: 84, predictedBopd: 85, variancePct: '-1.2%', waterCutPct: 78.2, bhtC: 182 },
  ];

  const reconRows = reconciliationData.map(r => [
    r.date,
    `${r.actualBopd} BOPD`,
    `${r.predictedBopd} BOPD`,
    r.variancePct,
    `${r.waterCutPct}%`,
    `${r.bhtC} °C`,
  ]);

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    head: [['Date (UTC)', 'Actual Rate', 'Twin Predicted', 'Variance', 'Water Cut', 'Sandface BHT']],
    body: reconRows,
    theme: 'striped',
    headStyles: {
      fillColor: primaryDark as [number, number, number],
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold',
      cellPadding: 1.8,
    },
    styles: {
      fontSize: 7,
      cellPadding: 1.5,
      textColor: textDark as [number, number, number],
      lineColor: borderGray as [number, number, number],
      lineWidth: 0.1,
      halign: 'center',
    },
    columnStyles: {
      0: { halign: 'left' },
    },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 6;

  // Section 6: Model Health, Physics Fidelity & Drift
  renderSectionHeader('6. Digital Twin Model Health & Physics Drift');
  const modelH = data.modelHealth || {
    overallScore: 92,
    physicsFidelity: 94,
    dataConfidence: 91,
    driftStatus: 'Low Drift (Within 5% Tolerance)',
    modelVersion: 'v2.4.1-rc3 (CMG-STARS Physics + Pinns Hybrid)',
    lastRetrained: '2026-09-01 00:00 UTC',
  };

  const modelRows = [
    [
      { content: 'Model Health Score:', styles: { fontStyle: 'bold' as const, fillColor: bgLight as [number, number, number] } },
      `${modelH.overallScore}% (Nominal)`,
      { content: 'Physics Fidelity:', styles: { fontStyle: 'bold' as const, fillColor: bgLight as [number, number, number] } },
      `${modelH.physicsFidelity}%`,
    ],
    [
      { content: 'Sensor Data Confidence:', styles: { fontStyle: 'bold' as const, fillColor: bgLight as [number, number, number] } },
      `${modelH.dataConfidence}%`,
      { content: 'Model Drift Status:', styles: { fontStyle: 'bold' as const, fillColor: bgLight as [number, number, number] } },
      modelH.driftStatus,
    ],
    [
      { content: 'Active Model Version:', styles: { fontStyle: 'bold' as const, fillColor: bgLight as [number, number, number] } },
      modelH.modelVersion,
      { content: 'Calibration Baseline:', styles: { fontStyle: 'bold' as const, fillColor: bgLight as [number, number, number] } },
      modelH.lastRetrained,
    ],
  ];

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    body: modelRows,
    theme: 'plain',
    styles: {
      fontSize: 7.5,
      cellPadding: 1.8,
      textColor: textDark as [number, number, number],
      lineColor: borderGray as [number, number, number],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { cellWidth: 42 },
      1: { cellWidth: 49 },
      2: { cellWidth: 42 },
      3: { cellWidth: 49 },
    },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 6;

  // Section 7: Active Alerts & Anomalies
  renderSectionHeader('7. Active Operational Alerts & Flagged Events');
  const alertList = data.alerts || [
    { id: 'ALM-4412', severity: 'Critical', subsystem: 'Artificial Lift (SRP)', title: 'Severe gas interference & incomplete pump fillage (61%)', timestamp: '14:15 UTC', status: 'Active' },
    { id: 'ALM-4409', severity: 'Warning', subsystem: 'Reservoir / Thermal', title: 'Sandface temperature decline accelerating (-13°C vs nominal soak)', timestamp: '11:42 UTC', status: 'Active' },
    { id: 'ALM-4403', severity: 'Warning', subsystem: 'Production', title: 'Fluid production rate below scheduled allocation (-16 BOPD)', timestamp: '08:10 UTC', status: 'Active' },
  ];

  const alertRows = alertList.map(a => [
    a.id,
    a.severity,
    a.subsystem,
    a.title,
    a.timestamp,
    a.status,
  ]);

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    head: [['Alert ID', 'Severity', 'Subsystem Domain', 'Alert Description & Trigger Condition', 'Logged', 'Status']],
    body: alertRows,
    theme: 'grid',
    headStyles: {
      fillColor: primaryDark as [number, number, number],
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold',
      cellPadding: 1.8,
    },
    styles: {
      fontSize: 7,
      cellPadding: 1.5,
      textColor: textDark as [number, number, number],
      lineColor: borderGray as [number, number, number],
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { cellWidth: 18 },
      1: { cellWidth: 18, halign: 'center' },
      2: { cellWidth: 38 },
      3: { cellWidth: 72 },
      4: { cellWidth: 18, halign: 'center' },
      5: { cellWidth: 18, halign: 'center' },
    },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 6;

  // Section 8: Engineering Insights & Recommendations
  renderSectionHeader('8. Engineering Recommendations & Corrective Work Orders');
  const recList = data.recommendations || [
    { id: 'REC-01', title: 'Adjust SRP Pumping Speed to 3.8 SPM', priority: 'High', expectedImpact: '+18% Pump fillage; prevent fluid pound & rod stress spike', status: 'Pending Approval' },
    { id: 'REC-02', title: 'Casing Gas Venting Pressure Calibration', priority: 'High', expectedImpact: 'Reduce downhole intake gas-to-oil ratio; mitigate gas lock risk', status: 'Pending Review' },
    { id: 'REC-03', title: 'Schedule Offset Steam Breakthrough Survey', priority: 'Medium', expectedImpact: 'Evaluate adjacent well BW-03 injection plume confinement', status: 'Planned' },
  ];

  const recRows = recList.map(r => [
    r.id,
    r.title,
    r.priority,
    r.expectedImpact,
    r.status,
  ]);

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    head: [['Ref ID', 'Recommended Action', 'Priority', 'Expected Engineering Impact & Mitigation', 'State']],
    body: recRows,
    theme: 'grid',
    headStyles: {
      fillColor: primaryDark as [number, number, number],
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold',
      cellPadding: 1.8,
    },
    styles: {
      fontSize: 7,
      cellPadding: 1.5,
      textColor: textDark as [number, number, number],
      lineColor: borderGray as [number, number, number],
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { cellWidth: 16 },
      1: { cellWidth: 54, fontStyle: 'bold' },
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 68 },
      4: { cellWidth: 26, halign: 'center' },
    },
  });

  // Footer for all pages
  const totalPages = doc.getNumberOfPages();
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    doc.setPage(pageNum);
    const footY = pageHeight - 10;

    // Thin separator rule
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, footY - 2, pageWidth - margin, footY - 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(`Well Twin · Baghewala Heavy Oil Field · Well ${data.well.code} Operational Log`, margin, footY + 2);

    const pageStr = `Page ${pageNum} of ${totalPages}`;
    doc.text(pageStr, pageWidth - margin - doc.getTextWidth(pageStr), footY + 2);
  }

  // Automatic browser download
  const cleanCode = data.well.code.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `WellTwin_${cleanCode}_Operational_Log_${formattedDate}.pdf`;
  doc.save(filename);
}
