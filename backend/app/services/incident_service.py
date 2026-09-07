from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.incident import Incident
from app.repositories.incident_repository import IncidentRepository
from app.repositories.contact_repository import ContactRepository
from app.services.notification_service import NotificationService
from app.core.routing_rules import get_recipient_roles
from app.schemas.incident import (
    SosCreateRequest,
    SosResponse,
    IncidentResponse,
)

class IncidentService:
    def __init__(self, db: AsyncSession):
        self.repo = IncidentRepository(db)
        self.contact_repo = ContactRepository(db)
        self.notification_service = NotificationService(db)

    async def create_sos(
        self, req: SosCreateRequest, default_reporter_name: str, default_reporter_role: str
    ) -> SosResponse:
        """Manual SOS entry point. Depends only on the human-supplied request - no telemetry,
        Digital Twin state, or ML model is consulted anywhere in this path."""
        duplicate = await self.repo.find_recent_duplicate(req.well_id, req.category.value)

        incident = Incident(
            source_type="MANUAL_SOS",
            category=req.category.value,
            status="OPEN",
            well_id=req.well_id,
            location_description=req.location_description,
            description=req.description,
            reporter_name=req.reporter_name or default_reporter_name,
            reporter_role=req.reporter_role or default_reporter_role,
            reporter_contact=req.reporter_contact,
            possible_duplicate_of=duplicate.id if duplicate else None,
        )
        created = await self.repo.create(incident)

        roles = get_recipient_roles(req.category.value)
        contacts = await self.contact_repo.get_by_roles(roles)
        notifications = await self.notification_service.notify_incident(created, contacts)

        return SosResponse(
            incident=IncidentResponse.model_validate(created),
            notifications=notifications,
        )

    async def list_incidents(
        self,
        status: Optional[str] = None,
        source_type: Optional[str] = None,
        category: Optional[str] = None,
        well_id: Optional[str] = None,
    ) -> List[IncidentResponse]:
        incidents = await self.repo.get_all(status, source_type, category, well_id)
        return [IncidentResponse.model_validate(i) for i in incidents]

    async def get_incident(self, incident_id: str) -> Optional[IncidentResponse]:
        incident = await self.repo.get_by_id(incident_id)
        if not incident:
            return None
        return IncidentResponse.model_validate(incident)

    async def acknowledge(self, incident_id: str, engineer_id: str, notes: Optional[str]) -> Optional[IncidentResponse]:
        incident = await self.repo.acknowledge(incident_id, engineer_id, notes)
        if not incident:
            return None
        return IncidentResponse.model_validate(incident)

    async def resolve(self, incident_id: str, engineer_id: str, corrective_action: str) -> Optional[IncidentResponse]:
        incident = await self.repo.resolve(incident_id, engineer_id, corrective_action)
        if not incident:
            return None
        return IncidentResponse.model_validate(incident)

    async def escalate(self, incident_id: str, engineer_id: str, notes: Optional[str]) -> Optional[IncidentResponse]:
        incident = await self.repo.escalate(incident_id, engineer_id, notes)
        if not incident:
            return None
        return IncidentResponse.model_validate(incident)
