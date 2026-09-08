"""
Pydantic Schemas for SRP ML Condition Monitoring.
"""
from datetime import datetime
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field, ConfigDict


class SRPPredictionRequest(BaseModel):
    """
    Input telemetry and dynamometer metrics for SRP Autoencoder inference.
    Accepts both metric (kN, meters) or field units (lbf, ft*lbf).
    """
    spm: float = Field(..., description="Strokes per minute", ge=0.0, le=30.0)
    pump_fillage: float = Field(..., description="Pump barrel fillage percentage", ge=0.0, le=100.0)
    min_rod_weight: float = Field(..., description="Minimum polished rod load (kN or lbf)")
    max_rod_weight: float = Field(..., description="Maximum/peak polished rod load (kN or lbf)")
    dynamometer_area: Optional[float] = Field(None, description="Dynamometer card enclosed loop area")
    dyno_surface_points: Optional[List[List[float]]] = Field(
        None, description="Optional surface dyno loop points [[pos, load], ...] to derive area"
    )
    well_id: Optional[str] = Field("well-bw-017", description="Associated well identifier")
    is_metric: bool = Field(True, description="Whether rod loads are provided in metric units (kN)")


class SRPPredictionResponse(BaseModel):
    """
    Anomaly inference result produced by the PyTorch SRP Autoencoder.
    """
    condition: str = Field(..., description="Condition state: NORMAL | WARNING | CRITICAL")
    anomaly_score: float = Field(..., description="Reconstruction MSE anomaly score")
    warning_threshold: float = Field(..., description="Model threshold for warning level")
    critical_threshold: float = Field(..., description="Model threshold for critical level")
    model_version: str = Field(..., description="Model version tag e.g. srp-autoencoder-v1")
    inputs: Dict[str, float] = Field(..., description="Normalized feature inputs fed to the model")
    warnings: List[str] = Field(default_factory=list, description="Distribution clipping warnings")
    is_healthy: bool = Field(..., description="Convenience boolean flag indicating normal state")


class SRPPredictionHistoryItem(BaseModel):
    """
    Historical prediction entry for trend tracking.
    """
    id: str
    well_id: str
    timestamp: datetime
    condition: str
    anomaly_score: float
    warning_threshold: float
    critical_threshold: float
    spm: float
    pump_fillage: float
    min_rod_weight: float
    max_rod_weight: float
    dynamometer_area: float
    rod_load_range: float
    model_version: str

    model_config = ConfigDict(from_attributes=True)



class FieldSrpStatusItem(BaseModel):
    """
    Summary condition for a well in field overview.
    """
    well_id: str
    well_code: str
    condition: str
    anomaly_score: float
    status_label: str
    last_evaluated: datetime
