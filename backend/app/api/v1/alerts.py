from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.connection import get_db
from app.services.alert_service import AlertService
from app.schemas.alert import AlertResponse, AlertAcknowledgeRequest, AlertResolveRequest

router = APIRouter()

@router.get("/wells/{well_id}/alerts", response_model=List[AlertResponse])
async def list_alerts(
    well_id: str,
    status: Optional[str] = Query(None, description="Active, Acknowledged, or Resolved"),
    severity: Optional[str] = None,
    subsystem: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    service = AlertService(db)
    return await service.list_alerts(well_id, status, severity, subsystem)

@router.post("/alerts/{alert_id}/acknowledge", response_model=AlertResponse)
async def acknowledge_alert(
    alert_id: str,
    req: AlertAcknowledgeRequest,
    db: AsyncSession = Depends(get_db)
):
    service = AlertService(db)
    alert = await service.acknowledge(alert_id, req)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@router.post("/alerts/{alert_id}/resolve", response_model=AlertResponse)
async def resolve_alert(
    alert_id: str,
    req: AlertResolveRequest,
    db: AsyncSession = Depends(get_db)
):
    service = AlertService(db)
    alert = await service.resolve(alert_id, req)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert
