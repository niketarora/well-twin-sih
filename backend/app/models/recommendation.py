from datetime import datetime
from sqlalchemy import String, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin

class Recommendation(Base, TimestampMixin):
    __tablename__ = "recommendations"

    well_id: Mapped[str] = mapped_column(String(36), ForeignKey("wells.id", ondelete="CASCADE"), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    priority: Mapped[str] = mapped_column(String(20), default="High")
    action: Mapped[str] = mapped_column(String(200), nullable=False)
    reason: Mapped[str] = mapped_column(Text, default="")
    evidence_json: Mapped[str] = mapped_column(Text, default="[]")
    expected_impact: Mapped[str] = mapped_column(Text, default="")
    confidence_pct: Mapped[float] = mapped_column(Float, default=91.0)
    status: Mapped[str] = mapped_column(String(20), default="Pending")
