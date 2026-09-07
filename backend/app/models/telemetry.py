from datetime import datetime
from sqlalchemy import String, Float, DateTime, Index, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin

class TelemetryReading(Base, TimestampMixin):
    __tablename__ = "telemetry_readings"

    well_id: Mapped[str] = mapped_column(String(36), ForeignKey("wells.id", ondelete="CASCADE"), index=True, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=False)

    oil_rate: Mapped[float] = mapped_column(Float, default=184.2)
    water_rate: Mapped[float] = mapped_column(Float, default=529.8)
    steam_rate: Mapped[float] = mapped_column(Float, default=0.0)
    gas_rate: Mapped[float] = mapped_column(Float, default=5.2)

    bottomhole_pressure: Mapped[float] = mapped_column(Float, default=38.7)
    bottomhole_temperature: Mapped[float] = mapped_column(Float, default=214.8)
    wellhead_pressure: Mapped[float] = mapped_column(Float, default=3.8)
    wellhead_temperature: Mapped[float] = mapped_column(Float, default=74.2)

    casing_pressure: Mapped[float] = mapped_column(Float, default=4.1)
    tubing_pressure: Mapped[float] = mapped_column(Float, default=3.8)
    flowline_pressure: Mapped[float] = mapped_column(Float, default=3.2)

    pump_speed: Mapped[float] = mapped_column(Float, default=3.8)
    stroke_rate: Mapped[float] = mapped_column(Float, default=3.8)
    stroke_length_m: Mapped[float] = mapped_column(Float, default=3.65)
    pump_fillage: Mapped[float] = mapped_column(Float, default=84.6)
    fluid_level_m: Mapped[float] = mapped_column(Float, default=420.0)

    motor_current: Mapped[float] = mapped_column(Float, default=26.4)
    motor_power_kw: Mapped[float] = mapped_column(Float, default=18.6)
    torque: Mapped[float] = mapped_column(Float, default=4120.0)
    vibration: Mapped[float] = mapped_column(Float, default=2.8)

    peak_polished_rod_load: Mapped[float] = mapped_column(Float, default=184.2)
    minimum_polished_rod_load: Mapped[float] = mapped_column(Float, default=42.1)

    provenance: Mapped[str] = mapped_column(String(30), default="OBSERVED")

    __table_args__ = (
        Index("idx_telemetry_well_timestamp", "well_id", "timestamp"),
    )
