from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class AiEvidenceItem(BaseModel):
    source: str
    metric: str
    value: Any
    unit: Optional[str] = ""
    status: Optional[str] = None
    provenance: str = "OBSERVED"

class AiActionItem(BaseModel):
    type: str = "NAVIGATE"
    target: str
    well_id: Optional[str] = None
    label: str
    description: Optional[str] = None

class WellComparisonItem(BaseModel):
    well_id: str
    well_code: str
    oil_rate_bopd: float
    water_cut_pct: float
    bht_c: float
    fillage_pct: float
    health_score: float
    dominant_concern: Optional[str] = None
    status: str

class DataSufficiency(BaseModel):
    is_sufficient: bool
    available_metrics: List[str] = Field(default_factory=list)
    missing_metrics: List[str] = Field(default_factory=list)

class AiChatRequest(BaseModel):
    message: str
    well_id: Optional[str] = None
    current_route: Optional[str] = None
    active_tab: Optional[str] = None
    context: Optional[Dict[str, Any]] = None
    history: Optional[List[Dict[str, Any]]] = None

class AiChatResponse(BaseModel):
    answer: str
    intent: str = "PHYSICAL_REASONING"
    well_id: Optional[str] = None
    target_page: Optional[str] = None
    actions: List[AiActionItem] = Field(default_factory=list)
    evidence: List[AiEvidenceItem] = Field(default_factory=list)
    comparison: Optional[List[WellComparisonItem]] = None
    data_sufficiency: Optional[DataSufficiency] = None
    confidence: float = 0.95
    model: str = "gemini-1.5-flash"
    data_source: str = "fastapi_supabase"

