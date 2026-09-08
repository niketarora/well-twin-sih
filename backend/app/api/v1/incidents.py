from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.connection import get_db
from app.core.security import get_current_user
from app.services.incident_service import IncidentService
from app.schemas.incident import (
    IncidentResponse,
    IncidentAcknowledgeRequest,
    IncidentResolveRequest,
    IncidentEscalateRequest,
)

router = APIRouter()

@router.get("/incidents", response_model=List[IncidentResponse])
async def list_incidents(
    status: Optional[str] = Query(None, description="OPEN, ACKNOWLEDGED, ESCALATED, RESOLVED, CLOSED"),
    source_type: Optional[str] = Query(None, description="MANUAL_SOS or SYSTEM_ALERT"),
    category: Optional[str] = None,
    well_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    service = IncidentService(db)
    return await service.list_incidents(status, source_type, category, well_id)

@router.get("/incidents/{incident_id}", response_model=IncidentResponse)
async def get_incident(incident_id: str, db: AsyncSession = Depends(get_db)):
    service = IncidentService(db)
    incident = await service.get_incident(incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident

@router.post("/incidents/{incident_id}/acknowledge", response_model=IncidentResponse)
async def acknowledge_incident(
    incident_id: str, req: IncidentAcknowledgeRequest, db: AsyncSession = Depends(get_db)
):
    current_user = get_current_user()
    service = IncidentService(db)
    incident = await service.acknowledge(
        incident_id, req.engineer_id or current_user.get("id", "eng-001"), req.notes
    )
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident

@router.post("/incidents/{incident_id}/resolve", response_model=IncidentResponse)
async def resolve_incident(
    incident_id: str, req: IncidentResolveRequest, db: AsyncSession = Depends(get_db)
):
    current_user = get_current_user()
    service = IncidentService(db)
    incident = await service.resolve(
        incident_id, req.engineer_id or current_user.get("id", "eng-001"), req.corrective_action
    )
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident

@router.post("/incidents/{incident_id}/escalate", response_model=IncidentResponse)
async def escalate_incident(
    incident_id: str, req: IncidentEscalateRequest, db: AsyncSession = Depends(get_db)
):
    current_user = get_current_user()
    service = IncidentService(db)
    incident = await service.escalate(
        incident_id, req.engineer_id or current_user.get("id", "eng-001"), req.notes
    )
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident
