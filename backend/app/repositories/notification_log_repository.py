from typing import List
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.notification_log import NotificationLog

class NotificationLogRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, log: NotificationLog) -> NotificationLog:
        self.db.add(log)
        await self.db.commit()
        await self.db.refresh(log)
        return log

    async def get_by_incident(self, incident_id: str) -> List[NotificationLog]:
        stmt = (
            select(NotificationLog)
            .where(NotificationLog.incident_id == incident_id)
            .order_by(desc(NotificationLog.sent_at))
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())
