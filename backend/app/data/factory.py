import os
from app.data.repository import WellDataRepository
from app.data.mock_repository import MockWellDataRepository
from app.data.supabase_repository import SupabaseWellDataRepository

def get_well_repository(db_session=None) -> WellDataRepository:
    """Returns data repository abstraction based on DATA_SOURCE or DATABASE_URL."""
    data_source = os.getenv("DATA_SOURCE", "mock").lower()
    if data_source == "supabase":
        return SupabaseWellDataRepository(db_session)
    return MockWellDataRepository()
