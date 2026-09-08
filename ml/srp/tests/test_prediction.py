import os
import pytest
from ml.srp.src.predictor import get_srp_predictor, SRPPredictor
from ml.srp.src.feature_builder import build_srp_features


def test_predictor_singleton():
    p1 = get_srp_predictor()
    p2 = get_srp_predictor()
    assert p1 is p2
    assert p1.model_version == "srp-autoencoder-v1"


def test_predict_normal_case():
    predictor = get_srp_predictor()
    # Typical operating point
    features = build_srp_features(
        spm=4.5,
        pump_fillage=92.0,
        min_rod_weight=4000.0,
        max_rod_weight=6200.0,
        dynamometer_area=120000.0,
        is_metric=False,
    )
    result = predictor.predict(features)

    assert "condition" in result
    assert result["condition"] in ["NORMAL", "WARNING", "CRITICAL"]
    assert "anomaly_score" in result
    assert isinstance(result["anomaly_score"], float)
    assert result["anomaly_score"] >= 0.0
    assert result["warning_threshold"] == round(predictor.warning_threshold, 6)
    assert result["critical_threshold"] == round(predictor.critical_threshold, 6)
    assert result["model_version"] == "srp-autoencoder-v1"


def test_predict_critical_anomaly_case():
    predictor = get_srp_predictor()
    # Extreme abnormal operating point (very low fillage, high SPM)
    features = build_srp_features(
        spm=7.0,
        pump_fillage=5.0,
        min_rod_weight=1800.0,
        max_rod_weight=16500.0,
        dynamometer_area=1000.0,
        is_metric=False,
    )
    result = predictor.predict(features)

    assert "condition" in result
    # Severe divergence should trigger WARNING or CRITICAL
    assert result["condition"] in ["WARNING", "CRITICAL"]
    assert result["anomaly_score"] >= result["warning_threshold"]


def test_metric_conversion_pipeline():
    predictor = get_srp_predictor()
    # Provide values in metric units (like the Digital Twin UI: kN and stroke in m)
    features = build_srp_features(
        spm=8.4,
        pump_fillage=84.6,
        min_rod_weight=24.6,  # kN
        max_rod_weight=88.4,  # kN
        dynamometer_area=214.2,  # m * kN (kJ)
        is_metric=True,
    )
    # 24.6 kN -> ~5,530 lbf
    assert features["min_rod_weight"] > 1000.0
    # 88.4 kN -> ~19,873 lbf
    assert features["max_rod_weight"] > 5000.0
    # 214.2 kJ -> ~157,985 ft*lbf
    assert features["dynamometer_area"] > 50000.0

    result = predictor.predict(features)
    assert "condition" in result
    assert result["model_version"] == "srp-autoencoder-v1"
