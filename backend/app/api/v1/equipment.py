from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.connection import get_db
from app.repositories.equipment_repository import EquipmentRepository
from app.schemas.equipment import EquipmentResponse

router = APIRouter()

@router.get("/wells/{well_id}/equipment", response_model=List[EquipmentResponse])
async def list_equipment(well_id: str, db: AsyncSession = Depends(get_db)):
    repo = EquipmentRepository(db)
    items = await repo.get_by_well(well_id)
    return [EquipmentResponse.model_validate(e) for e in items]
