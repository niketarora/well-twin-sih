"""
SRP Autoencoder PyTorch Architecture & Model Loader.
Faithfully mirrors the trained model from SRP_Model_Handoff.
"""
import os
from typing import Optional
import torch
import torch.nn as nn


class SRPAutoencoder(nn.Module):
    """
    Sucker Rod Pump Condition Monitoring Autoencoder.
    
    Reconstructs 6 normalized operational features:
    [SPM, pump_fillage, min_rod_weight, max_rod_weight, dynamometer_area, rod_load_range]
    
    Mean Squared Error (MSE) between input and reconstruction is the anomaly score.
    """
    def __init__(self, input_dim: int = 6):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, 32),
            nn.ReLU(),
            nn.Linear(32, 16),
            nn.ReLU(),
            nn.Linear(16, 8)
        )
        self.decoder = nn.Sequential(
            nn.Linear(8, 16),
            nn.ReLU(),
            nn.Linear(16, 32),
            nn.ReLU(),
            nn.Linear(32, input_dim)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.decoder(self.encoder(x))


def load_autoencoder_model(model_path: str, device: Optional[torch.device] = None) -> SRPAutoencoder:
    """
    Loads the trained autoencoder state dict safely onto CPU/GPU in evaluation mode.
    """
    if device is None:
        device = torch.device("cpu")

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"SRP Autoencoder model weights not found at: {model_path}")

    model = SRPAutoencoder(input_dim=6).to(device)
    state_dict = torch.load(model_path, map_location=device, weights_only=True)
    model.load_state_dict(state_dict)
    model.eval()
    return model
