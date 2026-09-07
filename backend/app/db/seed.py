import asyncio
import json
from datetime import datetime, timedelta, timezone
from sqlalchemy import select
from app.db.connection import async_session_factory, init_db
from app.core.logging import logger
from app.models.well import Well
from app.models.telemetry import TelemetryReading
from app.models.model_state import ModelState
from app.models.model_prediction import ModelPrediction
from app.models.css_cycle import CssCycle
from app.models.equipment import Equipment
from app.models.alert import Alert
from app.models.anomaly import Anomaly
from app.models.insight import AiInsight
from app.models.recommendation import Recommendation
from app.models.work_order import WorkOrder
from app.models.contact import Contact

async def seed_demo_contacts_if_missing(session) -> None:
    """Ensures the demo notification-recipient contacts exist even on a database that was
    already seeded with the BW-017 well scenario before the Manual SOS feature was added -
    otherwise an already-seeded dev DB would silently have zero SOS recipients."""
    result = await session.execute(select(Contact))
    if result.scalars().first():
        return
    logger.info("Seeding demo notification contacts...")
    contacts = [
        Contact(name="Demo Security Desk", role="SECURITY", phone_number="+15550000101", active=True, notes="Demo/test contact - not a real responder."),
        Contact(name="Demo Medical Officer", role="MEDICAL", phone_number="+15550000102", active=True, notes="Demo/test contact - not a real responder."),
        Contact(name="Demo Safety Officer", role="SAFETY", phone_number="+15550000103", active=True, notes="Demo/test contact - not a real responder."),
        Contact(name="Demo Field Engineer", role="FIELD_ENGINEER", phone_number="+15550000104", active=True, notes="Demo/test contact - not a real responder."),
        Contact(name="Demo Shift Supervisor", role="SHIFT_SUPERVISOR", phone_number="+15550000105", active=True, notes="Demo/test contact - not a real responder."),
    ]
    session.add_all(contacts)
    await session.commit()
    logger.info("Successfully seeded demo notification contacts.")

