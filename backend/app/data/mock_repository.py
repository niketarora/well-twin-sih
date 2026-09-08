from typing import Optional, List, Dict, Any
from app.data.repository import WellDataRepository

class MockWellDataRepository(WellDataRepository):
    def __init__(self):
        self._wells = {
            "well-bw-017": {
                "id": "well-bw-017",
                "code": "BW-17",
                "name": "Well BW-017",
                "pad": "Pad 03",
                "sector": "Sector 4 North",
                "status": "Attention Required",
                "health_score": 62.0,
                "current_cycle": 4,
                "day_in_cycle": 38,
                "operating_phase": "Production",
            },
            "well-bw-022": {
                "id": "well-bw-022",
                "code": "BW-22",
                "name": "Well BW-022",
                "pad": "Pad 02",
                "sector": "Sector 3 Central",
                "status": "Critical",
                "health_score": 41.0,
                "current_cycle": 3,
                "day_in_cycle": 65,
                "operating_phase": "Production",
            },
            "well-bw-001": {
                "id": "well-bw-001",
                "code": "BW-01",
                "name": "Well BW-001",
                "pad": "Pad 01",
                "sector": "Sector 1 West",
                "status": "Optimal",
                "health_score": 92.0,
                "current_cycle": 5,
                "day_in_cycle": 12,
                "operating_phase": "Production",
            },
            "well-bw-004": {
                "id": "well-bw-004",
                "code": "BW-04",
                "name": "Well BW-004",
                "pad": "Pad 01",
                "sector": "Sector 2 East",
                "status": "Optimal",
                "health_score": 85.0,
                "current_cycle": 4,
                "day_in_cycle": 42,
                "operating_phase": "Production",
            },
            "well-bw-023": {
                "id": "well-bw-023",
                "code": "BW-23",
                "name": "Well BW-023",
                "pad": "Pad 04",
                "sector": "Sector 4 North",
                "status": "Optimal",
                "health_score": 94.0,
                "current_cycle": 2,
                "day_in_cycle": 18,
                "operating_phase": "Production",
            },
            "well-bw-031": {
                "id": "well-bw-031",
                "code": "BW-31",
                "name": "Well BW-031",
                "pad": "Pad 05",
                "sector": "Sector 5 South",
                "status": "Optimal",
                "health_score": 88.0,
                "current_cycle": 3,
                "day_in_cycle": 27,
                "operating_phase": "Production",
            },
        }

        self._telemetry = {
            "well-bw-017": {
                "oil_rate_bopd": 84.0,
                "target_rate_bopd": 100.0,
                "water_cut_pct": 78.2,
                "bht_c": 182.0,
                "bhp_mpa": 3.8,
                "viscosity_cp": 420.0,
                "fillage_pct": 61.4,
                "spm": 4.8,
                "pprl_kn": 88.4,
                "goodman_stress_pct": 81.5,
                "impact_displacement_m": 2.80,
                "tubing_head_pressure_mpa": 1.2,
                "casing_head_pressure_mpa": 2.1,
            },
            "well-bw-022": {
                "oil_rate_bopd": 52.0,
                "target_rate_bopd": 90.0,
                "water_cut_pct": 84.5,
                "bht_c": 174.0,
                "bhp_mpa": 3.2,
                "viscosity_cp": 540.0,
                "fillage_pct": 48.0,
                "spm": 5.2,
                "pprl_kn": 92.0,
                "goodman_stress_pct": 86.2,
                "impact_displacement_m": 2.45,
            },
            "well-bw-001": {
                "oil_rate_bopd": 184.2,
                "target_rate_bopd": 180.0,
                "water_cut_pct": 71.0,
                "bht_c": 212.0,
                "bhp_mpa": 4.6,
                "viscosity_cp": 280.0,
                "fillage_pct": 91.5,
                "spm": 4.2,
                "pprl_kn": 76.0,
                "goodman_stress_pct": 68.0,
            },
            "well-bw-023": {
                "oil_rate_bopd": 210.0,
                "target_rate_bopd": 200.0,
                "water_cut_pct": 64.0,
                "bht_c": 218.0,
                "bhp_mpa": 4.8,
                "viscosity_cp": 240.0,
                "fillage_pct": 94.0,
                "spm": 4.5,
                "pprl_kn": 74.5,
                "goodman_stress_pct": 65.5,
            },
        }

        self._alerts = [
            {
                "id": "ALM-4415",
                "well_id": "well-bw-017",
                "severity": "critical",
                "title": "Goodman Stress Ratio Safety Exceedance (81.5% > 80%)",
                "subsystem": "Artificial Lift Mechanics",
                "timestamp": "12m ago",
                "status": "active",
                "what": "0.875 in taper at 420-780 m depth exceeds the 80.0% Goodman fatigue ceiling.",
                "why": "Heavy oil drag combined with fluid pound shock waves at 2.80 m.",
                "action": "Trim VFD setpoint from 4.8 to 3.8 SPM.",
            },
            {
                "id": "ALM-4412",
                "well_id": "well-bw-017",
                "severity": "warning",
                "title": "Downhole Sucker Rod Pump Fluid Pound Detected",
                "subsystem": "Downhole Kinematics",
                "timestamp": "42m ago",
                "status": "active",
                "what": "Traveling valve contact slam at 2.80 m downstroke.",
                "why": "Bottomhole temperature cooling to 182°C elevated viscosity and gas breakout.",
                "action": "Reduce pumping cadence to allow chamber recharge.",
            },
        ]

    def _normalize_id(self, well_id: str) -> str:
        s = well_id.strip().lower()
        if not s.startswith("well-"):
            # e.g. "bw-17" -> "well-bw-017"
            num = "".join(filter(str.isdigit, s))
            if num:
                return f"well-bw-{int(num):03d}"
            return f"well-{s}"
        return s

    async def get_well(self, well_id: str) -> Optional[Dict[str, Any]]:
        nid = self._normalize_id(well_id)
        return self._wells.get(nid)

    async def get_telemetry(self, well_id: str) -> Optional[Dict[str, Any]]:
        nid = self._normalize_id(well_id)
        return self._telemetry.get(nid)

    async def get_alerts(self, well_id: Optional[str] = None) -> List[Dict[str, Any]]:
        if well_id:
            nid = self._normalize_id(well_id)
            return [a for a in self._alerts if a["well_id"] == nid]
        return self._alerts

    async def get_production_history(self, well_id: str) -> List[Dict[str, Any]]:
        return [
            {"day": 34, "oil_rate_bopd": 96.0, "water_cut_pct": 74.0},
            {"day": 35, "oil_rate_bopd": 92.5, "water_cut_pct": 75.5},
            {"day": 36, "oil_rate_bopd": 89.0, "water_cut_pct": 76.8},
            {"day": 37, "oil_rate_bopd": 86.2, "water_cut_pct": 77.4},
            {"day": 38, "oil_rate_bopd": 84.0, "water_cut_pct": 78.2},
        ]

    async def get_all_wells(self) -> List[Dict[str, Any]]:
        return list(self._wells.values())
