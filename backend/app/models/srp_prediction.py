"""
SQLAlchemy Model for SRP ML Predictions.
Persists condition evaluations for audit trails, trend inspection, and historical anomaly analysis.
"""
from sqlalchemy import Float, String, Index
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TimestampMixin


class SrpPrediction(Base, TimestampMixin):
    __tablename__ = "srp_predictions"

    well_id: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    spm: Mapped[float] = mapped_column(Float, nullable=False)
    pump_fillage: Mapped[float] = mapped_column(Float, nullable=False)
    min_rod_weight: Mapped[float] = mapped_column(Float, nullable=False)
    max_rod_weight: Mapped[float] = mapped_column(Float, nullable=False)
    dynamometer_area: Mapped[float] = mapped_column(Float, nullable=False)
    rod_load_range: Mapped[float] = mapped_column(Float, nullable=False)
    anomaly_score: Mapped[float] = mapped_column(Float, nullable=False)
    condition: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    warning_threshold: Mapped[float] = mapped_column(Float, nullable=False)
    critical_threshold: Mapped[float] = mapped_column(Float, nullable=False)
    model_version: Mapped[str] = mapped_column(String(50), nullable=False, default="srp-autoencoder-v1")

    __table_args__ = (
        Index("ix_srp_pred_well_created", "well_id", "created_at"),
    )
