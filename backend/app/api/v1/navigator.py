import time
import logging
from fastapi import APIRouter, HTTPException, status
from app.schemas.navigator import (
    NavigatorRequest,
    NavigatorResponse,
    NavigatorIntent,
)
from app.ai.router.router import gemini_router
from app.ai.grounding.gate import grounding_gate
from app.ai.answer.service import grounded_answer_service
from app.data.factory import get_well_repository
from app.services.sarvam_service import sarvam_service

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/navigator", response_model=NavigatorResponse, summary="Orchestrate AI Navigator query with grounding and voice")
async def ai_navigator_endpoint(payload: NavigatorRequest):
    start_time = time.time()

    if not payload.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User message cannot be empty."
        )

    # 1. Gemini Intent Routing
    intent_result = await gemini_router.classify_intent(
        message=payload.message,
        current_page=payload.current_page or "field_map",
        selected_well=payload.selected_well or "BW-017",
    )

    repo = get_well_repository()
    well_id = intent_result.well_id or payload.selected_well or "well-bw-017"

    # Normalize well id
    clean_id = well_id.strip()
    if not clean_id.startswith("well-"):
        num = "".join(filter(str.isdigit, clean_id))
        clean_id = f"well-bw-{int(num):03d}" if num else f"well-{clean_id.lower()}"

    # 2. Data Retrieval
    well_data = await repo.get_well(clean_id)
    telemetry = await repo.get_telemetry(clean_id)
    alerts = await repo.get_alerts(clean_id)

    # 3. Grounding Gate
    is_grounded, failure_reason = grounding_gate.evaluate(
        intent=intent_result.intent,
        well_data=well_data,
        telemetry=telemetry,
        query=payload.message,
    )

    if not is_grounded:
        response = NavigatorResponse(
            type="INSUFFICIENT_DATA",
            intent=NavigatorIntent.INSUFFICIENT_DATA,
            message=f"I do not have verified surveillance data to reliably answer that request. {failure_reason}",
            well_id=clean_id if well_data else None,
            navigation=None,
            evidence=[],
            metadata={
                "confidence": 0.99,
                "reason": failure_reason,
                "dataSource": "repository",
                "latencyMs": int((time.time() - start_time) * 1000),
            },
        )
    else:
        # 4. Grounded Answer Generation
        response = await grounded_answer_service.generate_grounded_answer(
            intent=intent_result.intent,
            target=intent_result.target,
            well_data=well_data,
            telemetry=telemetry,
            alerts=alerts,
            query=payload.message,
            well_id=clean_id,
        )
        response.metadata = {
            "confidence": intent_result.confidence,
            "routerReason": intent_result.reason,
            "dataSource": "mock" if repo.__class__.__name__.startswith("Mock") else "supabase",
            "latencyMs": int((time.time() - start_time) * 1000),
        }

    # 5. Optional Audio Synthesis via Sarvam TTS
    if payload.include_audio and response.message:
        tts_res = await sarvam_service.text_to_speech(response.message, speaker="meera")
        response.audio_base64 = tts_res.audio_base64

    return response
