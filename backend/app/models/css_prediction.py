"""
SQLAlchemy Model for CSS ML Surrogate Predictions.
Persists next-month production forecasts and economic cutoffs for audit trails and surveillance.
"""
from typing import Optional
from sqlalchemy import Float, String, Index, Text
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TimestampMixin


class CssPrediction(Base, TimestampMixin):
    __tablename__ = "css_predictions"

    well_id: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    field_id: Mapped[str] = mapped_column(String(100), nullable=False)
    input_month: Mapped[str] = mapped_column(String(20), nullable=False)
    forecast_month: Mapped[str] = mapped_column(String(20), nullable=False)
    predicted_next_oil_m3: Mapped[float] = mapped_column(Float, nullable=False)
    predicted_oil_bbl: Mapped[float] = mapped_column(Float, nullable=False)
    current_steam_t: Mapped[float] = mapped_column(Float, nullable=False)
    steam_production_ratio: Mapped[float] = mapped_column(Float, nullable=False)
    forecast_osr: Mapped[float] = mapped_column(Float, nullable=False)
    economic_status: Mapped[str] = mapped_column(String(30), nullable=False)
    model_version: Mapped[str] = mapped_column(String(50), nullable=False, default="css-field-month-surrogate-v1.0.0")
    raw_response: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    __table_args__ = (
        Index("ix_css_pred_well_created", "well_id", "created_at"),
    )