async def seed_database():
    await init_db()

    async with async_session_factory() as session:
        # Check if already seeded
        result = await session.execute(select(Well).where(Well.well_code == "BW-017"))
        existing = result.scalar_one_or_none()
        if existing:
            logger.info("Database already seeded with BW-017. Skipping.")
            await seed_demo_contacts_if_missing(session)
            return

        logger.info("Seeding database with deterministic Baghewala Well BW-017 scenario...")
        now = datetime.now(timezone.utc)

        # 1. Wells
        well_bw017 = Well(
            id="well-bw-017",
            well_code="BW-017",
            name="Baghewala Heavy Oil Well 17",
            field_name="Baghewala",
            basin="Bikaner-Nagaur",
            latitude=27.5324,
            longitude=72.1486,
            formation="Jodhpur Sandstone",
            reservoir_depth_m=1120.0,
            total_depth_m=1420.0,
            crude_api=17.5,
            dead_oil_viscosity_cp=8500.0,
            current_cycle=4,
            operating_phase="Production",
            artificial_lift_type="Sucker Rod Pump",
            status="Active",
            description="CSS Cycle 4 production phase well exhibiting near-wellbore cooling and incomplete pump fillage."
        )

        well_bw003 = Well(
            id="well-bw-003",
            well_code="BW-003",
            name="Baghewala Thermal Well 03",
            field_name="Baghewala",
            basin="Bikaner-Nagaur",
            latitude=27.5350,
            longitude=72.1420,
            formation="Jodhpur Sandstone",
            reservoir_depth_m=1115.0,
            total_depth_m=1410.0,
            crude_api=17.2,
            dead_oil_viscosity_cp=8900.0,
            current_cycle=3,
            operating_phase="Soaking",
            artificial_lift_type="Sucker Rod Pump",
            status="Active",
            description="Thermal soaking phase following steam slug injection."
        )

        well_bw022 = Well(
            id="well-bw-022",
            well_code="BW-022",
            name="Baghewala Producer 22",
            field_name="Baghewala",
            basin="Bikaner-Nagaur",
            latitude=27.5290,
            longitude=72.1550,
            formation="Jodhpur Sandstone",
            reservoir_depth_m=1125.0,
            total_depth_m=1430.0,
            crude_api=17.8,
            dead_oil_viscosity_cp=8200.0,
            current_cycle=5,
            operating_phase="Production",
            artificial_lift_type="Sucker Rod Pump",
            status="Active",
            description="High water cut monitoring well."
        )

        session.add_all([well_bw017, well_bw003, well_bw022])
        await session.flush()

        # 2. Hourly Telemetry History for BW-017 (last 48 hours showing cooling trend)
        telemetry_batch = []
        for i in range(48, -1, -1):
            t = now - timedelta(hours=i)
            # Progressive cooling and fillage decline over 48 hours
            progress = (48 - i) / 48.0
            temp = 218.4 - (progress * 3.6)
            fillage = 88.5 - (progress * 3.9)
            oil = 196.8 - (progress * 12.6)
            rod_load = 176.0 + (progress * 8.2)

            reading = TelemetryReading(
                well_id=well_bw017.id,
                timestamp=t,
                oil_rate=round(oil, 1),
                water_rate=round(529.8 + progress * 8.0, 1),
                steam_rate=0.0,
                gas_rate=round(5.2, 1),
                bottomhole_pressure=round(38.7 + progress * 0.4, 1),
                bottomhole_temperature=round(temp, 1),
                wellhead_pressure=round(3.8, 1),
                wellhead_temperature=round(74.2 - progress * 1.2, 1),
                casing_pressure=4.1,
                tubing_pressure=3.8,
                flowline_pressure=3.2,
                pump_speed=3.8,
                stroke_rate=3.8,
                stroke_length_m=3.65,
                pump_fillage=round(fillage, 1),
                fluid_level_m=round(420.0 - progress * 15.0, 1),
                motor_current=round(25.1 + progress * 1.3, 1),
                motor_power_kw=round(17.8 + progress * 0.8, 1),
                torque=round(3980.0 + progress * 140.0, 1),
                vibration=round(2.3 + progress * 0.5, 1),
                peak_polished_rod_load=round(rod_load, 1),
                minimum_polished_rod_load=42.1,
                provenance="OBSERVED"
            )
            telemetry_batch.append(reading)

        session.add_all(telemetry_batch)

        # 3. Model States & Model Predictions
        state = ModelState(
            well_id=well_bw017.id,
            timestamp=now,
            reservoir_temp_c=134.2,
            steam_chamber_radius_m=18.4,
            heat_loss_rate_kw=142.0,
            crude_viscosity_cp=84.0,
            flowing_bottomhole_pressure_bar=42.1,
            liquid_holdup=0.68,
            pump_fillage_pct=84.6,
            fluid_pound_marker_m=2.80,
            rod_peak_stress_ratio=0.862,
            solver_convergence_mape=4.2,
            provenance="MODEL DERIVED"
        )
        session.add(state)

        predictions = [
            ModelPrediction(
                well_id=well_bw017.id,
                timestamp=now,
                model_name="surface_production_twin",
                target_metric="net_oil_bopd",
                predicted_value=198.0,
                actual_value=184.2,
                p10_value=178.0,
                p90_value=205.0,
                residual_error=-13.8,
                confidence_pct=93.0,
                model_version="v1.0"
            ),
            ModelPrediction(
                well_id=well_bw017.id,
                timestamp=now,
                model_name="srp_lift_twin",
                target_metric="pump_fillage_pct",
                predicted_value=92.1,
                actual_value=84.6,
                p10_value=82.0,
                p90_value=94.0,
                residual_error=-7.5,
                confidence_pct=91.5,
                model_version="v1.0"
            ),
        ]
        session.add_all(predictions)

        # 4. CSS Cycles
        c1 = CssCycle(
            well_id=well_bw017.id,
            cycle_number=1,
            start_date=now - timedelta(days=360),
            end_date=now - timedelta(days=275),
            steam_injected_tons=4200.0,
            oil_produced_bbls=14200.0,
            csor=2.85,
            status="Completed",
            current_phase="Cooling",
            phase_day=85,
            total_phase_days=85
        )
        c2 = CssCycle(
            well_id=well_bw017.id,
            cycle_number=2,
            start_date=now - timedelta(days=270),
            end_date=now - timedelta(days=185),
            steam_injected_tons=4500.0,
            oil_produced_bbls=13100.0,
            csor=2.98,
            status="Completed",
            current_phase="Cooling",
            phase_day=85,
            total_phase_days=85
        )
        c3 = CssCycle(
            well_id=well_bw017.id,
            cycle_number=3,
            start_date=now - timedelta(days=180),
            end_date=now - timedelta(days=95),
            steam_injected_tons=4700.0,
            oil_produced_bbls=12400.0,
            csor=3.05,
            status="Completed",
            current_phase="Cooling",
            phase_day=85,
            total_phase_days=85
        )
        c4 = CssCycle(
            well_id=well_bw017.id,
            cycle_number=4,
            start_date=now - timedelta(days=66),
            end_date=None,
            steam_injected_tons=4800.0,
            oil_produced_bbls=11250.0,
            csor=3.18,
            status="Active",
            current_phase="Production",
            phase_day=38,
            total_phase_days=90
        )
        session.add_all([c1, c2, c3, c4])

        # 5. Equipment
        eq1 = Equipment(
            well_id=well_bw017.id,
            tag="SRP-ROD-017",
            name="API Grade D 1.0\" / 0.875\" Tapered Rod String",
            category="Subsurface Mechanical",
            status="Operational",
            health_score=86.2,
            operating_hours=6420.0,
            goodman_stress_pct=86.2,
            last_inspection=now - timedelta(days=45),
            next_inspection=now + timedelta(days=135)
        )
        eq2 = Equipment(
            well_id=well_bw017.id,
            tag="PUMP-TH-017",
            name="Tubing Insert Plunger Pump (2.25\" Plunger)",
            category="Subsurface Hydraulic",
            status="Operational",
            health_score=88.4,
            operating_hours=6420.0,
            goodman_stress_pct=72.1,
            last_inspection=now - timedelta(days=45),
            next_inspection=now + timedelta(days=135)
        )
        eq3 = Equipment(
            well_id=well_bw017.id,
            tag="SURF-BM-017",
            name="Lufkin C-320D-256-120 Pumping Unit",
            category="Surface Mechanical",
            status="Operational",
            health_score=94.5,
            operating_hours=18450.0,
            goodman_stress_pct=78.0,
            last_inspection=now - timedelta(days=15),
            next_inspection=now + timedelta(days=75)
        )
        session.add_all([eq1, eq2, eq3])

        # 6. Alerts
        a1 = Alert(
            id="alert-001",
            well_id=well_bw017.id,
            title="Fluid Pound Inception Detected on Downstroke @ 2.80m",
            severity="Warning",
            subsystem="Artificial Lift",
            metric="Pump Fillage",
            observed_value="84.6 %",
            threshold="< 88.0 %",
            timestamp=now - timedelta(hours=3),
            status="Active",
            explanation="Viscous heavy oil inflow limitation causing downhole pump incomplete fillage and fluid pound.",
            action_required="Reduce stroke rate from 3.8 to 3.2 SPM to restore complete pump fillage."
        )
        a2 = Alert(
            id="alert-002",
            well_id=well_bw017.id,
            title="Near-Wellbore Thermal Dissipation Falloff",
            severity="Info",
            subsystem="Reservoir",
            metric="Bottomhole Temperature",
            observed_value="214.8 °C",
            threshold="< 216.0 °C",
            timestamp=now - timedelta(hours=6),
            status="Active",
            explanation="Thermal plume heat loss at -0.04°C/h increasing downhole oil viscosity towards 84 cP.",
            action_required="Monitor thermal gradient; prepare cycle transition planning."
        )
        a3 = Alert(
            id="alert-003",
            well_id=well_bw017.id,
            title="Peak Polished Rod Load Elevated",
            severity="Warning",
            subsystem="Mechanical",
            metric="Peak Polished Rod Load",
            observed_value="184.2 kN",
            threshold="> 180.0 kN",
            timestamp=now - timedelta(hours=14),
            status="Acknowledged",
            explanation="Downhole viscosity drag increasing upstroke rod tension.",
            action_required="Check gearbox torque and verify lubrication.",
            acknowledged_by="eng-001",
            acknowledged_at=now - timedelta(hours=12)
        )
        session.add_all([a1, a2, a3])

        # 7. Anomalies
        an1 = Anomaly(
            well_id=well_bw017.id,
            timestamp=now - timedelta(hours=4),
            severity="High",
            score=87.5,
            affected_metric="Pump Fillage",
            time_window="Last 24h",
            evidence="Pump fillage drifted -7.5% below twin predicted curve; dynamometer downstroke slope inflection @ 2.80m.",
            possible_cause="Thermal cooling inducing viscosity surge and incomplete pump chamber fillage."
        )
        an2 = Anomaly(
            well_id=well_bw017.id,
            timestamp=now - timedelta(hours=18),
            severity="Medium",
            score=74.2,
            affected_metric="Surface Wellhead Temperature",
            time_window="Last 7d",
            evidence="Wellhead effluent temperature declining at 0.18°C/day faster than baseline thermal dissipation model.",
            possible_cause="Flowline heat loss and multiphase holdup accumulation."
        )
        session.add_all([an1, an2])

        # 8. AI Insights
        ins1 = AiInsight(
            id="insight-001",
            well_id=well_bw017.id,
            title="Reservoir Cooling Inducing SRP Fluid Pound",
            severity="Warning",
            confidence_pct=89.0,
            summary="Thermal falloff in the near-wellbore steam chamber (R=18.4m, T=134.2°C) has increased crude viscosity to 84 cP, causing incomplete pump fillage (84.6%) and fluid pound @ 2.80m displacement.",
            evidence_json=json.dumps([
                "Bottomhole Temperature cooled from 218.4°C to 214.8°C (-3.6°C)",
                "Crude Viscosity increased +11.0% to 84.0 cP",
                "Pump Fillage dropped from 88.2% to 84.6% (-3.6%)",
                "Net Oil Rate dropped -7.0% below digital twin prediction (184.2 vs 198.0 BOPD)"
            ]),
            likely_cause="Near-wellbore thermal dissipation reducing fluid mobility below the critical pump intake velocity threshold.",
            recommended_action="Trim pumping speed from 3.8 to 3.2 SPM to match reservoir inflow and eliminate fluid pound.",
            projected_delta_bopd=13.8
        )
        session.add(ins1)

        # 9. Recommendations
        rec1 = Recommendation(
            id="rec-001",
            well_id=well_bw017.id,
            title="Reduce SRP Pumping Speed from 3.8 to 3.2 SPM",
            priority="High",
            action="Adjust VFD output frequency from 38 Hz to 32 Hz to set pumping speed to 3.2 SPM.",
            reason="Eliminates downstroke fluid pound at 2.80m, restores complete pump fillage (>92%), and reduces rod string cyclic stress fatigue.",
            evidence_json=json.dumps([
                "Dynamometer downhole card shows 15.4% void fraction on downstroke",
                "Peak polished rod load at 86.2% of API Grade D rating",
                "Hydrodynamic inflow velocity insufficient for 3.8 SPM"
            ]),
            expected_impact="+13.8 BOPD net oil recovery through elimination of gas/fluid interference and 40% reduction in rod wear.",
            confidence_pct=91.0,
            status="Pending"
        )
        session.add(rec1)

        # 10. Work Orders
        wo1 = WorkOrder(
            id="wo-001",
            order_number="WO-4819",
            well_id=well_bw017.id,
            title="Surface Choke Calibration & Dynamometer Stroke Verification",
            category="Artificial Lift",
            priority="High",
            status="In Progress",
            assigned_to="Field Crew Alpha",
            due_date=now + timedelta(days=2),
            notes="Verify fluid pound marker using acoustic echo sounding and record surface polished rod load transducer calibration.",
            related_alert_id="alert-001",
            related_recommendation_id="rec-001"
        )
        wo2 = WorkOrder(
            id="wo-002",
            order_number="WO-4820",
            well_id=well_bw017.id,
            title="Rod String Echo Acoustic Fluid Level Sounding",
            category="Reservoir",
            priority="Medium",
            status="Approved",
            assigned_to="Reservoir Diagnostic Team",
            due_date=now + timedelta(days=4),
            notes="Determine annular liquid level and verify casing gas pressure.",
            related_alert_id="alert-002",
            related_recommendation_id=None
        )
        session.add_all([wo1, wo2])
        await session.commit()
        logger.info("Successfully seeded database with all 10 domain entities for Well BW-017.")

        # 11. Notification Recipient Contacts (Manual SOS routing targets). Real recipient
        # numbers must never be hardcoded in source - only placeholder/demo numbers (the
        # reserved-for-fictional-use "555" exchange) are seeded here.
        await seed_demo_contacts_if_missing(session)

if __name__ == "__main__":
    asyncio.run(seed_database())
