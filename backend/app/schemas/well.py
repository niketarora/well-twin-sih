from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime
from .common import TimestampSchema, BaseSchema

class WellBase(BaseSchema):
    well_code: str
    name: str
    field_name: str
    basin: str
    latitude: float
    longitude: float
    formation: str
    reservoir_depth_m: float
    total_depth_m: float
    crude_api: float
    dead_oil_viscosity_cp: float
    current_cycle: int
    operating_phase: str
    artificial_lift_type: str
    status: str
    description: Optional[str] = ""

class WellSummaryResponse(TimestampSchema, WellBase):
    pass

class WellDetailResponse(WellSummaryResponse):
    pass

class SubsystemHealthItem(BaseModel):
    score: int
    status: str
    dominant_concern: Optional[str] = None

class WellHealthResponse(BaseModel):
    well_id: str
    overall_score: int
    overall_status: str
    dominant_concern: str
    subsystems: Dict[str, SubsystemHealthItem]
    last_updated: datetime

class TelemetrySnapshot(BaseModel):
    oil_rate_bopd: float
    water_rate_bwpd: float
    bottomhole_pressure_bar: float
    bottomhole_temp_c: float
    pump_fillage_pct: float
    viscosity_cp: float
    stroke_rate_spm: float
    peak_rod_load_kn: float
    status: str

class WellStateResponse(BaseModel):
    well_id: str
    operating_phase: str
    cycle_day: int
    subsurface: TelemetrySnapshot
    surface: TelemetrySnapshot
    last_updated: datetime
