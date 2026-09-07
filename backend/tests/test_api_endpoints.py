import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["healthy", "degraded"]
    assert "version" in data
    assert "database" in data

@pytest.mark.asyncio
async def test_list_wells(client: AsyncClient):
    response = await client.get("/api/v1/wells")
    assert response.status_code == 200
    wells = response.json()
    assert len(wells) >= 3
    codes = [w["well_code"] for w in wells]
    assert "BW-017" in codes

@pytest.mark.asyncio
async def test_get_well_details(client: AsyncClient):
    response = await client.get("/api/v1/wells/well-bw-017")
    assert response.status_code == 200
    well = response.json()
    assert well["well_code"] == "BW-017"
    assert well["operating_phase"] == "Production"

@pytest.mark.asyncio
async def test_get_well_health(client: AsyncClient):
    response = await client.get("/api/v1/wells/well-bw-017/health")
    assert response.status_code == 200
    health = response.json()
    assert "overall_score" in health
    assert "subsystems" in health
    assert "srp" in health["subsystems"]
    assert health["subsystems"]["srp"]["score"] == 76

@pytest.mark.asyncio
async def test_get_latest_telemetry(client: AsyncClient):
    response = await client.get("/api/v1/wells/well-bw-017/telemetry/latest")
    assert response.status_code == 200
    tel = response.json()
    assert tel["well_id"] == "well-bw-017"
    assert "bottomhole_temperature" in tel
    assert "oil_rate" in tel

@pytest.mark.asyncio
async def test_get_trends(client: AsyncClient):
    response = await client.get("/api/v1/wells/well-bw-017/trends")
    assert response.status_code == 200
    trends = response.json()
    assert len(trends) > 0
    assert "oil_rate" in trends[0]
    assert "viscosity" in trends[0]

@pytest.mark.asyncio
async def test_alerts_and_mutations(client: AsyncClient):
    # 1. List alerts
    response = await client.get("/api/v1/wells/well-bw-017/alerts")
    assert response.status_code == 200
    alerts = response.json()
    assert len(alerts) >= 1
    target_alert = alerts[0]

    # 2. Acknowledge alert
    ack_res = await client.post(
        f"/api/v1/alerts/{target_alert['id']}/acknowledge",
        json={"engineer_id": "eng-test", "notes": "Verified by test suite"}
    )
    assert ack_res.status_code == 200
    updated = ack_res.json()
    assert updated["status"] == "Acknowledged"

@pytest.mark.asyncio
async def test_recommendations_and_mutations(client: AsyncClient):
    response = await client.get("/api/v1/wells/well-bw-017/recommendations")
    assert response.status_code == 200
    recs = response.json()
    assert len(recs) >= 1
    target = recs[0]

    update_res = await client.post(
        f"/api/v1/recommendations/{target['id']}/status",
        json={"status": "Accepted"}
    )
    assert update_res.status_code == 200
    assert update_res.json()["status"] == "Accepted"

@pytest.mark.asyncio
async def test_work_orders_crud(client: AsyncClient):
    # 1. List
    res = await client.get("/api/v1/work-orders")
    assert res.status_code == 200

    # 2. Create
    new_wo = {
        "well_id": "well-bw-017",
        "title": "Automated Test Inspection Work Order",
        "category": "Mechanical",
        "priority": "Medium",
        "assigned_to": "Field Crew Beta",
        "notes": "Created by pytest"
    }
    create_res = await client.post("/api/v1/work-orders", json=new_wo)
    assert create_res.status_code == 201
    created = create_res.json()
    assert created["title"] == new_wo["title"]

    # 3. Patch
    patch_res = await client.patch(
        f"/api/v1/work-orders/{created['id']}",
        json={"status": "Completed"}
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "Completed"

@pytest.mark.asyncio
async def test_twin_state_and_predictions(client: AsyncClient):
    res_state = await client.get("/api/v1/wells/well-bw-017/twin/state")
    assert res_state.status_code == 200
    state = res_state.json()
    assert state["steam_chamber_radius_m"] == 18.4

    res_preds = await client.get("/api/v1/wells/well-bw-017/twin/predictions")
    assert res_preds.status_code == 200
    preds = res_preds.json()
    assert len(preds) >= 1
