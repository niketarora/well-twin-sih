import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.db.connection import init_db, async_session_factory
from app.db.seed import seed_demo_contacts_if_missing

@pytest_asyncio.fixture(autouse=True)
async def ensure_db_ready():
    await init_db()
    async with async_session_factory() as session:
        await seed_demo_contacts_if_missing(session)

@pytest_asyncio.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac

