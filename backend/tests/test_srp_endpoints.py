import pytest

pytestmark = pytest.mark.asyncio


async def test_srp_predict_valid_metric(client):
    payload = {
        "spm": 8.4,
        "pump_fillage": 84.6,
        "min_rod_weight": 24.6,  # kN
        "max_rod_weight": 88.4,  # kN
        "dynamometer_area": 214.2,  # kJ
        "well_id": "well-bw-017",
        "is_metric": True,
    }
    response = await client.post("/api/v1/srp/predict", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "condition" in data
    assert data["condition"] in ["NORMAL", "WARNING", "CRITICAL"]
    assert "anomaly_score" in data
    assert data["anomaly_score"] >= 0.0
    assert data["warning_threshold"] == 0.001276
    assert data["critical_threshold"] == 0.007778
    assert data["model_version"] == "srp-autoencoder-v1"
    assert "inputs" in data
    assert "is_healthy" in data


async def test_srp_predict_direct_route(client):
    # Tests the direct /api/srp/predict mount
    payload = {
        "spm": 4.5,
        "pump_fillage": 92.0,
        "min_rod_weight": 3500.0,
        "max_rod_weight": 6500.0,
        "dynamometer_area": 120000.0,
        "well_id": "well-bw-017",
        "is_metric": False,
    }
    response = await client.post("/api/srp/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["condition"] in ["NORMAL", "WARNING", "CRITICAL"]
    assert data["model_version"] == "srp-autoencoder-v1"


async def test_srp_predict_validation_max_less_than_min(client):
    payload = {
        "spm": 4.5,
        "pump_fillage": 72.5,
        "min_rod_weight": 7000.0,
        "max_rod_weight": 3000.0,
        "dynamometer_area": 120000.0,
        "well_id": "well-bw-017",
        "is_metric": False,
    }
    response = await client.post("/api/v1/srp/predict", json=payload)
    assert response.status_code == 400
    assert "cannot be less than minimum rod weight" in response.json()["detail"]


async def test_srp_predict_missing_fields(client):
    payload = {
        "spm": 4.5,
        # missing pump_fillage, rod weights
    }
    response = await client.post("/api/v1/srp/predict", json=payload)
    assert response.status_code == 422


async def test_srp_history_endpoint(client):
    response = await client.get("/api/v1/srp/history?well_id=well-bw-017&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    first = data[0]
    assert "condition" in first
    assert "anomaly_score" in first
    assert "well_id" in first


async def test_srp_field_status_endpoint(client):
    response = await client.get("/api/v1/srp/field-status")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 5
    well_codes = [w["well_code"] for w in data]
    assert "BW-017" in well_codes
