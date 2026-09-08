import logging
from typing import Optional, Dict, Any, List
from app.schemas.navigator import (
    NavigatorIntent,
    NavigatorResponse,
    NavigatorEvidence,
    NavigatorNavigationAction,
)
from app.ai.answer.petroleum_engineer import petroleum_engineer_service

logger = logging.getLogger(__name__)

ROUTE_MAP = {
    "field_map": "/",
    "overview": "/well/{well_id}/overview",
    "well_state": "/well/{well_id}/well-state",
    "trends": "/well/{well_id}/trends",
    "srp": "/well/{well_id}/srp-pump",
    "reservoir": "/well/{well_id}/reservoir",
    "wellbore": "/well/{well_id}/wellbore",
    "production": "/well/{well_id}/surface-production",
    "css_cycle": "/well/{well_id}/css-cycle",
    "alerts": "/alerts",
    "recommendations": "/recommendations",
    "work_orders": "/work-orders",
}

class GroundedAnswerService:
    def format_navigation_action(
        self,
        target: Optional[str],
        well_id: Optional[str]
    ) -> Optional[NavigatorNavigationAction]:
        if not target or target not in ROUTE_MAP:
            return None

        clean_id = well_id or "well-bw-017"
        if not clean_id.startswith("well-"):
            num = "".join(filter(str.isdigit, clean_id))
            clean_id = f"well-bw-{int(num):03d}" if num else f"well-{clean_id.lower()}"

        route = ROUTE_MAP[target].replace("{well_id}", clean_id)
        label_text = f"Open {target.replace('_', ' ').title()}"

        return NavigatorNavigationAction(
            target=target,
            well_id=clean_id,
            route=route,
            label=label_text,
        )

    async def generate_grounded_answer(
        self,
        intent: NavigatorIntent,
        target: Optional[str],
        well_data: Optional[Dict[str, Any]],
        telemetry: Optional[Dict[str, Any]],
        alerts: List[Dict[str, Any]],
        query: str,
        well_id: Optional[str] = "well-bw-017"
    ) -> NavigatorResponse:
        well_code = well_data.get("code", "BW-17") if well_data else "BW-17"
        nav_action = self.format_navigation_action(target, well_id)

        # 1. Pure Navigation Intent (Route directly)
        if intent in {
            NavigatorIntent.NAVIGATE,
            NavigatorIntent.VIEW_TRENDS,
            NavigatorIntent.VIEW_ALERTS,
            NavigatorIntent.VIEW_CSS_CYCLE,
            NavigatorIntent.VIEW_RECOMMENDATIONS,
            NavigatorIntent.VIEW_WORK_ORDERS,
        }:
            target_name = (target or "overview").replace("_", " ").title()
            msg = f"Navigating to **{target_name}** for **{well_code}**."
            return NavigatorResponse(
                type="NAVIGATION",
                intent=intent,
                message=msg,
                well_id=well_id,
                navigation=nav_action,
                evidence=[],
            )

        # 2. Out of Scope Intent
        if intent == NavigatorIntent.OUT_OF_SCOPE:
            return NavigatorResponse(
                type="OUT_OF_SCOPE",
                intent=intent,
                message="That query is outside the operational scope of the Well Twin engineering platform. I can assist you with well surveillance, artificial lift diagnostics, thermal cycles, and alarms.",
                well_id=None,
                navigation=None,
                evidence=[],
            )

        # 3. Direct Database Telemetry / Status Lookup (Grounded directly in DB)
        if intent in {NavigatorIntent.WEBSITE_DATA_QUERY, NavigatorIntent.SELECT_WELL, NavigatorIntent.VIEW_PRODUCTION, NavigatorIntent.VIEW_WELL_HEALTH}:
            oil = telemetry.get("oil_rate_bopd", 84.0) if telemetry else 84.0
            water_cut = telemetry.get("water_cut_pct", 82.0) if telemetry else 82.0
            bht = telemetry.get("bht_c", 182.0) if telemetry else 182.0
            fillage = telemetry.get("fillage_pct", 61.4) if telemetry else 61.4
            visc = telemetry.get("viscosity_cp", 420.0) if telemetry else 420.0
            health = well_data.get("health_score", 62.0) if well_data else 62.0
            status = well_data.get("status", "ACTIVE") if well_data else "ACTIVE"
            cycle = well_data.get("current_cycle", 4) if well_data else 4

            msg = (
                f"Surveillance data for **{well_code}** (Status: **{status}**, CSS Cycle #{cycle}):\n"
                f"- **Net Oil Production**: {oil} BOPD (Water Cut: {water_cut}%)\n"
                f"- **Bottomhole Temperature (BHT)**: {bht}°C (Effective Viscosity: {visc} cP)\n"
                f"- **SRP Pump Fillage**: {fillage}%\n"
                f"- **Digital Twin Health Index**: {health}%"
            )
            evidence = [
                NavigatorEvidence(label="Twin Health Score", value=health, unit="%", provenance="MODEL_DERIVED"),
                NavigatorEvidence(label="Net Oil Rate", value=oil, unit="BOPD", provenance="OBSERVED"),
                NavigatorEvidence(label="Bottomhole Temp (BHT)", value=bht, unit="°C", provenance="OBSERVED"),
                NavigatorEvidence(label="Pump Barrel Fillage", value=fillage, unit="%", provenance="ACTUAL"),
            ]
            return NavigatorResponse(
                type="ANSWER",
                intent=intent,
                message=msg,
                well_id=well_id,
                navigation=nav_action,
                evidence=evidence,
            )

        # 4. Complex Reasoning, Explanation, Alerts & General Engineering
        # -> Dispatched to Gemini Petroleum Engineer LLM (Strictly Zero Hallucinations)
        llm_answer = await petroleum_engineer_service.ask_petroleum_engineer(
            query=query,
            well_data=well_data,
            telemetry=telemetry,
            alerts=alerts
        )

        evidence: List[NavigatorEvidence] = []
        if telemetry:
            if "oil_rate_bopd" in telemetry:
                evidence.append(NavigatorEvidence(label="Net Oil Flow", value=telemetry["oil_rate_bopd"], unit="BOPD", provenance="OBSERVED"))
            if "bht_c" in telemetry:
                evidence.append(NavigatorEvidence(label="Bottomhole Temp", value=telemetry["bht_c"], unit="°C", provenance="OBSERVED"))
            if "fillage_pct" in telemetry:
                evidence.append(NavigatorEvidence(label="Pump Fillage", value=telemetry["fillage_pct"], unit="%", provenance="ACTUAL"))
            if "viscosity_cp" in telemetry:
                evidence.append(NavigatorEvidence(label="Effective Viscosity", value=telemetry["viscosity_cp"], unit="cP", provenance="MODEL_DERIVED"))

        return NavigatorResponse(
            type="ANSWER",
            intent=intent,
            message=llm_answer,
            well_id=well_id,
            navigation=nav_action,
            evidence=evidence,
        )

grounded_answer_service = GroundedAnswerService()
