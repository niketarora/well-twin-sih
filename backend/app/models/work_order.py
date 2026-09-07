from datetime import datetime
from sqlalchemy import String, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin

class WorkOrder(Base, TimestampMixin):
    __tablename__ = "work_orders"

    order_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    well_id: Mapped[str] = mapped_column(String(36), ForeignKey("wells.id", ondelete="CASCADE"), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(String(50), default="Artificial Lift")
    priority: Mapped[str] = mapped_column(String(20), default="High")
    status: Mapped[str] = mapped_column(String(20), default="Approved")
    assigned_to: Mapped[str] = mapped_column(String(100), default="Field Crew Alpha")
    due_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    notes: Mapped[str] = mapped_column(Text, default="")
    related_alert_id: Mapped[str] = mapped_column(String(36), nullable=True)
    related_recommendation_id: Mapped[str] = mapped_column(String(36), nullable=True)
