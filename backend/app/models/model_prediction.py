from datetime import datetime
from sqlalchemy import String, Float, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin

class ModelPrediction(Base, TimestampMixin):
    __tablename__ = "model_predictions"

    well_id: Mapped[str] = mapped_column(String(36), ForeignKey("wells.id", ondelete="CASCADE"), index=True, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=False)

    model_name: Mapped[str] = mapped_column(String(50), nullable=False)
    target_metric: Mapped[str] = mapped_column(String(50), nullable=False)
    predicted_value: Mapped[float] = mapped_column(Float, nullable=False)
    actual_value: Mapped[float] = mapped_column(Float, nullable=True)
    p10_value: Mapped[float] = mapped_column(Float, nullable=True)
    p90_value: Mapped[float] = mapped_column(Float, nullable=True)
    residual_error: Mapped[float] = mapped_column(Float, nullable=True)
    confidence_pct: Mapped[float] = mapped_column(Float, default=93.0)
    model_version: Mapped[str] = mapped_column(String(20), default="v1.0")
