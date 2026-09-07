from datetime import datetime
from sqlalchemy import String, Float, Integer, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin

class CssCycle(Base, TimestampMixin):
    __tablename__ = "css_cycles"

    well_id: Mapped[str] = mapped_column(String(36), ForeignKey("wells.id", ondelete="CASCADE"), index=True, nullable=False)
    cycle_number: Mapped[int] = mapped_column(Integer, nullable=False)
    start_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)

    steam_injected_tons: Mapped[float] = mapped_column(Float, default=4800.0)
    oil_produced_bbls: Mapped[float] = mapped_column(Float, default=11250.0)
    csor: Mapped[float] = mapped_column(Float, default=3.18)
    status: Mapped[str] = mapped_column(String(20), default="Active")
    current_phase: Mapped[str] = mapped_column(String(50), default="Production")
    phase_day: Mapped[int] = mapped_column(Integer, default=38)
    total_phase_days: Mapped[int] = mapped_column(Integer, default=90)
