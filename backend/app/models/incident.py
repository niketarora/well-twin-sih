from datetime import datetime
from sqlalchemy import String, Text, DateTime, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin

class Incident(Base, TimestampMixin):
    """Shared safety-event container for both Manual SOS (human-triggered) and, in a later
    phase, automated Digital Twin alerts (system-triggered). The two trigger paths must never
    be conflated: MANUAL_SOS incidents are created purely from a human observation with no
    telemetry/model involvement.
    """
    __tablename__ = "incidents"

    source_type: Mapped[str] = mapped_column(String(20), nullable=False, default="MANUAL_SOS")
    # MANUAL_SOS today. SYSTEM_ALERT is reserved for the deferred automated-alert phase.

    category: Mapped[str] = mapped_column(String(30), nullable=False)
    # FIRE_SMOKE, UNUSUAL_SMELL, SUSPECTED_LEAK, FLUID_LEAK, MEDICAL_EMERGENCY,
    # EQUIPMENT_HAZARD, PERSONNEL_DANGER, OTHER

    status: Mapped[str] = mapped_column(String(20), nullable=False, default="OPEN")
    # OPEN, ACKNOWLEDGED, ESCALATED, RESOLVED, CLOSED

    well_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("wells.id", ondelete="SET NULL"), nullable=True, index=True
    )
    location_description: Mapped[str] = mapped_column(String(300), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)

    reporter_name: Mapped[str] = mapped_column(String(100), nullable=True)
    reporter_role: Mapped[str] = mapped_column(String(50), nullable=True)
    reporter_contact: Mapped[str] = mapped_column(String(50), nullable=True)

    # Non-blocking hint that another OPEN incident may describe the same real-world event.
    # Manual SOS reports are NEVER suppressed because of this - every independent human report
    # is still recorded and notified.
    possible_duplicate_of: Mapped[str] = mapped_column(
        String(36), ForeignKey("incidents.id"), nullable=True
    )

    acknowledged_by: Mapped[str] = mapped_column(String(100), nullable=True)
    acknowledged_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    resolved_by: Mapped[str] = mapped_column(String(100), nullable=True)
    resolved_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    resolution_notes: Mapped[str] = mapped_column(Text, nullable=True)

    escalation_level: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    escalated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    escalated_by: Mapped[str] = mapped_column(String(100), nullable=True)
    escalation_notes: Mapped[str] = mapped_column(Text, nullable=True)
