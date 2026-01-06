"""
Configuration with global beach safety standards
Based on international guidelines (Beaufort scale, coastal safety standards)
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings with global safety thresholds"""
    
    # API Configuration
    API_TITLE: str = "Beach Safety Prediction API"
    API_VERSION: str = "1.0.0"
    API_DESCRIPTION: str = "Beach safety classification based on global standards"
    
    # Open-Meteo API
    MARINE_API_BASE_URL: str = "https://marine-api.open-meteo.com/v1/marine"
    
    # Global Safety Thresholds (based on international standards)
    # Wave Height (Significant Wave Height) - meters
    WAVE_HEIGHT_SAFE_MAX: float = 0.5      # Safe: < 0.5m
    WAVE_HEIGHT_CAUTION_MIN: float = 0.5    # Caution: 0.5m - 1.5m
    WAVE_HEIGHT_DANGER_MIN: float = 1.5     # Danger: ≥ 1.5m
    
    # Wave Period (Peak Wave Period) - seconds
    # Shorter periods = steeper, choppier waves (more dangerous)
    WAVE_PERIOD_SAFE_MIN: float = 10.0     # Safe: > 10s
    WAVE_PERIOD_CAUTION_MIN: float = 6.0    # Caution: 6s - 10s
    WAVE_PERIOD_DANGER_MAX: float = 6.0     # Danger: < 6s
    
    # Ocean Current Velocity - km/h
    # Based on rip current and general swimming safety standards
    CURRENT_VELOCITY_SAFE_MAX: float = 0.5     # Safe: < 0.5 km/h
    CURRENT_VELOCITY_CAUTION_MIN: float = 0.5   # Caution: 0.5 - 1.0 km/h
    CURRENT_VELOCITY_DANGER_MIN: float = 1.0   # Danger: ≥ 1.0 km/h
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
