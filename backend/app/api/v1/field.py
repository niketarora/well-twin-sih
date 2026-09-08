from fastapi import APIRouter

router = APIRouter(prefix="/field", tags=["Field"])

@router.get("/summary")
async def get_field_summary():
    return {
        "field_name": "Baghewala Heavy Oil Field",
        "field_code": "BGHW-01",
        "total_wells": 7,
        "producing_wells": 4,
        "attention_wells": 1,
        "critical_wells": 1,
        "css_active_wells": 1,
        "shut_in_wells": 1,
        "total_bopd": 461,
        "avg_health": 70,
        "avg_bht": 188,
    }

@router.get("/wells")
async def get_field_wells():
    return [
        {
            "id": "well-bw-017",
            "code": "BW-17",
            "name": "Well BW-17 (Baghewala)",
            "pad": "Pad 03",
            "sector": "Sector 4 North",
            "lat": 27.5342,
            "lng": 72.1465,
            "status": "Attention Required",
            "statusReason": "Gas interference detected; pump fillage degraded to 61%; temperature declining faster than baseline curve.",
            "healthScore": 62,
            "oilRateBopd": 84,
            "waterCutPct": 78,
            "bottomHoleTempC": 182,
            "bottomHolePressMpa": 3.8,
            "srpFillagePct": 61,
            "fluidViscosityCp": 420,
            "spm": 4.8,
            "rodStressPct": 78,
            "cycle": 4,
            "dayInCycle": 38,
            "totalCycleDays": 90,
            "phase": "Production",
            "activeAlertsCount": 3,
            "topAlert": "Gas Interference & Incomplete Pump Fill (61%)",
            "scadaStatus": "Connected",
            "lastUpdated": "14:32:08 UTC",
            "isSyntheticDemo": True,
        }
    ]
