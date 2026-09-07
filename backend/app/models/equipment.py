from datetime import datetime
from sqlalchemy import String, Float, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin

class Equipment(Base, TimestampMixin):
    __tablename__ = "equipment"

    well_id: Mapped[str] = mapped_column(String(36), ForeignKey("wells.id", ondelete="CASCADE"), index=True, nullable=False)
    tag: Mapped[str] = mapped_column(String(50), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="Operational")
    health_score: Mapped[float] = mapped_column(Float, default=92.0)
    operating_hours: Mapped[float] = mapped_column(Float, default=4250.0)
    goodman_stress_pct: Mapped[float] = mapped_column(Float, default=86.2)
    last_inspection: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    next_inspection: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
