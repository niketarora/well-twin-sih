from typing import List
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.insight import AiInsight

class InsightRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_well(self, well_id: str) -> List[AiInsight]:
        stmt = select(AiInsight).where(AiInsight.well_id == well_id).order_by(desc(AiInsight.created_at))
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def create(self, insight: AiInsight) -> AiInsight:
        self.db.add(insight)
        await self.db.commit()
        await self.db.refresh(insight)
        return insight
