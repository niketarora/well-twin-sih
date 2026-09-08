import pytest

pytestmark = pytest.mark.asyncio


async def test_css_predict_valid_request(client):
    payload = {
        "state": "RJ",
        "basin": "Bikaner-Nagaur",
        "field": "Baghewala",
        "history": [
            {"date": "2026-05-01", "oil_m3": 1787.0, "steam_t": 9800.0, "producer_well_count": 1, "injector_well_count": 1},
            {"date": "2026-06-01", "oil_m3": 1618.0, "steam_t": 10600.0, "producer_well_count": 1, "injector_well_count": 1},
            {"date": "2026-07-01", "oil_m3": 1469.0, "steam_t": 11500.0, "producer_well_count": 1, "injector_well_count": 1},
            {"date": "2026-08-01", "oil_m3": 766.0, "steam_t": 12400.0, "producer_well_count": 1, "injector_well_count": 1},
        ],
        "well_id": "well-bw-017",
    }
    response = await client.post("/api/v1/css/predict", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "model_version" in data
    assert "predicted_next_oil_m3" in data
    assert data["predicted_next_oil_m3"] > 0
    assert "forecast_osr" in data
    assert data["forecast_osr"] > 0
    assert "economic_status" in data
    assert data["economic_status"] in ["OPTIMAL", "WATCH", "CUTOFF_WARNING"]
    assert "predicted_oil_bbl" in data
    assert data["predicted_oil_bbl"] > 0


async def test_css_predict_too_few_records(client):
    payload = {
        "state": "RJ",
        "basin": "Bikaner-Nagaur",
        "field": "Baghewala",
        "history": [
            {"date": "2026-07-01", "oil_m3": 1469.0, "steam_t": 11500.0},
            {"date": "2026-08-01", "oil_m3": 766.0, "steam_t": 12400.0},
        ],
    }
    response = await client.post("/api/v1/css/predict", json=payload)
    assert response.status_code == 422


async def test_css_predict_negative_oil(client):
    payload = {
        "state": "RJ",
        "basin": "Bikaner-Nagaur",
        "field": "Baghewala",
        "history": [
            {"date": "2026-05-01", "oil_m3": -100.0, "steam_t": 9800.0},
            {"date": "2026-06-01", "oil_m3": 1618.0, "steam_t": 10600.0},
            {"date": "2026-07-01", "oil_m3": 1469.0, "steam_t": 11500.0},
            {"date": "2026-08-01", "oil_m3": 766.0, "steam_t": 12400.0},
        ],
    }
    response = await client.post("/api/v1/css/predict", json=payload)
    assert response.status_code == 422


async def test_css_sensitivity_endpoint(client):
    payload = {
        "state": "RJ",
        "basin": "Bikaner-Nagaur",
        "field": "Baghewala",
        "history": [
            {"date": "2026-05-01", "oil_m3": 1787.0, "steam_t": 9800.0},
            {"date": "2026-06-01", "oil_m3": 1618.0, "steam_t": 10600.0},
            {"date": "2026-07-01", "oil_m3": 1469.0, "steam_t": 11500.0},
            {"date": "2026-08-01", "oil_m3": 766.0, "steam_t": 12400.0},
        ],
        "steam_change_percentages": [-20.0, -10.0, 0.0, 10.0, 20.0],
    }
    response = await client.post("/api/v1/css/sensitivity", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "scenarios" in data
    assert len(data["scenarios"]) == 5
    assert all("predicted_next_field_oil_m3" in s for s in data["scenarios"])


async def test_css_history_endpoint(client):
    response = await client.get("/api/v1/css/history?well_id=well-bw-017&limit=5")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    first = data[0]
    assert "predicted_next_oil_m3" in first
    assert "forecast_osr" in first


async def test_css_model_info_endpoint(client):
    response = await client.get("/api/v1/css/model-info")
    assert response.status_code == 200
    data = response.json()
    assert "model_version" in data
    assert "test_metrics" in data
