"""
Risk classification based on global beach safety standards
"""
from typing import Dict, List, Tuple
from enum import Enum
from config import settings


class SafetyLevel(str, Enum):
    """Beach safety levels"""
    SAFE = "Safe"
    CAUTION = "Caution"
    DANGER = "Danger"


class RiskClassifier:
    """Classifies beach safety using global standards"""
    
    def classify_from_dict(self, data: Dict) -> Tuple[SafetyLevel, List[str]]:
        """
        Classify beach safety from environmental data
        
        Returns:
            Tuple of (safety_level, risk_factors)
        """
        wave_height = data.get("wave_height")
        wave_period = data.get("wave_period")
        ocean_current_velocity = data.get("ocean_current_velocity")
        
        risk_factors = []
        danger_count = 0
        caution_count = 0
        
        # Wave Height (Global Standard: <0.5m Safe, 0.5-1.5m Caution, ≥1.5m Danger)
        if wave_height is not None:
            if wave_height >= settings.WAVE_HEIGHT_DANGER_MIN:
                danger_count += 1
                risk_factors.append(f"High wave height: {wave_height:.2f}m (≥{settings.WAVE_HEIGHT_DANGER_MIN}m)")
            elif wave_height >= settings.WAVE_HEIGHT_CAUTION_MIN:
                caution_count += 1
                risk_factors.append(f"Moderate wave height: {wave_height:.2f}m")
        
        # Wave Period (Global Standard: >10s Safe, 6-10s Caution, <6s Danger)
        if wave_period is not None:
            if wave_period < settings.WAVE_PERIOD_DANGER_MAX:
                danger_count += 1
                risk_factors.append(f"Short wave period: {wave_period:.2f}s (<{settings.WAVE_PERIOD_DANGER_MAX}s)")
            elif wave_period < settings.WAVE_PERIOD_SAFE_MIN:
                caution_count += 1
                risk_factors.append(f"Moderate wave period: {wave_period:.2f}s")
        
        # Ocean Current (Global Standard: <0.5 km/h Safe, 0.5-1.0 km/h Caution, ≥1.0 km/h Danger)
        if ocean_current_velocity is not None:
            if ocean_current_velocity >= settings.CURRENT_VELOCITY_DANGER_MIN:
                danger_count += 1
                risk_factors.append(f"Strong current: {ocean_current_velocity:.2f} km/h (≥{settings.CURRENT_VELOCITY_DANGER_MIN} km/h)")
            elif ocean_current_velocity >= settings.CURRENT_VELOCITY_CAUTION_MIN:
                caution_count += 1
                risk_factors.append(f"Moderate current: {ocean_current_velocity:.2f} km/h")
        
        # Determine safety level
        if danger_count > 0:
            return SafetyLevel.DANGER, risk_factors
        elif caution_count > 0:
            return SafetyLevel.CAUTION, risk_factors
        else:
            if not risk_factors:
                risk_factors.append("All conditions within safe ranges")
            return SafetyLevel.SAFE, risk_factors
