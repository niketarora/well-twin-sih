"""
SRP Feature Builder and Unit Conversion Adapter.
Builds the 6-feature input vector for the autoencoder from raw telemetry and dynamometer loops.
"""
from typing import List, Dict, Any, Optional, Sequence


# Physical conversion constants
KN_TO_LBF = 224.8089431149797   # 1 kN = 224.809 lbf
KJ_TO_FT_LBF = 737.562149       # 1 kJ (m * kN) = 737.562 ft*lbf
M_TO_INCH = 39.3700787          # 1 meter = 39.3701 inches


def calculate_dyno_area_shoelace(points: Sequence[Sequence[float]]) -> float:
    """
    Calculates the enclosed area of a closed dynamometer loop using the Shoelace formula:
    Area = 0.5 * |sum_{i=0}^{n-1} (x_i * y_{i+1} - x_{i+1} * y_i)|
    """
    if not points or len(points) < 3:
        return 0.0

    n = len(points)
    area_sum = 0.0
    for i in range(n):
        x_i, y_i = points[i][0], points[i][1]
        x_next, y_next = points[(i + 1) % n][0], points[(i + 1) % n][1]
        area_sum += (x_i * y_next) - (x_next * y_i)

    return 0.5 * abs(area_sum)


def convert_metric_srp_to_field_units(
    min_rod_weight: float,
    max_rod_weight: float,
    dynamometer_area: float,
    units_already_field: bool = False
) -> Dict[str, float]:
    """
    Converts metric surface measurements (kN, m*kN/kJ) into oilfield units (lbf, ft*lbf)
    expected by the trained autoencoder.
    
    If units_already_field is True or if numerical values already match lbf scale (> 500),
    they are passed directly.
    """
    if units_already_field:
        return {
            "min_rod_weight": min_rod_weight,
            "max_rod_weight": max_rod_weight,
            "dynamometer_area": dynamometer_area,
        }

    # Detect if rod loads are in kN (typical SRP rod loads in kN are 10 - 150 kN)
    # vs lbf (typical SRP rod loads in lbf are 2,000 - 30,000 lbf)
    converted_min = min_rod_weight * KN_TO_LBF if min_rod_weight < 500.0 else min_rod_weight
    converted_max = max_rod_weight * KN_TO_LBF if max_rod_weight < 500.0 else max_rod_weight

    # Detect if dyno area is in kJ (m * kN, typically 10 - 500 kJ)
    # vs ft*lbf (typically 5,000 - 350,000 ft*lbf)
    converted_area = dynamometer_area * KJ_TO_FT_LBF if dynamometer_area < 1000.0 else dynamometer_area

    return {
        "min_rod_weight": converted_min,
        "max_rod_weight": converted_max,
        "dynamometer_area": converted_area,
    }


def build_srp_features(
    spm: float,
    pump_fillage: float,
    min_rod_weight: float,
    max_rod_weight: float,
    dynamometer_area: Optional[float] = None,
    dyno_surface_points: Optional[List[List[float]]] = None,
    is_metric: bool = True
) -> Dict[str, float]:
    """
    Constructs the canonical 6-feature dictionary in exact order:
    ['SPM', 'pump_fillage', 'min_rod_weight', 'max_rod_weight', 'dynamometer_area', 'rod_load_range']
    
    If dynamometer_area is not provided directly, it is computed from dyno_surface_points.
    """
    if dynamometer_area is None:
        if dyno_surface_points:
            raw_area = calculate_dyno_area_shoelace(dyno_surface_points)
        else:
            raw_area = 0.0
    else:
        raw_area = dynamometer_area

    if is_metric:
        converted = convert_metric_srp_to_field_units(
            min_rod_weight=min_rod_weight,
            max_rod_weight=max_rod_weight,
            dynamometer_area=raw_area,
            units_already_field=False
        )
        final_min = converted["min_rod_weight"]
        final_max = converted["max_rod_weight"]
        final_area = converted["dynamometer_area"]
    else:
        final_min = min_rod_weight
        final_max = max_rod_weight
        final_area = raw_area

    rod_load_range = max(0.0, final_max - final_min)

    return {
        "SPM": float(spm),
        "pump_fillage": float(pump_fillage),
        "min_rod_weight": float(final_min),
        "max_rod_weight": float(final_max),
        "dynamometer_area": float(final_area),
        "rod_load_range": float(rod_load_range),
    }
