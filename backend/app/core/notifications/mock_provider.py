from app.core.logging import logger
from .base import NotificationResult, SMSProvider, VoiceProvider

class MockSMSProvider(SMSProvider):
    """Default provider. Makes NO network call - only logs and reports MOCK_SENT so that local
    development and automated tests never place a real SMS."""

    async def send_sms(self, to: str, message: str) -> NotificationResult:
        logger.info(f'[MOCK SMS] to={to} message="{message}"')
        return NotificationResult(status="MOCK_SENT", provider="mock")

class MockVoiceProvider(VoiceProvider):
    """Default provider. Makes NO network call - only logs and reports MOCK_SENT so that local
    development and automated tests never place a real voice call."""

    async def place_call(self, to: str, message: str) -> NotificationResult:
        logger.info(f'[MOCK VOICE CALL] to={to} message="{message}"')
        return NotificationResult(status="MOCK_SENT", provider="mock")
