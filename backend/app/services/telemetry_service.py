from typing import List, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.telemetry_repository import TelemetryRepository
from app.schemas.telemetry import (
    TelemetryReadingResponse,
    PaginatedTelemetryResponse,
    TrendPointResponse
)

class TelemetryService:
    def __init__(self, db: AsyncSession):
        self.repo = TelemetryRepository(db)

    async def get_latest(self, well_id: str) -> Optional[TelemetryReadingResponse]:
        reading = await self.repo.get_latest(well_id)
        if not reading:
            return None
        return TelemetryReadingResponse.model_validate(reading)

    async def get_paginated(
        self,
        well_id: str,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
        limit: int = 50,
        offset: int = 0
    ) -> PaginatedTelemetryResponse:
        total = await self.repo.count(well_id)
        items = await self.repo.get_range(well_id, start_time, end_time, limit, offset)
        return PaginatedTelemetryResponse(
            total=total,
            items=[TelemetryReadingResponse.model_validate(i) for i in items]
        )

    async def get_trends(
        self,
        well_id: str,
        metrics: Optional[str] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
        interval: str = "1h"
    ) -> List[TrendPointResponse]:
        # Retrieve recent historical readings
        readings = await self.repo.get_range(well_id, start_time, end_time, limit=500, offset=0)

        trend_points: List[TrendPointResponse] = []
        for r in readings:
            pt = TrendPointResponse(
                timestamp=r.timestamp.strftime("%Y-%m-%d %H:%M"),
                oil_rate=round(r.oil_rate, 1),
                water_rate=round(r.water_rate, 1),
                temperature=round(r.bottomhole_temperature, 1),
                pressure=round(r.bottomhole_pressure, 1),
                viscosity=round(84.0 + (220.0 - r.bottomhole_temperature) * 1.8, 1),
                fillage=round(r.pump_fillage, 1),
                efficiency=round(r.pump_fillage * 0.94, 1),
                predicted_oil=198.0,
                actual_oil=round(r.oil_rate, 1)
            )
            trend_points.append(pt)
        return trend_points
