"""
SRP Predictor Service Singleton.
Loads model weights, scaler, and threshold metadata once on startup,
serving high-throughput, low-latency inferences.
"""
import os
from typing import Dict, Any, Optional
import torch

from .model import SRPAutoencoder, load_autoencoder_model
from .preprocessing import load_preprocessing_artifacts, preprocess_features, FEATURES
from .feature_builder import build_srp_features

MODEL_VERSION = "srp-autoencoder-v1"


class SRPPredictor:
    """
    Cached predictor service for SRP condition monitoring.
    """
    def __init__(
        self,
        model_dir: Optional[str] = None,
        device: Optional[torch.device] = None
    ):
        if model_dir is None:
            # Default to standard ml/srp/models relative to this file
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            model_dir = os.path.join(base_dir, "models")

        self.model_dir = model_dir
        self.device = device or torch.device("cpu")

        model_path = os.path.join(model_dir, "srp_autoencoder.pt")
        scaler_path = os.path.join(model_dir, "scaler.pkl")
        preprocess_path = os.path.join(model_dir, "preprocessing.json")
        threshold_path = os.path.join(model_dir, "threshold.json")

        self.model: SRPAutoencoder = load_autoencoder_model(model_path, self.device)
        self.scaler, self.preprocessing_config, self.threshold_config = load_preprocessing_artifacts(
            scaler_path=scaler_path,
            preprocessing_path=preprocess_path,
            threshold_path=threshold_path
        )

        self.warning_threshold: float = float(self.threshold_config["warning_threshold"])
        self.critical_threshold: float = float(self.threshold_config["critical_threshold"])
        self.model_version: str = MODEL_VERSION

    def predict(
        self,
        features: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Runs autoencoder reconstruction inference on the provided feature dictionary.
        Returns condition, score, thresholds, and any clipping warnings.
        """
        tensor, warnings = preprocess_features(
            feature_dict=features,
            scaler=self.scaler,
            preprocessing_config=self.preprocessing_config,
            device=self.device
        )

        with torch.no_grad():
            reconstructed = self.model(tensor)
            mse_score = torch.mean((tensor - reconstructed) ** 2, dim=1).item()

        if mse_score >= self.critical_threshold:
            condition = "CRITICAL"
        elif mse_score >= self.warning_threshold:
            condition = "WARNING"
        else:
            condition = "NORMAL"

        return {
            "condition": condition,
            "anomaly_score": round(mse_score, 6),
            "warning_threshold": round(self.warning_threshold, 6),
            "critical_threshold": round(self.critical_threshold, 6),
            "model_version": self.model_version,
            "inputs": {k: round(features[k], 2) if isinstance(features[k], float) else features[k] for k in FEATURES},
            "warnings": warnings,
            "is_healthy": condition == "NORMAL",
        }


_GLOBAL_PREDICTOR: Optional[SRPPredictor] = None


def get_srp_predictor() -> SRPPredictor:
    """
    Returns the singleton SRPPredictor instance, initializing it if necessary.
    """
    global _GLOBAL_PREDICTOR
    if _GLOBAL_PREDICTOR is None:
        _GLOBAL_PREDICTOR = SRPPredictor()
    return _GLOBAL_PREDICTOR
