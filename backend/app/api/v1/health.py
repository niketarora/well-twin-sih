from fastapi import APIRouter, Depends
from datetime import datetime, timezone
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.connection import get_db
from app.core.config import settings
from app.schemas.common import HealthCheckResponse

router = APIRouter()

@router.get("/health", response_model=HealthCheckResponse)
async def health_check(db: AsyncSession = Depends(get_db)):
    db_status = "connected"
    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return HealthCheckResponse(
        status="healthy" if db_status == "connected" else "degraded",
        database=db_status,
        version=settings.VERSION,
        timestamp=datetime.now(timezone.utc)
    )
