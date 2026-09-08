from typing import Optional, Dict, Any, Tuple
from app.schemas.navigator import NavigatorIntent

class GroundingGate:
    def evaluate(
        self,
        intent: NavigatorIntent,
        well_data: Optional[Dict[str, Any]],
        telemetry: Optional[Dict[str, Any]],
        query: str
    ) -> Tuple[bool, str]:
        """Evaluates whether required verified data exists. Returns (is_grounded, failure_reason)."""
        q = query.lower()

        # Specific metric checks for impossible/missing queries
        if "reservoir pressure yesterday" in q or "exact reservoir pressure" in q:
            return False, "Historical daily reservoir pressure telemetry is not recorded in the active surveillance dataset."

        # If well is required for well-specific intents
        well_specific_intents = {
            NavigatorIntent.EXPLAIN_WELL,
            NavigatorIntent.VIEW_WELL_HEALTH,
            NavigatorIntent.VIEW_PRODUCTION,
            NavigatorIntent.VIEW_TRENDS,
            NavigatorIntent.VIEW_CSS_CYCLE,
            NavigatorIntent.WEBSITE_DATA_QUERY,
        }

        if intent in well_specific_intents:
            if not well_data:
                return False, "Requested well is not found in the Baghewala Field Registry."
            if not telemetry:
                return False, "Live telemetry stream is currently disconnected or missing for this well."

        return True, ""

grounding_gate = GroundingGate()
