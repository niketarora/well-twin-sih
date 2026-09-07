from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.connection import get_db
from app.services.recommendation_service import RecommendationService
from app.schemas.recommendation import RecommendationResponse, RecommendationStatusUpdate

router = APIRouter()

@router.get("/wells/{well_id}/recommendations", response_model=List[RecommendationResponse])
async def list_recommendations(well_id: str, db: AsyncSession = Depends(get_db)):
    service = RecommendationService(db)
    return await service.list_recommendations(well_id)

@router.post("/recommendations/{rec_id}/status", response_model=RecommendationResponse)
async def update_recommendation_status(
    rec_id: str,
    req: RecommendationStatusUpdate,
    db: AsyncSession = Depends(get_db)
):
    service = RecommendationService(db)
    updated = await service.update_status(rec_id, req)
    if not updated:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    return updated
