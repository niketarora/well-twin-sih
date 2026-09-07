from datetime import datetime
from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, model_validator
from .common import TimestampSchema, BaseSchema

class SosCategory(str, Enum):
    FIRE_SMOKE = "FIRE_SMOKE"
    UNUSUAL_SMELL = "UNUSUAL_SMELL"
    SUSPECTED_LEAK = "SUSPECTED_LEAK"
    FLUID_LEAK = "FLUID_LEAK"
    MEDICAL_EMERGENCY = "MEDICAL_EMERGENCY"
    EQUIPMENT_HAZARD = "EQUIPMENT_HAZARD"
    PERSONNEL_DANGER = "PERSONNEL_DANGER"
    OTHER = "OTHER"

class SosCreateRequest(BaseModel):
    """Manual SOS report payload. Deliberately minimal: a worker in an emergency reports what
    they observed (category) and where (well_id or location_description) - nothing else is
    mandatory. There is no severity field: a raised SOS is inherently treated as urgent, and no
    Digital Twin/telemetry/ML input is used anywhere in this flow.
    """
    category: SosCategory
    well_id: Optional[str] = None
    location_description: Optional[str] = None
    description: Optional[str] = None
    reporter_name: Optional[str] = None
    reporter_role: Optional[str] = None
    reporter_contact: Optional[str] = None

    @model_validator(mode="after")
    def require_location_context(self):
        if not self.well_id and not self.location_description:
            raise ValueError("Provide at least one of 'well_id' or 'location_description'.")
        return self

class IncidentResponse(TimestampSchema):
    source_type: str
    category: str
    status: str
    well_id: Optional[str] = None
    location_description: Optional[str] = None
    description: Optional[str] = None
    reporter_name: Optional[str] = None
    reporter_role: Optional[str] = None
    reporter_contact: Optional[str] = None
    possible_duplicate_of: Optional[str] = None
    acknowledged_by: Optional[str] = None
    acknowledged_at: Optional[datetime] = None
    resolved_by: Optional[str] = None
    resolved_at: Optional[datetime] = None
    resolution_notes: Optional[str] = None
    escalation_level: int = 0
    escalated_at: Optional[datetime] = None
    escalated_by: Optional[str] = None
    escalation_notes: Optional[str] = None

class NotificationResultSchema(BaseSchema):
    contact_name: Optional[str] = None
    contact_role: Optional[str] = None
    channel: str
    provider: str
    status: str

class SosResponse(BaseModel):
    incident: IncidentResponse
    notifications: List[NotificationResultSchema]

class IncidentAcknowledgeRequest(BaseModel):
    engineer_id: Optional[str] = "eng-001"
    notes: Optional[str] = None

class IncidentResolveRequest(BaseModel):
    engineer_id: Optional[str] = "eng-001"
    corrective_action: str

class IncidentEscalateRequest(BaseModel):
    engineer_id: Optional[str] = "eng-001"
    notes: Optional[str] = None
