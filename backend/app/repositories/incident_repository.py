from typing import List, Optional
from datetime import datetime, timedelta, timezone
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.incident import Incident

DUPLICATE_HINT_WINDOW_MINUTES = 30

class IncidentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(
        self,
        status: Optional[str] = None,
        source_type: Optional[str] = None,
        category: Optional[str] = None,
        well_id: Optional[str] = None,
    ) -> List[Incident]:
        stmt = select(Incident)
        if status:
            stmt = stmt.where(Incident.status == status)
        if source_type:
            stmt = stmt.where(Incident.source_type == source_type)
        if category:
            stmt = stmt.where(Incident.category == category)
        if well_id:
            stmt = stmt.where(Incident.well_id == well_id)
        stmt = stmt.order_by(desc(Incident.created_at))
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_by_id(self, incident_id: str) -> Optional[Incident]:
        result = await self.db.execute(select(Incident).where(Incident.id == incident_id))
        return result.scalar_one_or_none()

    async def find_recent_duplicate(
        self, well_id: Optional[str], category: str, window_minutes: int = DUPLICATE_HINT_WINDOW_MINUTES
    ) -> Optional[Incident]:
        """Non-blocking duplicate hint for Manual SOS only: looks for another still-open
        incident with the same category (and well, if known) reported recently. This never
        suppresses a new report - every independent human observation is still recorded and
        notified; it only tags the new incident for dispatcher awareness.
        """
        if not well_id:
            return None
        cutoff = datetime.now(timezone.utc) - timedelta(minutes=window_minutes)
        stmt = (
            select(Incident)
            .where(Incident.well_id == well_id)
            .where(Incident.category == category)
            .where(Incident.status.in_(["OPEN", "ACKNOWLEDGED", "ESCALATED"]))
            .where(Incident.created_at >= cutoff)
            .order_by(desc(Incident.created_at))
        )
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def create(self, incident: Incident) -> Incident:
        self.db.add(incident)
        await self.db.commit()
        await self.db.refresh(incident)
        return incident

    async def acknowledge(self, incident_id: str, engineer_id: str = "eng-001", notes: Optional[str] = None) -> Optional[Incident]:
        incident = await self.get_by_id(incident_id)
        if incident:
            incident.status = "ACKNOWLEDGED"
            incident.acknowledged_by = engineer_id
            incident.acknowledged_at = datetime.now(timezone.utc)
            if notes:
                incident.description = (incident.description or "") + f"\n[Ack note] {notes}"
            await self.db.commit()
            await self.db.refresh(incident)
        return incident

    async def resolve(self, incident_id: str, engineer_id: str = "eng-001", corrective_action: str = "") -> Optional[Incident]:
        incident = await self.get_by_id(incident_id)
        if incident:
            incident.status = "RESOLVED"
            incident.resolved_by = engineer_id
            incident.resolved_at = datetime.now(timezone.utc)
            incident.resolution_notes = corrective_action
            await self.db.commit()
            await self.db.refresh(incident)
        return incident

    async def escalate(self, incident_id: str, engineer_id: str = "eng-001", notes: Optional[str] = None) -> Optional[Incident]:
        incident = await self.get_by_id(incident_id)
        if incident:
            incident.status = "ESCALATED"
            incident.escalation_level += 1
            incident.escalated_at = datetime.now(timezone.utc)
            incident.escalated_by = engineer_id
            incident.escalation_notes = notes
            await self.db.commit()
            await self.db.refresh(incident)
        return incident
