from typing import List, Optional
from datetime import datetime
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.work_order import WorkOrder

class WorkOrderRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, status: Optional[str] = None, well_id: Optional[str] = None) -> List[WorkOrder]:
        stmt = select(WorkOrder)
        if status:
            stmt = stmt.where(WorkOrder.status == status)
        if well_id:
            stmt = stmt.where(WorkOrder.well_id == well_id)
        stmt = stmt.order_by(desc(WorkOrder.created_at))
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_by_id(self, order_id: str) -> Optional[WorkOrder]:
        result = await self.db.execute(select(WorkOrder).where(WorkOrder.id == order_id))
        return result.scalar_one_or_none()

    async def create(self, order: WorkOrder) -> WorkOrder:
        self.db.add(order)
        await self.db.commit()
        await self.db.refresh(order)
        return order

    async def update(
        self,
        order_id: str,
        title: Optional[str] = None,
        priority: Optional[str] = None,
        status: Optional[str] = None,
        assigned_to: Optional[str] = None,
        due_date: Optional[datetime] = None,
        notes: Optional[str] = None,
    ) -> Optional[WorkOrder]:
        order = await self.get_by_id(order_id)
        if order:
            if title is not None:
                order.title = title
            if priority is not None:
                order.priority = priority
            if status is not None:
                order.status = status
            if assigned_to is not None:
                order.assigned_to = assigned_to
            if due_date is not None:
                order.due_date = due_date
            if notes is not None:
                order.notes = notes
            await self.db.commit()
            await self.db.refresh(order)
        return order
