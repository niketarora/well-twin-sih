from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.connection import get_db
from app.repositories.twin_repository import TwinRepository
from app.schemas.twin import ModelStateResponse, ModelPredictionResponse

router = APIRouter()

@router.get("/wells/{well_id}/twin/state", response_model=ModelStateResponse)
async def get_twin_state(well_id: str, db: AsyncSession = Depends(get_db)):
    repo = TwinRepository(db)
    state = await repo.get_latest_state(well_id)
    if not state:
        raise HTTPException(status_code=404, detail="Model state not found")
    return ModelStateResponse.model_validate(state)

@router.get("/wells/{well_id}/twin/predictions", response_model=List[ModelPredictionResponse])
async def get_twin_predictions(well_id: str, db: AsyncSession = Depends(get_db)):
    repo = TwinRepository(db)
    preds = await repo.get_predictions(well_id)
    return [ModelPredictionResponse.model_validate(p) for p in preds]
