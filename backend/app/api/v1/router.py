from fastapi import APIRouter
from app.api.v1 import (
    health,
    wells,
    telemetry,
    trends,
    css_cycles,
    equipment,
    alerts,
    anomalies,
    insights,
    recommendations,
    work_orders,
    twin,
    sos,
    incidents,
    ai,
    voice,
    navigator,
    field,
)

api_router = APIRouter()

api_router.include_router(field.router)
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(wells.router, tags=["Wells"])
api_router.include_router(telemetry.router, tags=["Telemetry"])
api_router.include_router(trends.router, tags=["Trends"])
api_router.include_router(css_cycles.router, tags=["CSS Cycles"])
api_router.include_router(equipment.router, tags=["Equipment"])
api_router.include_router(alerts.router, tags=["Alerts"])
api_router.include_router(anomalies.router, tags=["Anomalies"])
api_router.include_router(insights.router, tags=["AI Insights"])
api_router.include_router(recommendations.router, tags=["Recommendations"])
api_router.include_router(work_orders.router, tags=["Work Orders"])
api_router.include_router(twin.router, tags=["Digital Twin"])
api_router.include_router(sos.router, tags=["Manual SOS"])
api_router.include_router(incidents.router, tags=["Incidents"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Copilot"])
api_router.include_router(voice.router, prefix="/voice", tags=["Voice (Sarvam STT/TTS)"])
api_router.include_router(navigator.router, prefix="/ai", tags=["AI Navigator"])

