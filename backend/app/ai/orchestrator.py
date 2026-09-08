from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.ai import AiChatRequest, AiChatResponse
from app.ai.providers.gemini import BackendGeminiProvider
from app.repositories.well_repository import WellRepository

class BackendAiOrchestrator:
    def __init__(self, db: Optional[AsyncSession] = None):
        self.db = db
        self.provider = BackendGeminiProvider()

    async def chat(self, request: AiChatRequest) -> AiChatResponse:
        # Build context prompt
        context_parts = []
        well_id = request.well_id or "well-bw-017"

        # If DB session available, attempt to enrich well information
        if self.db:
            try:
                repo = WellRepository(self.db)
                well = await repo.get_by_id(well_id)
                if well:
                    context_parts.append(
                        f"Well Info: {well.well_code} ({well.name}), Pad: {well.pad}, Field: {well.field_name}, Phase: {well.operating_phase}, Cycle: {well.current_cycle}"
                    )
            except Exception:
                pass

        if request.context:
            context_parts.append(f"Client Context Snapshot: {request.context}")
        else:
            context_parts.append(
                f"Well {well_id}: CSS Cycle 4, Day 38/90. BHT: 182°C (Warning), Viscosity: 420 cP (Elevated), SRP Fillage: 61% (Fluid pound risk), Surface Actual: 184.2 BOPD vs Twin Predicted 198.0 BOPD (-7.0% deviation)."
            )

        if request.current_route:
            context_parts.append(f"Active UI Page: {request.current_route}")

        context_prompt = "\n".join(context_parts)
        return await self.provider.generate_response(request, context_prompt)
