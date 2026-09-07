from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional

@dataclass
class NotificationResult:
    status: str  # e.g. MOCK_SENT, SENT, FAILED
    provider: str  # mock, twilio
    external_sid: Optional[str] = None
    error_message: Optional[str] = None

class SMSProvider(ABC):
    @abstractmethod
    async def send_sms(self, to: str, message: str) -> NotificationResult:
        ...

class VoiceProvider(ABC):
    @abstractmethod
    async def place_call(self, to: str, message: str) -> NotificationResult:
        ...
