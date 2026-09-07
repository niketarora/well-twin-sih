from datetime import datetime
from pydantic import BaseModel, ConfigDict
from typing import Optional

class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class TimestampSchema(BaseSchema):
    id: str
    created_at: datetime
    updated_at: datetime

class HealthCheckResponse(BaseModel):
    status: str
    database: str
    version: str
    timestamp: datetime
