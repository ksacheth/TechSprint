"""
Simple API schemas
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from app.models.risk_classifier import SafetyLevel


class BeachSafetyRequest(BaseModel):
    """Request model for beach safety prediction"""
    latitude: float = Field(..., ge=-90, le=90, description="Latitude")
    longitude: float = Field(..., ge=-180, le=180, description="Longitude")


class BeachSafetyResponse(BaseModel):
    """Response model for beach safety prediction"""
    safety_level: SafetyLevel
    risk_factors: List[str]
    latitude: float
    longitude: float
    wave_height: Optional[float] = None
    wave_period: Optional[float] = None
    ocean_current_velocity: Optional[float] = None
