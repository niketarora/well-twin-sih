from typing import List
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.anomaly import Anomaly

class AnomalyRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_well(self, well_id: str) -> List[Anomaly]:
        stmt = select(Anomaly).where(Anomaly.well_id == well_id).order_by(desc(Anomaly.timestamp))
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def create(self, anomaly: Anomaly) -> Anomaly:
        self.db.add(anomaly)
        await self.db.commit()
        await self.db.refresh(anomaly)
        return anomaly
