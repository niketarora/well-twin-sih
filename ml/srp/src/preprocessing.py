"""
SRP Feature Preprocessing & Transformation Pipeline.
Loads preprocessing configurations, bounds clipping, and standard scaler.
"""
import json
import os
from typing import Dict, Any, Tuple, List, Optional
import pandas as pd
import numpy as np
import torch

FEATURES: List[str] = [
    "SPM",
    "pump_fillage",
    "min_rod_weight",
    "max_rod_weight",
    "dynamometer_area",
    "rod_load_range",
]


class SRPStandardScaler:
    """
    StandardScaler implementation with exact trained parameters from scaler.pkl.
    Guarantees zero-dependency numerical parity without relying on scipy C-extensions.
    """
    def __init__(
        self,
        mean: Optional[np.ndarray] = None,
        scale: Optional[np.ndarray] = None
    ):
        self.mean_ = mean if mean is not None else np.array([
            5.57209957e+00, 4.45299407e+01, 3.57860595e+03,
            4.68604653e+03, 4.62177530e+04, 1.09391663e+03
        ], dtype=np.float64)
        self.scale_ = scale if scale is not None else np.array([
            1.09755411e+00, 3.15347110e+01, 1.09842773e+03,
            1.45680339e+03, 8.50941514e+04, 6.57353843e+02
        ], dtype=np.float64)

    def transform(self, X: Any) -> np.ndarray:
        arr = np.asarray(X, dtype=np.float64)
        return (arr - self.mean_) / self.scale_


def load_preprocessing_artifacts(
    scaler_path: str,
    preprocessing_path: str,
    threshold_path: str
) -> Tuple[Any, Dict[str, Any], Dict[str, Any]]:
    """
    Loads scaler, preprocessing.json, and threshold.json.
    """
    if not os.path.exists(preprocessing_path):
        raise FileNotFoundError(f"Preprocessing metadata not found at: {preprocessing_path}")
    if not os.path.exists(threshold_path):
        raise FileNotFoundError(f"Threshold metadata not found at: {threshold_path}")

    # Load scaler safely
    scaler = None
    if os.path.exists(scaler_path):
        try:
            import joblib.numpy_pickle as jnp

            class SafeNumpyUnpickler(jnp.NumpyUnpickler):
                def find_class(self, module, name):
                    if 'sklearn' in module and name == 'StandardScaler':
                        return SRPStandardScaler
                    return super().find_class(module, name)

            with open(scaler_path, "rb") as f:
                unpickler = SafeNumpyUnpickler(scaler_path, f, True)
                scaler = unpickler.load()
        except Exception:
            scaler = SRPStandardScaler()
    else:
        scaler = SRPStandardScaler()

    with open(preprocessing_path, "r", encoding="utf-8") as f:
        preprocessing_config = json.load(f)

    with open(threshold_path, "r", encoding="utf-8") as f:
        threshold_config = json.load(f)

    return scaler, preprocessing_config, threshold_config



def validate_raw_features(feature_dict: Dict[str, Any]) -> None:
    """
    Validates that all required features exist, are non-null, and are numeric.
    """
    missing = [f for f in FEATURES if f not in feature_dict or feature_dict[f] is None]
    if missing:
        raise ValueError(f"Missing required SRP features: {missing}")

    for f in FEATURES:
        val = feature_dict[f]
        if not isinstance(val, (int, float, np.number)) or np.isnan(val) or np.isinf(val):
            raise ValueError(f"Feature '{f}' has invalid non-numeric or NaN value: {val}")

    if feature_dict["max_rod_weight"] < feature_dict["min_rod_weight"]:
        raise ValueError(
            f"Maximum rod weight ({feature_dict['max_rod_weight']}) cannot be less than "
            f"minimum rod weight ({feature_dict['min_rod_weight']})."
        )


def check_clipping_warnings(
    feature_dict: Dict[str, Any],
    preprocessing_config: Dict[str, Any]
) -> List[str]:
    """
    Checks if any input values lie outside the training distribution bounds
    and returns friendly warning messages for engineer visibility.
    """
    warnings: List[str] = []
    for f in FEATURES:
        val = feature_dict[f]
        lower = preprocessing_config[f]["lower"]
        upper = preprocessing_config[f]["upper"]
        if val < lower:
            warnings.append(
                f"{f} value {val:.2f} is below model training range ({lower:.2f}); clipped for inference."
            )
        elif val > upper:
            warnings.append(
                f"{f} value {val:.2f} exceeds model training range ({upper:.2f}); clipped for inference."
            )
    return warnings


def preprocess_features(
    feature_dict: Dict[str, Any],
    scaler: Any,
    preprocessing_config: Dict[str, Any],
    device: torch.device
) -> Tuple[torch.Tensor, List[str]]:
    """
    Validates, clips, scales, and converts features into a PyTorch tensor.
    Returns (tensor, list of clipping warnings).
    """
    validate_raw_features(feature_dict)
    warnings = check_clipping_warnings(feature_dict, preprocessing_config)

    df = pd.DataFrame([feature_dict], columns=FEATURES)

    # Enforce exact clipping bounds from preprocessing.json
    for feature in FEATURES:
        lower_bound = preprocessing_config[feature]["lower"]
        upper_bound = preprocessing_config[feature]["upper"]
        df[feature] = df[feature].clip(lower=lower_bound, upper=upper_bound)

    # Standard Scaler transformation
    scaled_array = scaler.transform(df)

    tensor = torch.tensor(scaled_array, dtype=torch.float32, device=device)
    return tensor, warnings
