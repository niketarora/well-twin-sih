from datetime import datetime
from sqlalchemy import String, Float, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin

class ModelState(Base, TimestampMixin):
    __tablename__ = "model_states"

    well_id: Mapped[str] = mapped_column(String(36), ForeignKey("wells.id", ondelete="CASCADE"), index=True, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=False)

    reservoir_temp_c: Mapped[float] = mapped_column(Float, default=134.2)
    steam_chamber_radius_m: Mapped[float] = mapped_column(Float, default=18.4)
    heat_loss_rate_kw: Mapped[float] = mapped_column(Float, default=142.0)
    crude_viscosity_cp: Mapped[float] = mapped_column(Float, default=84.0)
    flowing_bottomhole_pressure_bar: Mapped[float] = mapped_column(Float, default=42.1)
    liquid_holdup: Mapped[float] = mapped_column(Float, default=0.68)
    pump_fillage_pct: Mapped[float] = mapped_column(Float, default=84.6)
    fluid_pound_marker_m: Mapped[float] = mapped_column(Float, default=2.80)
    rod_peak_stress_ratio: Mapped[float] = mapped_column(Float, default=0.862)
    solver_convergence_mape: Mapped[float] = mapped_column(Float, default=4.2)
    provenance: Mapped[str] = mapped_column(String(30), default="MODEL DERIVED")
