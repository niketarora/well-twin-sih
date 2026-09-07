from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.connection import get_db
from app.services.telemetry_service import TelemetryService
from app.schemas.telemetry import TrendPointResponse

router = APIRouter()

@router.get("/wells/{well_id}/trends", response_model=List[TrendPointResponse])
async def get_trends(
    well_id: str,
    metrics: Optional[str] = Query(None, description="Comma-separated metric keys"),
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    interval: str = Query("1h", description="Bucket interval e.g. 1m, 5m, 1h, 1d"),
    db: AsyncSession = Depends(get_db)
):
    service = TelemetryService(db)
    return await service.get_trends(well_id, metrics, start_time, end_time, interval)
