from typing import List, Optional
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.model_state import ModelState
from app.models.model_prediction import ModelPrediction

class TwinRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_latest_state(self, well_id: str) -> Optional[ModelState]:
        stmt = select(ModelState).where(ModelState.well_id == well_id).order_by(desc(ModelState.timestamp)).limit(1)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_predictions(self, well_id: str) -> List[ModelPrediction]:
        stmt = select(ModelPrediction).where(ModelPrediction.well_id == well_id).order_by(desc(ModelPrediction.timestamp))
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def create_state(self, state: ModelState) -> ModelState:
        self.db.add(state)
        await self.db.commit()
        await self.db.refresh(state)
        return state

    async def create_prediction(self, pred: ModelPrediction) -> ModelPrediction:
        self.db.add(pred)
        await self.db.commit()
        await self.db.refresh(pred)
        return pred
