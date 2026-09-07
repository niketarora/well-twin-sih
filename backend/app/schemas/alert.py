from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from .common import TimestampSchema, BaseSchema

class AlertResponse(TimestampSchema):
    well_id: str
    title: str
    severity: str
    subsystem: str
    metric: str
    observed_value: str
    threshold: str
    timestamp: datetime
    status: str
    explanation: str
    action_required: str
    acknowledged_by: Optional[str] = None
    acknowledged_at: Optional[datetime] = None
    resolved_by: Optional[str] = None
    resolved_at: Optional[datetime] = None

class AlertAcknowledgeRequest(BaseModel):
    engineer_id: Optional[str] = "eng-001"
    notes: Optional[str] = None

class AlertResolveRequest(BaseModel):
    engineer_id: Optional[str] = "eng-001"
    corrective_action: str
