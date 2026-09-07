from typing import List, Optional
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.recommendation import Recommendation

class RecommendationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_well(self, well_id: str) -> List[Recommendation]:
        stmt = select(Recommendation).where(Recommendation.well_id == well_id).order_by(desc(Recommendation.created_at))
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_by_id(self, rec_id: str) -> Optional[Recommendation]:
        result = await self.db.execute(select(Recommendation).where(Recommendation.id == rec_id))
        return result.scalar_one_or_none()

    async def update_status(self, rec_id: str, status: str) -> Optional[Recommendation]:
        rec = await self.get_by_id(rec_id)
        if rec:
            rec.status = status
            await self.db.commit()
            await self.db.refresh(rec)
        return rec

    async def create(self, rec: Recommendation) -> Recommendation:
        self.db.add(rec)
        await self.db.commit()
        await self.db.refresh(rec)
        return rec
