from datetime import datetime
from .common import TimestampSchema, BaseSchema

class AnomalyResponse(TimestampSchema):
    well_id: str
    timestamp: datetime
    severity: str
    score: float
    affected_metric: str
    time_window: str
    evidence: str
    possible_cause: str
