import pytest
import os
import torch
from ml.srp.src.preprocessing import (
    validate_raw_features,
    preprocess_features,
    load_preprocessing_artifacts,
    FEATURES,
)
from ml.srp.src.feature_builder import (
    build_srp_features,
    calculate_dyno_area_shoelace,
    convert_metric_srp_to_field_units,
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")


@pytest.fixture
def artifacts():
    scaler_path = os.path.join(MODELS_DIR, "scaler.pkl")
    prep_path = os.path.join(MODELS_DIR, "preprocessing.json")
    thresh_path = os.path.join(MODELS_DIR, "threshold.json")
    scaler, prep_config, thresh_config = load_preprocessing_artifacts(
        scaler_path, prep_path, thresh_path
    )
    return scaler, prep_config, thresh_config


def test_validate_raw_features_valid():
    valid_features = {
        "SPM": 4.5,
        "pump_fillage": 72.5,
        "min_rod_weight": 3500.0,
        "max_rod_weight": 6500.0,
        "dynamometer_area": 120000.0,
        "rod_load_range": 3000.0,
    }
    # Should not raise
    validate_raw_features(valid_features)


def test_validate_raw_features_missing():
    invalid = {
        "SPM": 4.5,
        "pump_fillage": 72.5,
        # missing others
    }
    with pytest.raises(ValueError, match="Missing required SRP features"):
        validate_raw_features(invalid)


def test_validate_raw_features_nan():
    invalid = {
        "SPM": float("nan"),
        "pump_fillage": 72.5,
        "min_rod_weight": 3500.0,
        "max_rod_weight": 6500.0,
        "dynamometer_area": 120000.0,
        "rod_load_range": 3000.0,
    }
    with pytest.raises(ValueError, match="invalid non-numeric or NaN"):
        validate_raw_features(invalid)


def test_validate_raw_features_max_less_than_min():
    invalid = {
        "SPM": 4.5,
        "pump_fillage": 72.5,
        "min_rod_weight": 7000.0,
        "max_rod_weight": 3000.0,
        "dynamometer_area": 120000.0,
        "rod_load_range": -4000.0,
    }
    with pytest.raises(ValueError, match="cannot be less than minimum rod weight"):
        validate_raw_features(invalid)


def test_feature_builder_derives_range():
    built = build_srp_features(
        spm=4.5,
        pump_fillage=72.5,
        min_rod_weight=3500.0,
        max_rod_weight=6500.0,
        dynamometer_area=120000.0,
        is_metric=False,
    )
    assert built["rod_load_range"] == 3000.0
    assert built["SPM"] == 4.5
    assert built["pump_fillage"] == 72.5


def test_calculate_dyno_area_shoelace():
    # Square from (0,0) to (2, 5): width=2, height=5 => Area = 10
    square_loop = [[0, 0], [2, 0], [2, 5], [0, 5]]
    area = calculate_dyno_area_shoelace(square_loop)
    assert abs(area - 10.0) < 1e-5


def test_clipping_and_scaling(artifacts):
    scaler, prep_config, _ = artifacts
    # Out of range SPM: 15.0 (upper bound is ~7.09)
    features = {
        "SPM": 15.0,
        "pump_fillage": 72.5,
        "min_rod_weight": 3500.0,
        "max_rod_weight": 6500.0,
        "dynamometer_area": 120000.0,
        "rod_load_range": 3000.0,
    }
    tensor, warnings = preprocess_features(
        features, scaler, prep_config, device=torch.device("cpu")
    )
    assert tensor.shape == (1, 6)
    assert len(warnings) > 0
    assert any("exceeds model training range" in w for w in warnings)
