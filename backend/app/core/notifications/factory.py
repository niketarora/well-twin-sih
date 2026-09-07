from app.core.config import settings
from .base import SMSProvider, VoiceProvider
from .mock_provider import MockSMSProvider, MockVoiceProvider

def get_sms_provider() -> SMSProvider:
    mode = settings.NOTIFICATION_MODE.lower()
    if mode == "mock":
        return MockSMSProvider()
    # Real Twilio SMS integration is a later phase (not implemented yet in this codebase).
    raise NotImplementedError(
        f"NOTIFICATION_MODE={mode!r} is not implemented yet. Only 'mock' is supported in this "
        "phase - real Twilio SMS is a separate, later phase."
    )

def get_voice_provider() -> VoiceProvider:
    mode = settings.NOTIFICATION_MODE.lower()
    if mode == "mock":
        return MockVoiceProvider()
    # Real Twilio Voice integration is a later phase (not implemented yet in this codebase).
    raise NotImplementedError(
        f"NOTIFICATION_MODE={mode!r} is not implemented yet. Only 'mock' is supported in this "
        "phase - real Twilio voice calling is a separate, later phase."
    )
