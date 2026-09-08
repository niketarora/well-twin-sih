from datetime import datetime, timezone
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.incident import Incident
from app.models.contact import Contact
from app.models.notification_log import NotificationLog
from app.repositories.notification_log_repository import NotificationLogRepository
from app.core.notifications import get_sms_provider, get_voice_provider
from app.schemas.incident import NotificationResultSchema

SOS_MESSAGE_TEMPLATE = (
    "SOS ALERT [{category}] reported by {reporter}. "
    "Location: {location}. Incident ID: {incident_id}. Respond immediately."
)

def build_sos_message(incident: Incident) -> str:
    location = incident.well_id or incident.location_description or "unspecified"
    reporter = incident.reporter_name or "field worker"
    return SOS_MESSAGE_TEMPLATE.format(
        category=incident.category,
        reporter=reporter,
        location=location,
        incident_id=incident.id,
    )

class NotificationService:
    """The only place that talks to an SMS/voice provider. Routers and other services must
    never call a provider directly - they go through this service, which also writes the
    NotificationLog audit trail for every attempt."""

    def __init__(self, db: AsyncSession):
        self.log_repo = NotificationLogRepository(db)
        self.sms_provider = get_sms_provider()
        self.voice_provider = get_voice_provider()

    async def notify_incident(
        self, incident: Incident, contacts: List[Contact]
    ) -> List[NotificationResultSchema]:
        """Sends both an SMS and a voice call to every recipient contact, since a Manual SOS is
        inherently treated as urgent. Every attempt (mock or real) is logged to NotificationLog.
        """
        message = build_sos_message(incident)
        results: List[NotificationResultSchema] = []

        for contact in contacts:
            sms_result = await self.sms_provider.send_sms(contact.phone_number, message)
            await self.log_repo.create(NotificationLog(
                incident_id=incident.id,
                contact_id=contact.id,
                contact_name=contact.name,
                contact_role=contact.role,
                channel="SMS",
                provider=sms_result.provider,
                status=sms_result.status,
                external_sid=sms_result.external_sid,
                error_message=sms_result.error_message,
                attempt=1,
                sent_at=datetime.now(timezone.utc),
            ))
            results.append(NotificationResultSchema(
                contact_name=contact.name,
                contact_role=contact.role,
                channel="SMS",
                provider=sms_result.provider,
                status=sms_result.status,
            ))

            voice_result = await self.voice_provider.place_call(contact.phone_number, message)
            await self.log_repo.create(NotificationLog(
                incident_id=incident.id,
                contact_id=contact.id,
                contact_name=contact.name,
                contact_role=contact.role,
                channel="VOICE",
                provider=voice_result.provider,
                status=voice_result.status,
                external_sid=voice_result.external_sid,
                error_message=voice_result.error_message,
                attempt=1,
                sent_at=datetime.now(timezone.utc),
            ))
            results.append(NotificationResultSchema(
                contact_name=contact.name,
                contact_role=contact.role,
                channel="VOICE",
                provider=voice_result.provider,
                status=voice_result.status,
            ))

        return results
