from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class NavigatorIntent(str, Enum):
    NAVIGATE = "NAVIGATE"
    SELECT_WELL = "SELECT_WELL"
    VIEW_WELL_HEALTH = "VIEW_WELL_HEALTH"
    VIEW_PRODUCTION = "VIEW_PRODUCTION"
    VIEW_TRENDS = "VIEW_TRENDS"
    VIEW_CSS_CYCLE = "VIEW_CSS_CYCLE"
    VIEW_ALERTS = "VIEW_ALERTS"
    VIEW_RECOMMENDATIONS = "VIEW_RECOMMENDATIONS"
    VIEW_WORK_ORDERS = "VIEW_WORK_ORDERS"
    VIEW_EQUIPMENT = "VIEW_EQUIPMENT"
    VIEW_AI_INSIGHTS = "VIEW_AI_INSIGHTS"
    EXPLAIN_WELL = "EXPLAIN_WELL"
    EXPLAIN_ALERT = "EXPLAIN_ALERT"
    WEBSITE_DATA_QUERY = "WEBSITE_DATA_QUERY"
    GENERAL_KNOWLEDGE = "GENERAL_KNOWLEDGE"
    INSUFFICIENT_DATA = "INSUFFICIENT_DATA"
    NEEDS_CLARIFICATION = "NEEDS_CLARIFICATION"
    OUT_OF_SCOPE = "OUT_OF_SCOPE"

class NavigatorIntentResult(BaseModel):
    intent: NavigatorIntent
    target: Optional[str] = None
    well_id: Optional[str] = None
    confidence: float = 0.95
    reason: str = ""

class NavigatorNavigationAction(BaseModel):
    target: str
    well_id: Optional[str] = None
    route: str
    label: str

class NavigatorEvidence(BaseModel):
    label: str
    value: Any
    unit: Optional[str] = ""
    provenance: str = "OBSERVED"

class NavigatorRequest(BaseModel):
    message: str
    current_page: Optional[str] = "field_map"
    selected_well: Optional[str] = "BW-017"
    include_audio: bool = False
    context: Optional[Dict[str, Any]] = None

class NavigatorResponse(BaseModel):
    type: str  # "NAVIGATION" | "ANSWER" | "CLARIFICATION" | "INSUFFICIENT_DATA" | "OUT_OF_SCOPE" | "ERROR"
    intent: NavigatorIntent
    message: str
    well_id: Optional[str] = None
    navigation: Optional[NavigatorNavigationAction] = None
    evidence: List[NavigatorEvidence] = Field(default_factory=list)
    audio_base64: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
