"""
Pydantic Schemas for CSS ML Field-Month Surrogate Model.
Mirrors the deployed Render API schema with Well Twin domain extensions.
"""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class MonthlyFieldRecordSchema(BaseModel):
    date: str = Field(..., description="Date of the monthly record (YYYY-MM-DD)")
    oil_m3: float = Field(..., ge=0.0, description="Monthly oil production in cubic meters")
    steam_t: float = Field(..., ge=0.0, description="Monthly injected steam mass in metric tonnes")
    steam_reported: Optional[bool] = Field(None, description="Flag whether steam was reported")
    water_m3: float = Field(0.0, ge=0.0, description="Produced water volume in m³")
    assoc_gas_thousand_m3: float = Field(0.0, ge=0.0, description="Associated gas in thousand m³")
    nonassoc_gas_thousand_m3: float = Field(0.0, ge=0.0, description="Non-associated gas in thousand m³")
    secondary_water_injection_m3: float = Field(0.0, ge=0.0, description="Secondary recovery water injection")
    wastewater_injection_m3: float = Field(0.0, ge=0.0, description="Disposal wastewater injection")
    gas_injection_thousand_m3: float = Field(0.0, ge=0.0, description="Gas injection in thousand m³")
    co2_injection_thousand_m3: float = Field(0.0, ge=0.0, description="CO2 injection in thousand m³")
    nitrogen_injection_thousand_m3: float = Field(0.0, ge=0.0, description="Nitrogen injection in thousand m³")
    injector_well_count: int = Field(0, ge=0, description="Count of active injectors")
    producer_well_count: int = Field(0, ge=0, description="Count of active producers")
    negative_water_count: int = Field(0, ge=0, description="Negative water correction count")


class CSSPredictionRequest(BaseModel):
    state: str = Field(..., min_length=1, max_length=20, description="State/Province code (e.g., RJ)")
    basin: str = Field(..., min_length=1, max_length=200, description="Sedimentary basin")
    field: str = Field(..., min_length=1, max_length=200, description="Field name")
    history: List[MonthlyFieldRecordSchema] = Field(
        ..., min_length=4, description="Chronological monthly records, minimum 4 items"
    )
    well_id: Optional[str] = Field("well-bw-017", description="Well Twin well identifier for audit log")


class CSSPredictionResponse(BaseModel):
    model_version: str
    model_scope: str
    field_id: str
    input_month: str
    forecast_month: str
    predicted_next_oil_m3: float
    prediction_interval_m3: Optional[List[float]] = None
    current_steam_t: float
    steam_production_ratio_t_per_m3: float
    data_quality_warnings: List[str] = []
    # Enhanced domain fields:
    predicted_oil_bbl: Optional[float] = None
    forecast_osr: Optional[float] = None
    economic_status: Optional[str] = None
    is_fallback: bool = False


class CSSSensitivityRequest(BaseModel):
    state: str = Field(..., min_length=1, max_length=20)
    basin: str = Field(..., min_length=1, max_length=200)
    field: str = Field(..., min_length=1, max_length=200)
    history: List[MonthlyFieldRecordSchema] = Field(..., min_length=4)
    steam_change_percentages: List[float] = Field(
        default=[-20.0, -10.0, 0.0, 10.0, 20.0],
        min_length=1,
        max_length=21,
        description="List of percentage adjustments to evaluate"
    )


class SensitivityScenarioItem(BaseModel):
    steam_change_percent: float
    candidate_steam_t: float
    predicted_next_field_oil_m3: float
    steam_production_ratio_t_per_m3: float


class CSSSensitivityResponse(BaseModel):
    model_version: str
    model_scope: str
    analysis_type: str
    field_id: str
    input_month: str
    forecast_month: str
    baseline_steam_t: float
    scenarios: List[SensitivityScenarioItem]
    data_quality_warnings: List[str] = []


class CSSPredictionHistoryItem(BaseModel):
    id: str
    well_id: str
    created_at: datetime
    forecast_month: str
    predicted_next_oil_m3: float
    predicted_oil_bbl: float
    current_steam_t: float
    steam_production_ratio_t_per_m3: float
    forecast_osr: float
    economic_status: str
    model_version: str
