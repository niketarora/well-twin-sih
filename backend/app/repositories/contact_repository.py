from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.contact import Contact

class ContactRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_roles(self, roles: List[str]) -> List[Contact]:
        if not roles:
            return []
        stmt = select(Contact).where(Contact.role.in_(roles)).where(Contact.active.is_(True))
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_all(self) -> List[Contact]:
        result = await self.db.execute(select(Contact))
        return list(result.scalars().all())
