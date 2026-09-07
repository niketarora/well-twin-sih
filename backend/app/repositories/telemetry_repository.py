from typing import List, Optional
from datetime import datetime
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.telemetry import TelemetryReading

class TelemetryRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_latest(self, well_id: str) -> Optional[TelemetryReading]:
        stmt = (
            select(TelemetryReading)
            .where(TelemetryReading.well_id == well_id)
            .order_by(desc(TelemetryReading.timestamp))
            .limit(1)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_range(
        self,
        well_id: str,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[TelemetryReading]:
        stmt = select(TelemetryReading).where(TelemetryReading.well_id == well_id)
        if start_time:
            stmt = stmt.where(TelemetryReading.timestamp >= start_time)
        if end_time:
            stmt = stmt.where(TelemetryReading.timestamp <= end_time)
        stmt = stmt.order_by(TelemetryReading.timestamp.asc()).limit(limit).offset(offset)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def count(self, well_id: str) -> int:
        from sqlalchemy import func
        stmt = select(func.count()).select_from(TelemetryReading).where(TelemetryReading.well_id == well_id)
        result = await self.db.execute(stmt)
        return result.scalar_one() or 0

    async def create(self, reading: TelemetryReading) -> TelemetryReading:
        self.db.add(reading)
        await self.db.commit()
        await self.db.refresh(reading)
        return reading
