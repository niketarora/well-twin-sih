from abc import ABC, abstractmethod
from typing import Optional, List, Dict, Any

class WellDataRepository(ABC):
    @abstractmethod
    async def get_well(self, well_id: str) -> Optional[Dict[str, Any]]:
        """Fetch well master metadata."""
        pass

    @abstractmethod
    async def get_telemetry(self, well_id: str) -> Optional[Dict[str, Any]]:
        """Fetch latest verified telemetry reading."""
        pass

    @abstractmethod
    async def get_alerts(self, well_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Fetch active operational alerts."""
        pass

    @abstractmethod
    async def get_production_history(self, well_id: str) -> List[Dict[str, Any]]:
        """Fetch recent production rate historical series."""
        pass

    @abstractmethod
    async def get_all_wells(self) -> List[Dict[str, Any]]:
        """Fetch all monitored wells in the field registry."""
        pass
