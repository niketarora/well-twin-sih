from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.connection import get_db
from app.core.security import get_current_user
from app.services.incident_service import IncidentService
from app.schemas.incident import SosCreateRequest, SosResponse

router = APIRouter()

@router.post("/sos", response_model=SosResponse, status_code=201)
async def raise_sos(req: SosCreateRequest, db: AsyncSession = Depends(get_db)):
    """Human-triggered emergency report. Independent of the Digital Twin - a human observation
    (category + location) is sufficient to create an Incident and notify configured recipients.
    """
    current_user = get_current_user()  # demo-user stand-in; see app/core/security.py
    service = IncidentService(db)
    return await service.create_sos(
        req,
        default_reporter_name=current_user.get("name", "Unknown Reporter"),
        default_reporter_role=current_user.get("role", "worker"),
    )
