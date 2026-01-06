"""
Fetch current marine data from Open-Meteo API
"""
import httpx
from typing import Dict, Optional
from config import settings


class MarineDataIngestionService:
    """Fetches current marine data"""
    
    def __init__(self):
        self.base_url = settings.MARINE_API_BASE_URL
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def fetch_current_data(self, latitude: float, longitude: float) -> Optional[Dict]:
        """Fetch current marine conditions"""
        try:
            params = {
                "latitude": latitude,
                "longitude": longitude,
                "current": "wave_height,wave_period,ocean_current_velocity",
                "models": "best_match",
                "timezone": "auto"
            }
            
            response = await self.client.get(self.base_url, params=params)
            response.raise_for_status()
            data = response.json()
            
            if "current" in data:
                return {
                    "wave_height": data["current"].get("wave_height"),
                    "wave_period": data["current"].get("wave_period"),
                    "ocean_current_velocity": data["current"].get("ocean_current_velocity"),
                }
            return None
            
        except Exception:
            return None
    
    async def close(self):
        """Close HTTP client"""
        await self.client.aclose()
