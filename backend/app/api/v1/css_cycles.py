from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.connection import get_db
from app.repositories.css_cycle_repository import CssCycleRepository
from app.schemas.css_cycle import CssCycleResponse, CssCycleDetailResponse, PhaseMetric

router = APIRouter()

@router.get("/wells/{well_id}/css-cycles", response_model=List[CssCycleResponse])
async def list_css_cycles(well_id: str, db: AsyncSession = Depends(get_db)):
    repo = CssCycleRepository(db)
    cycles = await repo.get_by_well(well_id)
    return [CssCycleResponse.model_validate(c) for c in cycles]

@router.get("/wells/{well_id}/css-cycles/{cycle_id}", response_model=CssCycleDetailResponse)
async def get_css_cycle(well_id: str, cycle_id: str, db: AsyncSession = Depends(get_db)):
    repo = CssCycleRepository(db)
    cycle = await repo.get_by_id(cycle_id)
    if not cycle:
        raise HTTPException(status_code=404, detail="CSS Cycle not found")

    detail = CssCycleDetailResponse(
        **CssCycleResponse.model_validate(cycle).model_dump(),
        phases=[
            PhaseMetric(name="Steaming", duration_days=18, status="Completed"),
            PhaseMetric(name="Soaking", duration_days=10, status="Completed"),
            PhaseMetric(name="Production", duration_days=cycle.phase_day, status="Active"),
            PhaseMetric(name="Cooling", duration_days=0, status="Pending"),
        ]
    )
    return detail
