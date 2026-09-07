from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.connection import get_db
from app.repositories.insight_repository import InsightRepository
from app.schemas.insight import AiInsightResponse

router = APIRouter()

@router.get("/wells/{well_id}/insights", response_model=List[AiInsightResponse])
async def list_insights(well_id: str, db: AsyncSession = Depends(get_db)):
    repo = InsightRepository(db)
    items = await repo.get_by_well(well_id)
    return [AiInsightResponse.from_orm_model(i) for i in items]
