from typing import Optional, List
from pydantic import BaseModel, Field

class VoiceSttResponse(BaseModel):
    transcript: str
    confidence: Optional[float] = 0.95
    language_code: str = "en-IN"
    is_simulated: bool = False

class VoiceTtsRequest(BaseModel):
    text: str
    target_language_code: str = "en-IN"
    speaker: str = "meera"
    pace: float = 1.0

class VoiceTtsResponse(BaseModel):
    audio_base64: Optional[str] = None
    mime_type: str = "audio/wav"
    is_simulated: bool = False
    error: Optional[str] = None
