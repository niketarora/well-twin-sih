from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.equipment import Equipment

class EquipmentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_well(self, well_id: str) -> List[Equipment]:
        stmt = select(Equipment).where(Equipment.well_id == well_id).order_by(Equipment.name)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def create(self, equip: Equipment) -> Equipment:
        self.db.add(equip)
        await self.db.commit()
        await self.db.refresh(equip)
        return equip
