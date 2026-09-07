from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from .common import TimestampSchema, BaseSchema

class WorkOrderCreateRequest(BaseModel):
    well_id: str
    title: str
    category: str = "Artificial Lift"
    priority: str = "High"
    assigned_to: str = "Field Crew Alpha"
    due_date: Optional[datetime] = None
    notes: Optional[str] = ""
    related_alert_id: Optional[str] = None
    related_recommendation_id: Optional[str] = None

class WorkOrderUpdateRequest(BaseModel):
    title: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    assigned_to: Optional[str] = None
    due_date: Optional[datetime] = None
    notes: Optional[str] = None

class WorkOrderResponse(TimestampSchema):
    order_number: str
    well_id: str
    title: str
    category: str
    priority: str
    status: str
    assigned_to: str
    due_date: Optional[datetime] = None
    notes: str = ""
    related_alert_id: Optional[str] = None
    related_recommendation_id: Optional[str] = None
