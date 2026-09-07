from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.connection import get_db
from app.services.well_service import WellService
from app.schemas.well import WellSummaryResponse, WellDetailResponse, WellHealthResponse, WellStateResponse

router = APIRouter()

@router.get("/wells", response_model=List[WellSummaryResponse])
async def list_wells(db: AsyncSession = Depends(get_db)):
    service = WellService(db)
    return await service.list_wells()

@router.get("/wells/{well_id}", response_model=WellDetailResponse)
async def get_well(well_id: str, db: AsyncSession = Depends(get_db)):
    service = WellService(db)
    well = await service.get_well(well_id)
    if not well:
        raise HTTPException(status_code=404, detail="Well not found")
    return well

@router.get("/wells/{well_id}/health", response_model=WellHealthResponse)
async def get_well_health(well_id: str, db: AsyncSession = Depends(get_db)):
    service = WellService(db)
    health = await service.get_health(well_id)
    if not health:
        raise HTTPException(status_code=404, detail="Well not found")
    return health

@router.get("/wells/{well_id}/state", response_model=WellStateResponse)
async def get_well_state(well_id: str, db: AsyncSession = Depends(get_db)):
    service = WellService(db)
    state = await service.get_state(well_id)
    if not state:
        raise HTTPException(status_code=404, detail="Well not found")
    return state
