from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from .common import TimestampSchema, BaseSchema

class TelemetryReadingBase(BaseSchema):
    well_id: str
    timestamp: datetime
    oil_rate: float
    water_rate: float
    steam_rate: float
    gas_rate: float
    bottomhole_pressure: float
    bottomhole_temperature: float
    wellhead_pressure: float
    wellhead_temperature: float
    casing_pressure: float
    tubing_pressure: float
    flowline_pressure: float
    pump_speed: float
    stroke_rate: float
    stroke_length_m: float
    pump_fillage: float
    fluid_level_m: float
    motor_current: float
    motor_power_kw: float
    torque: float
    vibration: float
    peak_polished_rod_load: float
    minimum_polished_rod_load: float
    provenance: str = "OBSERVED"

class TelemetryReadingResponse(TimestampSchema, TelemetryReadingBase):
    pass

class PaginatedTelemetryResponse(BaseModel):
    total: int
    items: List[TelemetryReadingResponse]

class TrendPointResponse(BaseModel):
    timestamp: str
    oil_rate: Optional[float] = None
    water_rate: Optional[float] = None
    temperature: Optional[float] = None
    pressure: Optional[float] = None
    viscosity: Optional[float] = None
    fillage: Optional[float] = None
    efficiency: Optional[float] = None
    predicted_oil: Optional[float] = None
    actual_oil: Optional[float] = None
