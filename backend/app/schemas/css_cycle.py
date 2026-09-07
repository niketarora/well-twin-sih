from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from .common import TimestampSchema, BaseSchema

class CssCycleResponse(TimestampSchema):
    well_id: str
    cycle_number: int
    start_date: datetime
    end_date: Optional[datetime]
    steam_injected_tons: float
    oil_produced_bbls: float
    csor: float
    status: str
    current_phase: str
    phase_day: int
    total_phase_days: int

class PhaseMetric(BaseModel):
    name: str
    duration_days: int
    status: str

class CssCycleDetailResponse(CssCycleResponse):
    phases: List[PhaseMetric] = []
