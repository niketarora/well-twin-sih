from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings
from app.core.logging import logger
from app.models.base import Base

# Create async engine based on active settings
connect_args = {}
if settings.async_database_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_async_engine(
    settings.async_database_url,
    echo=False,
    connect_args=connect_args,
    future=True
)

async_session_factory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        try:
            yield session
        finally:
            await session.close()

async def init_db():
    logger.info(f"Initializing database tables against {settings.async_database_url.split('@')[-1]}...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables initialized successfully.")
