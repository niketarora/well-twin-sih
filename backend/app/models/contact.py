from sqlalchemy import String, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin

class Contact(Base, TimestampMixin):
    """Notification recipient. Real phone numbers must never be hardcoded in source - only
    demo/test placeholder numbers are seeded here (see app/db/seed.py); production contacts
    are expected to be managed via configured/seeded data, not literal values in code.
    """
    __tablename__ = "contacts"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    role: Mapped[str] = mapped_column(String(30), nullable=False, index=True)
    # SECURITY, MEDICAL, SAFETY, FIELD_ENGINEER, SHIFT_SUPERVISOR
    phone_number: Mapped[str] = mapped_column(String(30), nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    notes: Mapped[str] = mapped_column(Text, nullable=True)
