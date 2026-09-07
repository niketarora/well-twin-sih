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
    confidence: float = 0.95
    model: str = "gemini-1.5-flash"
    data_source: str = "fastapi_supabase"
