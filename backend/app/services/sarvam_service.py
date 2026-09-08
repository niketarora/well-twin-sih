import os
import logging
from typing import Optional
import httpx
from app.core.config import settings
from app.schemas.voice import VoiceSttResponse, VoiceTtsResponse

logger = logging.getLogger(__name__)

class SarvamService:
    def __init__(self):
        self.stt_url = "https://api.sarvam.ai/speech-to-text"
        self.tts_url = "https://api.sarvam.ai/text-to-speech"

    @property
    def api_key(self) -> Optional[str]:
        return os.getenv("SARVAM_API_KEY") or settings.SARVAM_API_KEY

    async def speech_to_text(
        self,
        audio_bytes: bytes,
        filename: str = "recording.wav",
        language_code: str = "en-IN"
    ) -> VoiceSttResponse:
        """Transcribes audio using Sarvam Saaras STT API with offline fallback."""
        active_key = self.api_key
        if not active_key:
            logger.info("SARVAM_API_KEY is not set. Providing local development speech transcription fallback.")
            return VoiceSttResponse(
                transcript="Show SRP lift dynamics for BW-017",
                confidence=0.98,
                language_code=language_code,
                is_simulated=True
            )

        try:
            headers = {
                "api-subscription-key": active_key
            }
            content_type = "audio/webm" if (filename and filename.endswith(".webm")) else "audio/wav"
            files = {
                "file": (filename, audio_bytes, content_type)
            }
            data = {
                "model": settings.SARVAM_MODEL_STT or "saaras:v1",
                "language_code": language_code
            }

            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(self.stt_url, headers=headers, files=files, data=data)
                if res.status_code == 200:
                    result = res.json()
                    transcript = result.get("transcript", "")
                    return VoiceSttResponse(
                        transcript=transcript,
                        confidence=0.95,
                        language_code=language_code,
                        is_simulated=False
                    )
                else:
                    logger.warning(f"Sarvam STT returned status {res.status_code}: {res.text}")
                    return VoiceSttResponse(
                        transcript="Show production trends for BW-017",
                        confidence=0.85,
                        language_code=language_code,
                        is_simulated=True
                    )
        except Exception as e:
            logger.error(f"Error calling Sarvam STT: {e}", exc_info=True)
            return VoiceSttResponse(
                transcript="Show SRP lift dynamics for BW-017",
                confidence=0.80,
                language_code=language_code,
                is_simulated=True
            )

    async def text_to_speech(
        self,
        text: str,
        target_language_code: str = "en-IN",
        speaker: str = "meera",
        pace: float = 1.0
    ) -> VoiceTtsResponse:
        """Synthesizes speech audio using Sarvam Bulbul TTS API with offline fallback."""
        active_key = self.api_key
        if not active_key:
            logger.info("SARVAM_API_KEY is not set. Returning null audio for browser Web Speech synthesis fallback.")
            return VoiceTtsResponse(
                audio_base64=None,
                mime_type="audio/wav",
                is_simulated=True,
                error="SARVAM_API_KEY not configured. Use browser Web Speech fallback."
            )

        try:
            # Clean up text (strip markdown headers/bullets for clean audio synthesis)
            clean_text = text.replace("**", "").replace("#", "").replace("- ", "").strip()
            # Limit payload length to prevent TTS timeouts
            if len(clean_text) > 450:
                clean_text = clean_text[:450] + "..."

            headers = {
                "api-subscription-key": active_key,
                "Content-Type": "application/json"
            }
            payload = {
                "inputs": [clean_text],
                "target_language_code": target_language_code,
                "speaker": speaker,
                "pitch": 0,
                "pace": pace,
                "loudness": 1.5,
                "speech_sample_rate": 8000,
                "enable_preprocessing": True,
                "model": settings.SARVAM_MODEL_TTS or "bulbul:v1"
            }

            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(self.tts_url, headers=headers, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    audios = data.get("audios", [])
                    audio_b64 = audios[0] if audios else None
                    return VoiceTtsResponse(
                        audio_base64=audio_b64,
                        mime_type="audio/wav",
                        is_simulated=False
                    )
                else:
                    logger.warning(f"Sarvam TTS returned status {res.status_code}: {res.text}")
                    return VoiceTtsResponse(
                        audio_base64=None,
                        is_simulated=True,
                        error=f"Sarvam API status {res.status_code}"
                    )
        except Exception as e:
            logger.error(f"Error calling Sarvam TTS: {e}", exc_info=True)
            return VoiceTtsResponse(
                audio_base64=None,
                is_simulated=True,
                error=str(e)
            )

sarvam_service = SarvamService()
