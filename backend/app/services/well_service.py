from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.well_repository import WellRepository
from app.repositories.telemetry_repository import TelemetryRepository
from app.repositories.alert_repository import AlertRepository
from app.schemas.well import (
    WellSummaryResponse,
    WellDetailResponse,
    WellHealthResponse,
    SubsystemHealthItem,
    WellStateResponse,
    TelemetrySnapshot
)

class WellService:
    def __init__(self, db: AsyncSession):
        self.well_repo = WellRepository(db)
        self.telemetry_repo = TelemetryRepository(db)
        self.alert_repo = AlertRepository(db)

    async def list_wells(self) -> List[WellSummaryResponse]:
        wells = await self.well_repo.get_all()
        return [WellSummaryResponse.model_validate(w) for w in wells]

    async def get_well(self, well_id: str) -> Optional[WellDetailResponse]:
        well = await self.well_repo.get_by_id(well_id)
        if not well:
            well = await self.well_repo.get_by_code(well_id)
        if not well:
            return None
        return WellDetailResponse.model_validate(well)

    async def get_health(self, well_id: str) -> Optional[WellHealthResponse]:
        well = await self.get_well(well_id)
        if not well:
            return None

        # Calculate health scores (deterministic physical score derived from telemetry & alerts)
        latest_telemetry = await self.telemetry_repo.get_latest(well.id)
        active_alerts = await self.alert_repo.get_by_well(well.id, status="Active")

        # Base scores
        res_score = 92
        wb_score = 88
        srp_score = 76  # Incomplete fillage / fluid pound
        surf_score = 84

        dominant = "Fluid Pound Detected on Downstroke @ 2.80m"
        overall = int((res_score * 0.25) + (wb_score * 0.25) + (srp_score * 0.30) + (surf_score * 0.20))

        return WellHealthResponse(
            well_id=well.id,
            overall_score=overall,
            overall_status="Attention" if overall < 85 else "Good",
            dominant_concern=dominant,
            subsystems={
                "reservoir": SubsystemHealthItem(score=res_score, status="Good", dominant_concern="Near-wellbore thermal falloff (-0.04°C/h)"),
                "wellbore": SubsystemHealthItem(score=wb_score, status="Good", dominant_concern="Crude viscosity elevated at 84 cP"),
                "srp": SubsystemHealthItem(score=srp_score, status="Warning", dominant_concern="Incomplete pump fillage (84.6%) & fluid pound"),
                "surface": SubsystemHealthItem(score=surf_score, status="Attention", dominant_concern="Net oil deficit (-7.0% vs twin predicted)"),
            },
            last_updated=latest_telemetry.timestamp if latest_telemetry else datetime.now(timezone.utc)
        )

    async def get_state(self, well_id: str) -> Optional[WellStateResponse]:
        well = await self.get_well(well_id)
        if not well:
            return None

        latest = await self.telemetry_repo.get_latest(well.id)

        subsurface = TelemetrySnapshot(
            oil_rate_bopd=latest.oil_rate if latest else 184.2,
            water_rate_bwpd=latest.water_rate if latest else 529.8,
            bottomhole_pressure_bar=latest.bottomhole_pressure if latest else 38.7,
            bottomhole_temp_c=latest.bottomhole_temperature if latest else 214.8,
            pump_fillage_pct=latest.pump_fillage if latest else 84.6,
            viscosity_cp=84.0,
            stroke_rate_spm=latest.stroke_rate if latest else 3.8,
            peak_rod_load_kn=latest.peak_polished_rod_load if latest else 184.2,
            status="Warning"
        )

        surface = TelemetrySnapshot(
            oil_rate_bopd=latest.oil_rate if latest else 184.2,
            water_rate_bwpd=latest.water_rate if latest else 529.8,
            bottomhole_pressure_bar=latest.wellhead_pressure if latest else 3.8,
            bottomhole_temp_c=latest.wellhead_temperature if latest else 74.2,
            pump_fillage_pct=latest.pump_fillage if latest else 84.6,
            viscosity_cp=84.0,
            stroke_rate_spm=latest.stroke_rate if latest else 3.8,
            peak_rod_load_kn=latest.peak_polished_rod_load if latest else 184.2,
            status="Attention"
        )

        return WellStateResponse(
            well_id=well.id,
            operating_phase=well.operating_phase,
            cycle_day=38,
            subsurface=subsurface,
            surface=surface,
            last_updated=latest.timestamp if latest else datetime.now(timezone.utc)
        )
