"""Domain-specific petroleum engineering prompt templates for specialized workflows."""

from typing import Dict, Any, List, Optional

def build_single_well_anomaly_prompt(
    well_code: str,
    telemetry: Dict[str, Any],
    alerts: List[Dict[str, Any]],
    user_query: str
) -> str:
    """Constructs prompt for diagnosing single-well production declines or operational alarms."""
    bht = telemetry.get("bht", 182)
    viscosity = telemetry.get("viscosity", 420)
    fillage = telemetry.get("fillage", 61.4)
    oil_rate = telemetry.get("oilRate", 84.0)
    target_rate = telemetry.get("targetRate", 100.0)
    spm = telemetry.get("spm", 4.8)

    alert_summary = "\n".join(
        [f"- [{a.get('severity', 'WARN').upper()}] {a.get('id', '')}: {a.get('title', '')} ({a.get('subsystem', '')})" for a in alerts]
    ) if alerts else "None active"

    return f"""SPECIALIZED WORKFLOW: 4-TWIN ANOMALY ROOT-CAUSE ATTRIBUTION
Target Well: {well_code}
Observed Operating Telemetry:
- Sandface Bottomhole Temperature (BHT): {bht} °C
- In-Situ Heavy Crude Viscosity: {viscosity} cP
- SRP Barrel Fillage Efficiency: {fillage} %
- Net Surface Oil Rate: {oil_rate} BOPD (Target: {target_rate} BOPD, Deviation: -{round((1 - oil_rate / target_rate) * 100, 1)}%)
- Current Pumping Speed: {spm} SPM

Active Operational Alarms:
{alert_summary}

Engineer Query:
{user_query}

Instructions:
Trace physical causation step-by-step from Reservoir/Thermal -> Wellbore Hydraulics -> SRP Dynamics -> Surface Production.
Formulate explicit operational recommendations (e.g. VFD frequency setpoint adjustment). Tag all cited evidence with provenance.
"""

def build_dynamometer_explanation_prompt(
    well_code: str,
    cycle_label: str,
    classification: str,
    fillage: float,
    inception_displacement: str,
    user_query: str
) -> str:
    """Constructs prompt for detailed mathematical and kinematic dynamometer card explanation."""
    return f"""SPECIALIZED WORKFLOW: FULL-CYCLE DYNAMOMETER CARD DECOMPOSITION
Target Well: {well_code}
Analyzed Card Cycle: {cycle_label}
Diagnostic Classification: {classification}
Key Kinematic Parameters:
- Barrel Fillage: {fillage}%
- Fluid Pound / Valve Closure Inception: {inception_displacement}

Engineer Query:
{user_query}

Instructions:
Explain the traveling valve vs standing valve timing, the downhole load loop geometry relative to the surface polished rod card, and the exact physical mechanism producing the diagnostic classification. Suggest surface VFD setpoint trim to protect rod string integrity.
"""

def build_multi_well_triage_prompt(
    wells_summary: List[Dict[str, Any]],
    user_query: str
) -> str:
    """Constructs prompt for comparative triage and ranking across all monitored field wells."""
    wells_lines = []
    for w in wells_summary:
        wells_lines.append(
            f"- {w.get('wellCode', 'Well')}: {w.get('oilRateBopd', 0)} BOPD | Health: {w.get('healthScore', 0)}% | Fillage: {w.get('fillagePct', 0)}% | Status: {w.get('status', 'Normal')} | Concern: {w.get('dominantConcern', 'None')}"
        )
    field_text = "\n".join(wells_lines)

    return f"""SPECIALIZED WORKFLOW: MULTI-WELL FIELD TRIAGE & SURVEILLANCE COMPARISON
Baghewala Monitored Well States:
{field_text}

Engineer Query:
{user_query}

Instructions:
Rank wells by urgency, highlight highest attention priorities, compare physical mechanisms between high and low performing wells, and output a structured comparison array.
"""
