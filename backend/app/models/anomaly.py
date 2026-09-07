from datetime import datetime
from sqlalchemy import String, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin

class Anomaly(Base, TimestampMixin):
    __tablename__ = "anomalies"

    well_id: Mapped[str] = mapped_column(String(36), ForeignKey("wells.id", ondelete="CASCADE"), index=True, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    severity: Mapped[str] = mapped_column(String(20), default="High")
    score: Mapped[float] = mapped_column(Float, default=87.5)
    affected_metric: Mapped[str] = mapped_column(String(100), nullable=False)
    time_window: Mapped[str] = mapped_column(String(50), default="Last 24h")
    evidence: Mapped[str] = mapped_column(Text, default="")
    possible_cause: Mapped[str] = mapped_column(Text, default="")
