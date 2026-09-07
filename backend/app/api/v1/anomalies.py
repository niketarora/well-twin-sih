from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.connection import get_db
from app.repositories.anomaly_repository import AnomalyRepository
from app.schemas.anomaly import AnomalyResponse

router = APIRouter()

@router.get("/wells/{well_id}/anomalies", response_model=List[AnomalyResponse])
async def list_anomalies(well_id: str, db: AsyncSession = Depends(get_db)):
    repo = AnomalyRepository(db)
    items = await repo.get_by_well(well_id)
    return [AnomalyResponse.model_validate(a) for a in items]
