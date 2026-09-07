from sqlalchemy import String, Float, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
from .base import Base, TimestampMixin

class Well(Base, TimestampMixin):
    __tablename__ = "wells"

    well_code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    field_name: Mapped[str] = mapped_column(String(100), nullable=False)
    basin: Mapped[str] = mapped_column(String(100), default="Bikaner-Nagaur")
    latitude: Mapped[float] = mapped_column(Float, default=27.532)
    longitude: Mapped[float] = mapped_column(Float, default=72.148)
    formation: Mapped[str] = mapped_column(String(100), default="Jodhpur Sandstone")
    reservoir_depth_m: Mapped[float] = mapped_column(Float, default=1120.0)
    total_depth_m: Mapped[float] = mapped_column(Float, default=1420.0)
    crude_api: Mapped[float] = mapped_column(Float, default=17.5)
    dead_oil_viscosity_cp: Mapped[float] = mapped_column(Float, default=8500.0)
    current_cycle: Mapped[int] = mapped_column(Integer, default=4)
    operating_phase: Mapped[str] = mapped_column(String(50), default="Production")
    artificial_lift_type: Mapped[str] = mapped_column(String(50), default="Sucker Rod Pump")
    status: Mapped[str] = mapped_column(String(20), default="Active")
    description: Mapped[str] = mapped_column(Text, default="")
