from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.connection import get_db
from app.services.work_order_service import WorkOrderService
from app.schemas.work_order import WorkOrderResponse, WorkOrderCreateRequest, WorkOrderUpdateRequest

router = APIRouter()

@router.get("/work-orders", response_model=List[WorkOrderResponse])
async def list_work_orders(
    status: Optional[str] = Query(None, description="Draft, Approved, In Progress, Completed"),
    well_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    service = WorkOrderService(db)
    return await service.list_orders(status, well_id)

@router.get("/work-orders/{order_id}", response_model=WorkOrderResponse)
async def get_work_order(order_id: str, db: AsyncSession = Depends(get_db)):
    service = WorkOrderService(db)
    order = await service.get_order(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Work Order not found")
    return order

@router.post("/work-orders", response_model=WorkOrderResponse, status_code=201)
async def create_work_order(req: WorkOrderCreateRequest, db: AsyncSession = Depends(get_db)):
    service = WorkOrderService(db)
    return await service.create_order(req)

@router.patch("/work-orders/{order_id}", response_model=WorkOrderResponse)
async def update_work_order(
    order_id: str,
    req: WorkOrderUpdateRequest,
    db: AsyncSession = Depends(get_db)
):
    service = WorkOrderService(db)
    order = await service.update_order(order_id, req)
    if not order:
        raise HTTPException(status_code=404, detail="Work Order not found")
    return order
