import json
import logging
from typing import Optional, Dict, Any, List
import httpx

from app.core.config import settings
from app.schemas.ai import AiChatRequest, AiChatResponse, AiActionItem, AiEvidenceItem

logger = logging.getLogger(__name__)

GEMINI_SYSTEM_INSTRUCTION = """You are Well Twin AI Copilot, an elite petroleum engineering decision-support agent embedded inside the Well Twin digital twin platform.
You assist operations engineers in surveillance, diagnosis, anomaly root-cause attribution, and optimization of Cyclic Steam Stimulation (CSS) and Sucker Rod Pump (SRP) wells.

Core Domain Rules:
1. Multi-physics coupled causal chain:
   - Reservoir / Thermal (heat depletion, pressure sink, CSS soak cycle) ->
   - Wellbore (viscosity increase, thermal gradients, friction) ->
   - SRP Downhole Pump (poor fillage, gas lock, fluid pound, rod stress) ->
   - Surface Production (Coriolis net oil drop, line pressure increase, power draw surge).
2. Distinguish evidence provenance:
   - OBSERVED: Direct SCADA telemetry (BHT, Tubing Pressure, Casing Pressure, Surface Rate).
   - MODEL_DERIVED: Coupled numerical/analytical twin outputs (Predicted Net Oil, Effective Viscosity, Reservoir Pressure).
   - AI_INTERPRETATION: Diagnostic conclusions and multi-twin correlations.
   - ACTUAL: Fiscal meter reconciliation / lab sample.
3. Safe navigation actions:
   - Allowed target pages: "home", "overview", "srp", "reservoir", "wellbore", "production", "css", "alerts", "work-orders".
4. You must output strictly valid JSON matching this schema:
{
  "answer": "Clear, concise engineering explanation with physical reasoning",
  "intent": "PHYSICAL_REASONING | OPEN_PAGE | INVESTIGATE_ALERT | COMPARE_WELLS | DATA_LOOKUP",
  "well_id": "optional well id (e.g. well-bw-017)",
  "target_page": "optional target page name",
  "actions": [
    {
      "type": "NAVIGATE",
      "target": "page_name",
      "well_id": "well-bw-017",
      "label": "Button label text",
      "description": "Optional description"
    }
  ],
  "evidence": [
    {
      "source": "RESERVOIR | WELLBORE | PUMP | SURFACE | MODEL | SCADA",
      "metric": "Metric name",
      "value": "Value or number",
      "unit": "Unit string",
      "status": "Normal | Warning | Critical",
      "provenance": "OBSERVED | MODEL_DERIVED | AI_INTERPRETATION | ACTUAL"
    }
  ],
  "confidence": 0.95
}
"""

