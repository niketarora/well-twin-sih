from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.recommendation_repository import RecommendationRepository
from app.schemas.recommendation import RecommendationResponse, RecommendationStatusUpdate

class RecommendationService:
    def __init__(self, db: AsyncSession):
        self.repo = RecommendationRepository(db)

    async def list_recommendations(self, well_id: str) -> List[RecommendationResponse]:
        recs = await self.repo.get_by_well(well_id)
        return [RecommendationResponse.from_orm_model(r) for r in recs]

    async def update_status(self, rec_id: str, req: RecommendationStatusUpdate) -> Optional[RecommendationResponse]:
        updated = await self.repo.update_status(rec_id, req.status)
        if not updated:
            return None
        return RecommendationResponse.from_orm_model(updated)
