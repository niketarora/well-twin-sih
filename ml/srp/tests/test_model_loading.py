import os
import pytest
import torch

from ml.srp.src.model import SRPAutoencoder, load_autoencoder_model
from ml.srp.src.preprocessing import load_preprocessing_artifacts, FEATURES

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")


def test_model_artifact_files_exist():
    expected_files = [
        "srp_autoencoder.pt",
        "scaler.pkl",
        "preprocessing.json",
        "threshold.json",
    ]
    for filename in expected_files:
        path = os.path.join(MODELS_DIR, filename)
        assert os.path.exists(path), f"Required model artifact missing: {path}"


def test_load_autoencoder_model():
    model_path = os.path.join(MODELS_DIR, "srp_autoencoder.pt")
    device = torch.device("cpu")
    model = load_autoencoder_model(model_path, device=device)

    assert isinstance(model, SRPAutoencoder)
    assert not model.training  # must be in eval mode

    # Verify forward pass with dummy batch of 6 features
    dummy_input = torch.randn(2, 6, device=device)
    output = model(dummy_input)
    assert output.shape == (2, 6)


def test_load_preprocessing_and_threshold_artifacts():
    scaler_path = os.path.join(MODELS_DIR, "scaler.pkl")
    prep_path = os.path.join(MODELS_DIR, "preprocessing.json")
    thresh_path = os.path.join(MODELS_DIR, "threshold.json")

    scaler, prep_config, thresh_config = load_preprocessing_artifacts(
        scaler_path, prep_path, thresh_path
    )

    assert hasattr(scaler, "transform")
    for feat in FEATURES:
        assert feat in prep_config
        assert "lower" in prep_config[feat]
        assert "upper" in prep_config[feat]
        assert prep_config[feat]["lower"] <= prep_config[feat]["upper"]

    assert "warning_threshold" in thresh_config
    assert "critical_threshold" in thresh_config
    assert thresh_config["warning_threshold"] < thresh_config["critical_threshold"]
