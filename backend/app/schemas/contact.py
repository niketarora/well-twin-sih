from typing import Optional
from .common import TimestampSchema

class ContactResponse(TimestampSchema):
    name: str
    role: str
    phone_number: str
    active: bool
    notes: Optional[str] = None
