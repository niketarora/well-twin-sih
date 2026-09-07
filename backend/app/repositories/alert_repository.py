from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.alert import Alert

class AlertRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_well(
        self,
        well_id: str,
        status: Optional[str] = None,
        severity: Optional[str] = None,
        subsystem: Optional[str] = None
    ) -> List[Alert]:
        stmt = select(Alert).where(Alert.well_id == well_id)
        if status:
            stmt = stmt.where(Alert.status == status)
        if severity:
            stmt = stmt.where(Alert.severity == severity)
        if subsystem:
            stmt = stmt.where(Alert.subsystem == subsystem)
        stmt = stmt.order_by(desc(Alert.timestamp))
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_by_id(self, alert_id: str) -> Optional[Alert]:
        result = await self.db.execute(select(Alert).where(Alert.id == alert_id))
        return result.scalar_one_or_none()

    async def acknowledge(self, alert_id: str, engineer_id: str = "eng-001", notes: Optional[str] = None) -> Optional[Alert]:
        alert = await self.get_by_id(alert_id)
        if alert:
            alert.status = "Acknowledged"
            alert.acknowledged_by = engineer_id
            alert.acknowledged_at = datetime.now(timezone.utc)
            if notes:
                alert.explanation = f"{alert.explanation} (Note: {notes})"
            await self.db.commit()
            await self.db.refresh(alert)
        return alert

    async def resolve(self, alert_id: str, engineer_id: str = "eng-001", corrective_action: str = "") -> Optional[Alert]:
        alert = await self.get_by_id(alert_id)
        if alert:
            alert.status = "Resolved"
            alert.resolved_by = engineer_id
            alert.resolved_at = datetime.now(timezone.utc)
            if corrective_action:
                alert.action_required = f"Resolved: {corrective_action}"
            await self.db.commit()
            await self.db.refresh(alert)
        return alert

    async def create(self, alert: Alert) -> Alert:
        self.db.add(alert)
        await self.db.commit()
        await self.db.refresh(alert)
        return alert
