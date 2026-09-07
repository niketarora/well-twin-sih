from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.well import Well

class WellRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> List[Well]:
        result = await self.db.execute(select(Well).order_by(Well.well_code))
        return list(result.scalars().all())

    async def get_by_id(self, well_id: str) -> Optional[Well]:
        result = await self.db.execute(select(Well).where(Well.id == well_id))
        return result.scalar_one_or_none()

    async def get_by_code(self, well_code: str) -> Optional[Well]:
        result = await self.db.execute(select(Well).where(Well.well_code == well_code))
        return result.scalar_one_or_none()

    async def create(self, well: Well) -> Well:
        self.db.add(well)
        await self.db.commit()
        await self.db.refresh(well)
        return well
