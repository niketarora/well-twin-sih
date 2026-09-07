from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.connection import get_db
from app.schemas.ai import AiChatRequest, AiChatResponse
from app.ai.orchestrator import BackendAiOrchestrator

router = APIRouter()

@router.post("/chat", response_model=AiChatResponse)
async def ai_chat(
    request: AiChatRequest,
    db: AsyncSession = Depends(get_db)
) -> AiChatResponse:
    """
    AI Engineering Copilot Chat Endpoint.
    Accepts natural-language engineering queries, assembles multi-physics digital twin context,
    and returns physics-reasoned answers with validated navigation actions and telemetry evidence.
    """
    orchestrator = BackendAiOrchestrator(db=db)
    return await orchestrator.chat(request)
