from datetime import datetime
from sqlalchemy import String, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin

class Alert(Base, TimestampMixin):
    __tablename__ = "alerts"

    well_id: Mapped[str] = mapped_column(String(36), ForeignKey("wells.id", ondelete="CASCADE"), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    severity: Mapped[str] = mapped_column(String(20), default="Warning")
    subsystem: Mapped[str] = mapped_column(String(50), default="Artificial Lift")
    metric: Mapped[str] = mapped_column(String(100), default="Pump Fillage")
    observed_value: Mapped[str] = mapped_column(String(100), default="84.6 %")
    threshold: Mapped[str] = mapped_column(String(100), default="< 88.0 %")
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="Active")
    explanation: Mapped[str] = mapped_column(Text, default="")
    action_required: Mapped[str] = mapped_column(Text, default="")
    acknowledged_by: Mapped[str] = mapped_column(String(100), nullable=True)
    acknowledged_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    resolved_by: Mapped[str] = mapped_column(String(100), nullable=True)
    resolved_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
