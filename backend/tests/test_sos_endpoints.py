import pytest
from app.core.config import settings

pytestmark = pytest.mark.asyncio

async def test_notification_mode_defaults_to_mock():
    # Safety net: tests must never place a real SMS/voice call.
    assert settings.NOTIFICATION_MODE == "mock"

async def test_sos_requires_category(client):
    resp = await client.post("/api/v1/sos", json={"location_description": "Near tank 4"})
    assert resp.status_code == 422

async def test_sos_requires_well_id_or_location(client):
    resp = await client.post("/api/v1/sos", json={"category": "FIRE_SMOKE"})
    assert resp.status_code == 422

async def test_sos_creates_incident_and_mock_notifications(client):
    resp = await client.post("/api/v1/sos", json={
        "category": "MEDICAL_EMERGENCY",
        "well_id": "well-bw-017",
        "description": "Worker collapsed near the pump.",
    })
    assert resp.status_code == 201
    body = resp.json()

    incident = body["incident"]
    assert incident["source_type"] == "MANUAL_SOS"
    assert incident["category"] == "MEDICAL_EMERGENCY"
    assert incident["status"] == "OPEN"
    assert incident["well_id"] == "well-bw-017"

    notifications = body["notifications"]
    assert len(notifications) > 0
    # MEDICAL_EMERGENCY routes to MEDICAL + SECURITY, each notified via SMS and VOICE.
    roles_notified = {n["contact_role"] for n in notifications}
    assert roles_notified == {"MEDICAL", "SECURITY"}
    channels_notified = {n["channel"] for n in notifications}
    assert channels_notified == {"SMS", "VOICE"}
    for n in notifications:
        assert n["provider"] == "mock"
        assert n["status"] == "MOCK_SENT"

    return incident["id"]

async def test_sos_with_location_description_only(client):
    resp = await client.post("/api/v1/sos", json={
        "category": "FIRE_SMOKE",
        "location_description": "Tank farm, north perimeter fence",
    })
    assert resp.status_code == 201
    incident = resp.json()["incident"]
    assert incident["well_id"] is None
    assert incident["location_description"] == "Tank farm, north perimeter fence"

async def test_duplicate_sos_reports_are_not_suppressed(client):
    payload = {"category": "SUSPECTED_LEAK", "well_id": "well-bw-003", "description": "Smell of gas near wellhead."}
    first = await client.post("/api/v1/sos", json=payload)
    second = await client.post("/api/v1/sos", json=payload)

    assert first.status_code == 201
    assert second.status_code == 201
    first_id = first.json()["incident"]["id"]
    second_id = second.json()["incident"]["id"]
    assert first_id != second_id
    # Second report is flagged as a possible duplicate of the first, but both were still created
    # and notified - manual SOS must never suppress an independent human report.
    assert second.json()["incident"]["possible_duplicate_of"] == first_id
    assert len(second.json()["notifications"]) > 0

async def test_incident_list_and_get(client):
    create_resp = await client.post("/api/v1/sos", json={
        "category": "EQUIPMENT_HAZARD",
        "well_id": "well-bw-022",
    })
    incident_id = create_resp.json()["incident"]["id"]

    list_resp = await client.get("/api/v1/incidents", params={"source_type": "MANUAL_SOS"})
    assert list_resp.status_code == 200
    ids = [i["id"] for i in list_resp.json()]
    assert incident_id in ids

    get_resp = await client.get(f"/api/v1/incidents/{incident_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == incident_id

async def test_incident_not_found(client):
    resp = await client.get("/api/v1/incidents/does-not-exist")
    assert resp.status_code == 404

async def test_incident_acknowledge_resolve_escalate(client):
    create_resp = await client.post("/api/v1/sos", json={
        "category": "PERSONNEL_DANGER",
        "well_id": "well-bw-017",
    })
    incident_id = create_resp.json()["incident"]["id"]

    ack_resp = await client.post(
        f"/api/v1/incidents/{incident_id}/acknowledge",
        json={"engineer_id": "eng-002", "notes": "Dispatched security."},
    )
    assert ack_resp.status_code == 200
    assert ack_resp.json()["status"] == "ACKNOWLEDGED"
    assert ack_resp.json()["acknowledged_by"] == "eng-002"

    escalate_resp = await client.post(
        f"/api/v1/incidents/{incident_id}/escalate",
        json={"engineer_id": "eng-002", "notes": "No response after 5 minutes."},
    )
    assert escalate_resp.status_code == 200
    assert escalate_resp.json()["status"] == "ESCALATED"
    assert escalate_resp.json()["escalation_level"] == 1

    resolve_resp = await client.post(
        f"/api/v1/incidents/{incident_id}/resolve",
        json={"engineer_id": "eng-002", "corrective_action": "False alarm, worker confirmed safe."},
    )
    assert resolve_resp.status_code == 200
    assert resolve_resp.json()["status"] == "RESOLVED"
    assert resolve_resp.json()["resolved_by"] == "eng-002"

async def test_alert_endpoints_unaffected_by_sos(client):
    # Regression guard: Manual SOS must not touch the existing Alert domain.
    resp = await client.get("/api/v1/wells/well-bw-017/alerts")
    assert resp.status_code == 200
    assert len(resp.json()) >= 1
