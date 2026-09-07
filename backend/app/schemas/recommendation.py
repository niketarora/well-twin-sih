from typing import List, Optional
import json
from pydantic import BaseModel
from .common import TimestampSchema, BaseSchema

class RecommendationResponse(TimestampSchema):
    well_id: str
    title: str
    priority: str
    action: str
    reason: str
    evidence: List[str] = []
    expected_impact: str
    confidence_pct: float
    status: str

    @classmethod
    def from_orm_model(cls, obj):
        evidence_list = []
        if hasattr(obj, "evidence_json") and obj.evidence_json:
            try:
                evidence_list = json.loads(obj.evidence_json)
            except Exception:
                evidence_list = [obj.evidence_json]
        return cls(
            id=obj.id,
            created_at=obj.created_at,
            updated_at=obj.updated_at,
            well_id=obj.well_id,
            title=obj.title,
            priority=obj.priority,
            action=obj.action,
            reason=obj.reason,
            evidence=evidence_list,
            expected_impact=obj.expected_impact,
            confidence_pct=obj.confidence_pct,
            status=obj.status,
        )

class RecommendationStatusUpdate(BaseModel):
    status: str  # Accepted, Rejected, Overridden, Pending
