from datetime import datetime
from sqlalchemy import String, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin

class AiInsight(Base, TimestampMixin):
    __tablename__ = "ai_insights"

    well_id: Mapped[str] = mapped_column(String(36), ForeignKey("wells.id", ondelete="CASCADE"), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    severity: Mapped[str] = mapped_column(String(20), default="Warning")
    confidence_pct: Mapped[float] = mapped_column(Float, default=89.0)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    evidence_json: Mapped[str] = mapped_column(Text, default="[]")  # JSON string of evidence items
    likely_cause: Mapped[str] = mapped_column(Text, default="")
    recommended_action: Mapped[str] = mapped_column(Text, default="")
    projected_delta_bopd: Mapped[float] = mapped_column(Float, default=13.8)
