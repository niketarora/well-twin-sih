import asyncio
import io
import json
import os
import sys

# Ensure backend directory is in python path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import httpx
from app.main import app

async def run_pipeline_tests():
    print("=" * 70)
    print("LIVE AI VOICE COPILOT & PETROLEUM ENGINEER PIPELINE INTEGRATION TEST")
    print("=" * 70)

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        
        # Test 1: STT Endpoint (/api/v1/voice/stt)
        print("\n[TEST 1] Testing Voice STT Endpoint (Sarvam Saaras STT)...")
        dummy_wav = b"RIFF$\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00D\xac\x00\x00\x88X\x01\x00\x02\x00\x10\x00data\x00\x00\x00\x00"
        files = {"file": ("test_voice.wav", dummy_wav, "audio/wav")}
        data = {"language_code": "en-IN"}
        stt_resp = await client.post("/api/v1/voice/stt", files=files, data=data)
        assert stt_resp.status_code == 200, f"STT failed with {stt_resp.status_code}: {stt_resp.text}"
        stt_json = stt_resp.json()
        print(f" -> STT Response: Transcript='{stt_json.get('transcript')}', is_simulated={stt_json.get('is_simulated')}")
        assert "transcript" in stt_json and stt_json["transcript"], "Transcript should not be empty"
        print(" [PASS] STT endpoint validated.")

        # Test 2: AI Navigator Database Grounded Telemetry Query
        print("\n[TEST 2] Testing Grounded Telemetry Lookup via AI Navigator...")
        db_query_payload = {
            "message": "What is the net oil rate and pump fillage for well BW-17?",
            "current_page": "overview",
            "selected_well": "BW-017",
            "include_audio": True
        }
        nav_resp1 = await client.post("/api/v1/ai/navigator", json=db_query_payload)
        assert nav_resp1.status_code == 200, f"Navigator failed: {nav_resp1.text}"
        nav_json1 = nav_resp1.json()
        print(f" -> Intent: {nav_json1.get('intent')}")
        print(f" -> Message: {nav_json1.get('message')}")
        print(f" -> Evidence Count: {len(nav_json1.get('evidence', []))}")
        for ev in nav_json1.get("evidence", []):
            print(f"    * {ev['label']}: {ev['value']} {ev.get('unit', '')} [{ev['provenance']}]")
        assert any("Oil" in e["label"] for e in nav_json1.get("evidence", [])), "Must have oil rate evidence"
        print(" [PASS] Grounded database lookup validated.")

        # Test 3: AI Navigator Petroleum Engineering Physics LLM
        print("\n[TEST 3] Testing Petroleum Engineer LLM Reasoning (Physics / Zero Hallucination)...")
        eng_query_payload = {
            "message": "Explain how fluid pound damages sucker rods in heavy oil and what downhole mechanics occur.",
            "current_page": "srp",
            "selected_well": "BW-017",
            "include_audio": False
        }
        nav_resp2 = await client.post("/api/v1/ai/navigator", json=eng_query_payload)
        assert nav_resp2.status_code == 200, f"Navigator failed: {nav_resp2.text}"
        nav_json2 = nav_resp2.json()
        print(f" -> Intent: {nav_json2.get('intent')}")
        print(f" -> Engineer Explanation Preview:\n{nav_json2.get('message')[:300]}...")
        assert "pound" in nav_json2.get("message", "").lower() or "rod" in nav_json2.get("message", "").lower(), "Must explain fluid pound"
        print(" [PASS] Petroleum Engineer LLM reasoning validated.")

        # Test 4: AI Navigator Direct Navigation Intent
        print("\n[TEST 4] Testing Direct Navigation Routing to SRP Pump...")
        nav_action_payload = {
            "message": "Open SRP lift dynamics for BW-17",
            "current_page": "field_map",
            "selected_well": "BW-017",
            "include_audio": False
        }
        nav_resp3 = await client.post("/api/v1/ai/navigator", json=nav_action_payload)
        assert nav_resp3.status_code == 200, f"Navigator failed: {nav_resp3.text}"
        nav_json3 = nav_resp3.json()
        print(f" -> Intent: {nav_json3.get('intent')}")
        print(f" -> Navigation Target: {nav_json3.get('navigation')}")
        assert nav_json3.get("navigation") is not None, "Navigation action should be present"
        assert "/srp-pump" in nav_json3["navigation"]["route"], "Route must point to /srp-pump"
        print(" [PASS] Direct navigation action validated.")

        # Test 5: Voice TTS Endpoint (/api/v1/voice/tts)
        print("\n[TEST 5] Testing Voice TTS Endpoint (Sarvam Bulbul 'meera')...")
        tts_payload = {
            "text": "Net oil rate for well BW-17 is 84 BOPD with 61.4% pump fillage.",
            "speaker": "meera",
            "target_language_code": "en-IN"
        }
        tts_resp = await client.post("/api/v1/voice/tts", json=tts_payload)
        assert tts_resp.status_code == 200, f"TTS failed with {tts_resp.status_code}: {tts_resp.text}"
        tts_json = tts_resp.json()
        print(f" -> TTS Result: is_simulated={tts_json.get('is_simulated')}, has_audio={bool(tts_json.get('audio_base64'))}")
        print(" [PASS] Voice TTS endpoint validated.")

    print("\n" + "=" * 70)
    print("ALL LIVE AI VOICE COPILOT & PETROLEUM ENGINEER TESTS PASSED!")
    print("=" * 70)

if __name__ == "__main__":
    asyncio.run(run_pipeline_tests())
