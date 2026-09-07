from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from .common import TimestampSchema, BaseSchema

class ModelStateResponse(TimestampSchema):
    well_id: str
    timestamp: datetime
    reservoir_temp_c: float
    steam_chamber_radius_m: float
    heat_loss_rate_kw: float
    crude_viscosity_cp: float
    flowing_bottomhole_pressure_bar: float
    liquid_holdup: float
    pump_fillage_pct: float
    fluid_pound_marker_m: float
    rod_peak_stress_ratio: float
    solver_convergence_mape: float
    provenance: str = "MODEL DERIVED"

class ModelPredictionResponse(TimestampSchema):
    well_id: str
    timestamp: datetime
    model_name: str
    target_metric: str
    predicted_value: float
    actual_value: Optional[float] = None
    p10_value: Optional[float] = None
    p90_value: Optional[float] = None
    residual_error: Optional[float] = None
    confidence_pct: float = 93.0
    model_version: str = "v1.0"
