from typing import List, Optional
import json
from pydantic import BaseModel, field_validator
from .common import TimestampSchema, BaseSchema

class AiInsightResponse(TimestampSchema):
    well_id: str
    title: str
    severity: str
    confidence_pct: float
    summary: str
    evidence: List[str] = []
    likely_cause: str
    recommended_action: str
    projected_delta_bopd: float

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
            severity=obj.severity,
            confidence_pct=obj.confidence_pct,
            summary=obj.summary,
            evidence=evidence_list,
            likely_cause=obj.likely_cause,
            recommended_action=obj.recommended_action,
            projected_delta_bopd=obj.projected_delta_bopd,
        )
