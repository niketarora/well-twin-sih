from datetime import datetime
from sqlalchemy import String, DateTime, Integer, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin

class NotificationLog(Base, TimestampMixin):
    """Audit trail of every notification attempt (mock or real) made for an incident."""
    __tablename__ = "notification_logs"

    incident_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False, index=True
    )
    contact_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("contacts.id", ondelete="SET NULL"), nullable=True, index=True
    )
    contact_name: Mapped[str] = mapped_column(String(100), nullable=True)
    contact_role: Mapped[str] = mapped_column(String(30), nullable=True)

    channel: Mapped[str] = mapped_column(String(10), nullable=False)  # SMS, VOICE
    provider: Mapped[str] = mapped_column(String(20), nullable=False)  # mock, twilio
    status: Mapped[str] = mapped_column(String(20), nullable=False)  # MOCK_SENT, SENT, FAILED
    external_sid: Mapped[str] = mapped_column(String(100), nullable=True)
    error_message: Mapped[str] = mapped_column(Text, nullable=True)
    attempt: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    sent_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
