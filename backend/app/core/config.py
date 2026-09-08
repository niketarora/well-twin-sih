from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
import json
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Well Twin API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # CORS configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://well-twin-sih.vercel.app",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, str) and v.startswith("["):
            return json.loads(v)
        elif isinstance(v, list):
            return v
        return []

    # Supabase credentials (optional if using local DATABASE_URL)
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_DB_URL: str = ""

    # Gemini AI configuration
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-flash"

    # Sarvam AI Voice configuration (Saaras STT & Bulbul TTS)
    SARVAM_API_KEY: str = ""
    SARVAM_MODEL_STT: str = "saaras:v1"
    SARVAM_MODEL_TTS: str = "bulbul:v1"

    # Primary Database URL: uses SUPABASE_DB_URL if set, else falls back to DATABASE_URL or SQLite
    DATABASE_URL: str = "sqlite+aiosqlite:///./well_twin.db"

    # Notification provider mode for Manual SOS / Incident alerting.
    # "mock" (default): no real SMS/voice call is ever placed - safe for local dev and tests.
    # "twilio": reserved for a later phase; not implemented yet.
    NOTIFICATION_MODE: str = "mock"

    @property
    def async_database_url(self) -> str:
        if self.SUPABASE_DB_URL:
            # Ensure asyncpg driver
            url = self.SUPABASE_DB_URL
            if url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql+asyncpg://", 1)
            elif url.startswith("postgresql://") and not url.startswith("postgresql+asyncpg://"):
                url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
            return url
        return self.DATABASE_URL

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
