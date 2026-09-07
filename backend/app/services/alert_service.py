from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.alert_repository import AlertRepository
from app.schemas.alert import AlertResponse, AlertAcknowledgeRequest, AlertResolveRequest

class AlertService:
    def __init__(self, db: AsyncSession):
        self.repo = AlertRepository(db)

    async def list_alerts(
        self,
        well_id: str,
        status: Optional[str] = None,
        severity: Optional[str] = None,
        subsystem: Optional[str] = None
    ) -> List[AlertResponse]:
        alerts = await self.repo.get_by_well(well_id, status, severity, subsystem)
        return [AlertResponse.model_validate(a) for a in alerts]

    async def acknowledge(self, alert_id: str, req: AlertAcknowledgeRequest) -> Optional[AlertResponse]:
        alert = await self.repo.acknowledge(alert_id, req.engineer_id or "eng-001", req.notes)
        if not alert:
            return None
        return AlertResponse.model_validate(alert)

    async def resolve(self, alert_id: str, req: AlertResolveRequest) -> Optional[AlertResponse]:
        alert = await self.repo.resolve(alert_id, req.engineer_id or "eng-001", req.corrective_action)
        if not alert:
            return None
        return AlertResponse.model_validate(alert)
