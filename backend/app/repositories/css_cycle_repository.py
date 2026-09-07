from typing import List, Optional
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.css_cycle import CssCycle

class CssCycleRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_well(self, well_id: str) -> List[CssCycle]:
        stmt = select(CssCycle).where(CssCycle.well_id == well_id).order_by(desc(CssCycle.cycle_number))
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_by_id(self, cycle_id: str) -> Optional[CssCycle]:
        result = await self.db.execute(select(CssCycle).where(CssCycle.id == cycle_id))
        return result.scalar_one_or_none()

    async def create(self, cycle: CssCycle) -> CssCycle:
        self.db.add(cycle)
        await self.db.commit()
        await self.db.refresh(cycle)
        return cycle
