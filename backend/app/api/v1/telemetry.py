from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.connection import get_db
from app.services.telemetry_service import TelemetryService
from app.schemas.telemetry import TelemetryReadingResponse, PaginatedTelemetryResponse

router = APIRouter()

@router.get("/wells/{well_id}/telemetry", response_model=PaginatedTelemetryResponse)
async def get_telemetry(
    well_id: str,
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    service = TelemetryService(db)
    return await service.get_paginated(well_id, start_time, end_time, limit, offset)

@router.get("/wells/{well_id}/telemetry/latest", response_model=TelemetryReadingResponse)
async def get_latest_telemetry(well_id: str, db: AsyncSession = Depends(get_db)):
    service = TelemetryService(db)
    reading = await service.get_latest(well_id)
    if not reading:
        raise HTTPException(status_code=404, detail="No telemetry available for this well")
    return reading
