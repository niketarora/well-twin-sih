import json
import logging
from typing import Optional
import httpx
from app.core.config import settings
from app.schemas.navigator import NavigatorIntent, NavigatorIntentResult
from app.ai.router.prompt import ROUTER_SYSTEM_INSTRUCTION

logger = logging.getLogger(__name__)

VALID_TARGETS = {
    "field_map",
    "overview",
    "well_state",
    "trends",
    "srp",
    "reservoir",
    "wellbore",
    "production",
    "css_cycle",
    "alerts",
    "recommendations",
    "work_orders",
}

VALID_WELLS = {"BW-01", "BW-04", "BW-17", "BW-22", "BW-23", "BW-31"}

class GeminiIntentRouter:
    def __init__(self):
        self.model = settings.GEMINI_MODEL or "gemini-1.5-flash"
        self.endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent"

    @property
    def active_api_key(self) -> Optional[str]:
        import os
        return os.getenv("GEMINI_API_KEY") or settings.GEMINI_API_KEY

    async def classify_intent(
        self,
        message: str,
        current_page: str = "field_map",
        selected_well: str = "BW-017"
    ) -> NavigatorIntentResult:
        api_key = self.active_api_key
        if not api_key:
            return self._deterministic_classify(message, selected_well)

        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {
                            "text": f"Current UI State:\n- Page: {current_page}\n- Selected Well: {selected_well}\n\nUser Message: {message}"
                        }
                    ],
                }
            ],
            "systemInstruction": {
                "parts": [{"text": ROUTER_SYSTEM_INSTRUCTION}]
            },
            "generationConfig": {
                "temperature": 0.1,
                "responseMimeType": "application/json",
            },
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(
                    f"{self.endpoint}?key={api_key}",
                    json=payload,
                    headers={"Content-Type": "application/json"},
                )

                if res.status_code != 200:
                    logger.warning(f"Gemini Router returned {res.status_code}: {res.text}")
                    return self._deterministic_classify(message, selected_well)

                data = res.json()
                text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                parsed = json.loads(text)

                raw_intent = parsed.get("intent", "NEEDS_CLARIFICATION")
                raw_target = parsed.get("target")
                raw_well = parsed.get("well_id")
                confidence = float(parsed.get("confidence", 0.95))
                reason = parsed.get("reason", "")

                # Validation & Guardrail: Ensure target is in manifest
                if raw_target and raw_target not in VALID_TARGETS:
                    raw_target = None

                # Validation & Guardrail: Ensure well_id exists in registry
                if raw_well and raw_well.upper() not in VALID_WELLS and raw_well.replace("well-", "").upper() not in VALID_WELLS:
                    # Unrecognized well queried (e.g. BW-999) -> Guardrail: INSUFFICIENT_DATA
                    return NavigatorIntentResult(
                        intent=NavigatorIntent.INSUFFICIENT_DATA,
                        target=None,
                        well_id=raw_well,
                        confidence=0.99,
                        reason=f"Well '{raw_well}' is not in the Baghewala Field Registry.",
                    )

                # Map to validated intent enum
                try:
                    intent_enum = NavigatorIntent(raw_intent)
                except ValueError:
                    intent_enum = NavigatorIntent.NEEDS_CLARIFICATION

                return NavigatorIntentResult(
                    intent=intent_enum,
                    target=raw_target,
                    well_id=raw_well or selected_well,
                    confidence=confidence,
                    reason=reason,
                )
        except Exception as e:
            logger.error(f"Error calling Gemini Router: {e}", exc_info=True)
            return self._deterministic_classify(message, selected_well)

    def _deterministic_classify(self, message: str, default_well: str) -> NavigatorIntentResult:
        q = message.lower().strip()

        # Guardrail: Check for unknown wells (e.g. BW-99, BW-999)
        if "bw-99" in q or "bw99" in q or "bw-999" in q:
            return NavigatorIntentResult(
                intent=NavigatorIntent.INSUFFICIENT_DATA,
                target=None,
                well_id="BW-99",
                confidence=0.99,
                reason="Well BW-99 is not in the Baghewala Field Registry.",
            )

        # Detect well code mentioned in query
        well_code = default_well
        for w in ["bw-01", "bw-04", "bw-17", "bw-22", "bw-23", "bw-31"]:
            if w in q or w.replace("-", "") in q:
                well_code = w.upper()
                break

        # Out of scope
        if any(w in q for w in ["cricket", "weather", "movie", "football", "recipe", "stock market", "president"]):
            return NavigatorIntentResult(
                intent=NavigatorIntent.OUT_OF_SCOPE,
                target=None,
                well_id=None,
                confidence=0.98,
                reason="Query is out of scope for petroleum engineering workstation.",
            )

        # Explicit Navigation Commands (e.g. "take me to", "navigate to", "open", "go to")
        is_nav = any(p in q for p in ["take me", "navigate", "open", "go to", "switch to", "show page", "show the page", "view page"])
        if is_nav:
            if "srp" in q or "pump" in q or "rod" in q or "dynamometer" in q:
                return NavigatorIntentResult(
                    intent=NavigatorIntent.VIEW_WELL_HEALTH,
                    target="srp",
                    well_id=well_code,
                    confidence=0.98,
                    reason="User explicitly requested navigation to SRP dynamics.",
                )
            if "trend" in q or "production" in q or "rate" in q:
                return NavigatorIntentResult(
                    intent=NavigatorIntent.VIEW_TRENDS,
                    target="trends",
                    well_id=well_code,
                    confidence=0.98,
                    reason="User requested navigation to trends.",
                )
            if "alert" in q or "alarm" in q:
                return NavigatorIntentResult(
                    intent=NavigatorIntent.VIEW_ALERTS,
                    target="alerts",
                    well_id=well_code,
                    confidence=0.98,
                    reason="User requested navigation to alerts.",
                )
            if "cycle" in q or "css" in q or "steam" in q:
                return NavigatorIntentResult(
                    intent=NavigatorIntent.VIEW_CSS_CYCLE,
                    target="css_cycle",
                    well_id=well_code,
                    confidence=0.98,
                    reason="User requested navigation to CSS cycle.",
                )
            if "work order" in q or "maintenance" in q:
                return NavigatorIntentResult(
                    intent=NavigatorIntent.VIEW_WORK_ORDERS,
                    target="work_orders",
                    well_id=well_code,
                    confidence=0.98,
                    reason="User requested navigation to work orders.",
                )

        # General Petroleum Engineering Knowledge & Physics Reasoning
        if any(term in q for term in [
            "fluid pound", "gas interference", "viscosity", "explain how", "how does",
            "what causes", "explain sucker rod", "downhole mechanics", "dynamometer card",
            "what is artificial lift", "what is css"
        ]):
            return NavigatorIntentResult(
                intent=NavigatorIntent.GENERAL_KNOWLEDGE,
                target=None,
                well_id=well_code,
                confidence=0.96,
                reason="General petroleum engineering inquiry.",
            )

        # Navigation: Trends
        if "trend" in q:
            return NavigatorIntentResult(
                intent=NavigatorIntent.VIEW_TRENDS,
                target="trends",
                well_id=well_code,
                confidence=0.98,
                reason="User requested production trends.",
            )

        # Navigation: SRP / Pump
        if "srp" in q or "pump" in q or "dynamometer" in q:
            return NavigatorIntentResult(
                intent=NavigatorIntent.VIEW_WELL_HEALTH,
                target="srp",
                well_id=well_code,
                confidence=0.98,
                reason="User requested SRP lift dynamics.",
            )

        # Navigation: Alerts
        if "alert" in q or "alarm" in q:
            if "explain" in q or "why" in q or "investigate" in q:
                return NavigatorIntentResult(
                    intent=NavigatorIntent.EXPLAIN_ALERT,
                    target="alerts",
                    well_id=well_code,
                    confidence=0.95,
                    reason="User requested alert explanation.",
                )
            return NavigatorIntentResult(
                intent=NavigatorIntent.VIEW_ALERTS,
                target="alerts",
                well_id=well_code,
                confidence=0.98,
                reason="User requested operational alerts.",
            )

        # Navigation: CSS Cycle
        if "cycle" in q or "css" in q or "steam" in q:
            return NavigatorIntentResult(
                intent=NavigatorIntent.VIEW_CSS_CYCLE,
                target="css_cycle",
                well_id=well_code,
                confidence=0.96,
                reason="User requested CSS cycle tracker.",
            )

        # Navigation: Recommendations
        if "recommend" in q:
            return NavigatorIntentResult(
                intent=NavigatorIntent.VIEW_RECOMMENDATIONS,
                target="recommendations",
                well_id=well_code,
                confidence=0.96,
                reason="User requested recommendations.",
            )

        # Navigation: Work Orders
        if "work order" in q:
            return NavigatorIntentResult(
                intent=NavigatorIntent.VIEW_WORK_ORDERS,
                target="work_orders",
                well_id=well_code,
                confidence=0.96,
                reason="User requested work orders.",
            )

        # Navigation: Field Map
        if "field map" in q or "all wells" in q or "home" in q:
            return NavigatorIntentResult(
                intent=NavigatorIntent.NAVIGATE,
                target="field_map",
                well_id=well_code,
                confidence=0.98,
                reason="User requested field map.",
            )

        # Explanation: "Why is BW-017 production declining?"
        if "why" in q or "declining" in q or "decline" in q or "investigate" in q:
            return NavigatorIntentResult(
                intent=NavigatorIntent.EXPLAIN_WELL,
                target="overview",
                well_id=well_code,
                confidence=0.95,
                reason="User requested 4-twin causal explanation of production decline.",
            )

        # Data Lookup: fillage, bht, rate
        if "fillage" in q or "bht" in q or "temperature" in q or "rate" in q or "score" in q or "bopd" in q:
            return NavigatorIntentResult(
                intent=NavigatorIntent.WEBSITE_DATA_QUERY,
                target="overview",
                well_id=well_code,
                confidence=0.94,
                reason="Specific telemetry lookup.",
            )

        # Default: Select Well
        return NavigatorIntentResult(
            intent=NavigatorIntent.SELECT_WELL,
            target="overview",
            well_id=well_code,
            confidence=0.90,
            reason="General well overview request.",
        )

gemini_router = GeminiIntentRouter()
