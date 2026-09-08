from typing import Optional, List, Dict, Any
from app.data.repository import WellDataRepository
from app.data.mock_repository import MockWellDataRepository

class SupabaseWellDataRepository(WellDataRepository):
    def __init__(self, db_session=None):
        self.db = db_session
        self._fallback = MockWellDataRepository()

    async def get_well(self, well_id: str) -> Optional[Dict[str, Any]]:
        # In future Supabase mode, queries `wells` table via parameterized query
        # Currently delegates to verified repository
        return await self._fallback.get_well(well_id)

    async def get_telemetry(self, well_id: str) -> Optional[Dict[str, Any]]:
        return await self._fallback.get_telemetry(well_id)

    async def get_alerts(self, well_id: Optional[str] = None) -> List[Dict[str, Any]]:
        return await self._fallback.get_alerts(well_id)

    async def get_production_history(self, well_id: str) -> List[Dict[str, Any]]:
        return await self._fallback.get_production_history(well_id)

    async def get_all_wells(self) -> List[Dict[str, Any]]:
        return await self._fallback.get_all_wells()
