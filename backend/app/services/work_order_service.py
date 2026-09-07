import random
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.work_order_repository import WorkOrderRepository
from app.models.work_order import WorkOrder
from app.schemas.work_order import WorkOrderResponse, WorkOrderCreateRequest, WorkOrderUpdateRequest

class WorkOrderService:
    def __init__(self, db: AsyncSession):
        self.repo = WorkOrderRepository(db)

    async def list_orders(self, status: Optional[str] = None, well_id: Optional[str] = None) -> List[WorkOrderResponse]:
        orders = await self.repo.get_all(status, well_id)
        return [WorkOrderResponse.model_validate(o) for o in orders]

    async def get_order(self, order_id: str) -> Optional[WorkOrderResponse]:
        order = await self.repo.get_by_id(order_id)
        if not order:
            return None
        return WorkOrderResponse.model_validate(order)

    async def create_order(self, req: WorkOrderCreateRequest) -> WorkOrderResponse:
        order_num = f"WO-{random.randint(1000, 9999)}"
        new_order = WorkOrder(
            order_number=order_num,
            well_id=req.well_id,
            title=req.title,
            category=req.category,
            priority=req.priority,
            status="Draft",
            assigned_to=req.assigned_to,
            due_date=req.due_date,
            notes=req.notes or "",
            related_alert_id=req.related_alert_id,
            related_recommendation_id=req.related_recommendation_id
        )
        created = await self.repo.create(new_order)
        return WorkOrderResponse.model_validate(created)

    async def update_order(self, order_id: str, req: WorkOrderUpdateRequest) -> Optional[WorkOrderResponse]:
        updated = await self.repo.update(
            order_id=order_id,
            title=req.title,
            priority=req.priority,
            status=req.status,
            assigned_to=req.assigned_to,
            due_date=req.due_date,
            notes=req.notes
        )
        if not updated:
            return None
        return WorkOrderResponse.model_validate(updated)
