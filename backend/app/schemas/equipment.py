from datetime import datetime
from typing import Optional
from .common import TimestampSchema, BaseSchema

class EquipmentResponse(TimestampSchema):
    well_id: str
    tag: str
    name: str
    category: str
    status: str
    health_score: float
    operating_hours: float
    goodman_stress_pct: float
    last_inspection: Optional[datetime] = None
    next_inspection: Optional[datetime] = None