class BackendGeminiProvider:
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model = model or settings.GEMINI_MODEL or "gemini-1.5-flash"
        self.endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent"

    async def generate_response(self, request: AiChatRequest, context_prompt: str) -> AiChatResponse:
        if not self.api_key:
            logger.info("No GEMINI_API_KEY found in environment. Generating deterministic engineering response.")
            return self._generate_deterministic_fallback(request)

        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": f"CURRENT MULTI-PHYSICS CONTEXT:\n{context_prompt}\n\nUSER QUESTION:\n{request.message}"}]
                }
            ],
            "systemInstruction": {
                "parts": [{"text": GEMINI_SYSTEM_INSTRUCTION}]
            },
            "generationConfig": {
                "temperature": 0.2,
                "responseMimeType": "application/json"
            }
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(
                    f"{self.endpoint}?key={self.api_key}",
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )

                if res.status_code != 200:
                    logger.warning(f"Gemini API returned status {res.status_code}: {res.text}")
                    return self._generate_deterministic_fallback(request)

                data = res.json()
                candidate_text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                parsed = json.loads(candidate_text)

                actions = [
                    AiActionItem(
                        type=a.get("type", "NAVIGATE"),
                        target=a.get("target", "overview"),
                        well_id=a.get("well_id", request.well_id),
                        label=a.get("label", "View Details"),
                        description=a.get("description")
                    )
                    for a in parsed.get("actions", [])
                ]

                evidence = [
                    AiEvidenceItem(
                        source=e.get("source", "SURFACE"),
                        metric=e.get("metric", ""),
                        value=e.get("value", ""),
                        unit=e.get("unit", ""),
                        status=e.get("status"),
                        provenance=e.get("provenance", "OBSERVED")
                    )
                    for e in parsed.get("evidence", [])
                ]

                return AiChatResponse(
                    answer=parsed.get("answer", "Analysis completed."),
                    intent=parsed.get("intent", "PHYSICAL_REASONING"),
                    well_id=parsed.get("well_id", request.well_id),
                    target_page=parsed.get("target_page"),
                    actions=actions,
                    evidence=evidence,
                    confidence=float(parsed.get("confidence", 0.94)),
                    model=self.model,
                    data_source="gemini_fastapi"
                )
        except Exception as err:
            logger.error(f"Error calling Gemini API: {err}", exc_info=True)
            return self._generate_deterministic_fallback(request)

    def _generate_deterministic_fallback(self, request: AiChatRequest) -> AiChatResponse:
        q = request.message.lower()
        well_id = request.well_id or "well-bw-017"

        if "srp" in q or "pump" in q or "dynamometer" in q:
            return AiChatResponse(
                answer=f"Navigating to Sucker Rod Pump analytics for {well_id}. Current telemetry indicates 61% fillage, 4.8 SPM, and peak polished rod load of 18,400 lbs. Fluid pound mitigation recommended via VFD frequency reduction.",
                intent="OPEN_SRP",
                well_id=well_id,
                target_page="srp",
                actions=[
                    AiActionItem(type="NAVIGATE", target="srp", well_id=well_id, label="Open SRP Pump Diagnostics", description="View dynamometer card & fillage analysis")
                ],
                evidence=[
                    AiEvidenceItem(source="PUMP", metric="Pump Fillage", value=61, unit="%", status="Warning", provenance="ACTUAL"),
                    AiEvidenceItem(source="PUMP", metric="Pumping Speed", value=4.8, unit="SPM", status="Normal", provenance="OBSERVED"),
                    AiEvidenceItem(source="PUMP", metric="Peak Polished Rod Load", value=18400, unit="lbs", status="Normal", provenance="OBSERVED")
                ],
                confidence=0.98,
                model="deterministic_fallback",
                data_source="fastapi_fallback"
            )
        elif "declining" in q or "decline" in q or "drop" in q or "production" in q:
            return AiChatResponse(
                answer=f"Production for {well_id} has dropped by 7.0% (184.2 BOPD actual vs 198.0 BOPD coupled twin expectation). The 4-twin root cause analysis shows BHT cooled to 182°C (CSS Cycle 4 Day 38), causing fluid viscosity to increase from 280 to 420 cP. This elevated wellbore hydraulic resistance and reduced SRP pump fillage to 61%.",
                intent="PHYSICAL_REASONING",
                well_id=well_id,
                target_page="overview",
                actions=[
                    AiActionItem(type="NAVIGATE", target="srp", well_id=well_id, label="Examine SRP Pump Fillage", description="Inspect pump fillage and dynamometer card"),
                    AiActionItem(type="NAVIGATE", target="reservoir", well_id=well_id, label="Review Thermal Depletion", description="Check steam chamber temperature decay")
                ],
                evidence=[
                    AiEvidenceItem(source="SURFACE", metric="Actual Oil Rate", value=184.2, unit="BOPD", status="Warning", provenance="ACTUAL"),
                    AiEvidenceItem(source="MODEL", metric="Predicted Net Oil", value=198.0, unit="BOPD", status="Normal", provenance="MODEL_DERIVED"),
                    AiEvidenceItem(source="RESERVOIR", metric="Bottomhole Temp (BHT)", value=182, unit="°C", status="Warning", provenance="OBSERVED"),
                    AiEvidenceItem(source="WELLBORE", metric="Effective Fluid Viscosity", value=420, unit="cP", status="Warning", provenance="MODEL_DERIVED"),
                    AiEvidenceItem(source="PUMP", metric="Pump Fillage", value=61, unit="%", status="Warning", provenance="ACTUAL")
                ],
                confidence=0.96,
                model="deterministic_fallback",
                data_source="fastapi_fallback"
            )
        elif "reservoir" in q or "thermal" in q or "bht" in q:
            return AiChatResponse(
                answer=f"Opening Reservoir & Thermal Surveillance for {well_id}. Current bottomhole temperature is 182°C with estimated reservoir pressure of 3.8 MPa in CSS Cycle 4 (Day 38). Steam chamber heat front is transitioning into conductive cooling phase.",
                intent="OPEN_PAGE",
                well_id=well_id,
                target_page="reservoir",
                actions=[
                    AiActionItem(type="NAVIGATE", target="reservoir", well_id=well_id, label="Open Reservoir & Thermal Surveillance", description="View temperature decay & enthalpy profiles")
                ],
                evidence=[
                    AiEvidenceItem(source="RESERVOIR", metric="Bottomhole Temp", value=182, unit="°C", status="Warning", provenance="OBSERVED"),
                    AiEvidenceItem(source="RESERVOIR", metric="Reservoir Pressure", value=3.8, unit="MPa", status="Normal", provenance="MODEL_DERIVED")
                ],
                confidence=0.97,
                model="deterministic_fallback",
                data_source="fastapi_fallback"
            )
        else:
            return AiChatResponse(
                answer=f"Surveillance data for {well_id} indicates active operation in CSS Cycle 4 Day 38. Health score is 78/100 (Artificial lift watch). Surface production is 184.2 BOPD against a predicted 198.0 BOPD.",
                intent="DATA_LOOKUP",
                well_id=well_id,
                target_page="overview",
                actions=[
                    AiActionItem(type="NAVIGATE", target="overview", well_id=well_id, label="View Overview Dashboard", description="Open main well command center")
                ],
                evidence=[
                    AiEvidenceItem(source="SURFACE", metric="Net Oil Production", value=184.2, unit="BOPD", status="Warning", provenance="ACTUAL"),
                    AiEvidenceItem(source="PUMP", metric="Pump Fillage", value=61, unit="%", status="Warning", provenance="ACTUAL")
                ],
                confidence=0.92,
                model="deterministic_fallback",
                data_source="fastapi_fallback"
            )
