"""
Simple API routes for beach safety prediction
"""
from fastapi import APIRouter, HTTPException
from app.api.schemas import BeachSafetyRequest, BeachSafetyResponse
from app.services.data_ingestion import MarineDataIngestionService
from app.models.risk_classifier import RiskClassifier

router = APIRouter()
classifier = RiskClassifier()
data_service = MarineDataIngestionService()


@router.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Beach Safety Prediction API"}


@router.post("/predict", response_model=BeachSafetyResponse, tags=["Prediction"])
async def predict_beach_safety(request: BeachSafetyRequest):
    """
    Get current beach safety prediction for a location
    
    Fetches current data from Open-Meteo API and classifies safety level
    """
    try:
        # Fetch current marine data
        marine_data = await data_service.fetch_current_data(
            request.latitude,
            request.longitude
        )
        
        if not marine_data:
            raise HTTPException(
                status_code=503,
                detail="Unable to fetch marine data from external API"
            )
        
        # Classify safety level
        safety_level, risk_factors = classifier.classify_from_dict(marine_data)
        
        return BeachSafetyResponse(
            safety_level=safety_level,
            risk_factors=risk_factors,
            latitude=request.latitude,
            longitude=request.longitude,
            wave_height=marine_data.get("wave_height"),
            wave_period=marine_data.get("wave_period"),
            ocean_current_velocity=marine_data.get("ocean_current_velocity")
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")


@router.get("/predict/{latitude}/{longitude}", response_model=BeachSafetyResponse, tags=["Prediction"])
async def predict_beach_safety_get(latitude: float, longitude: float):
    """
    Get current beach safety prediction (GET method)
    """
    request = BeachSafetyRequest(latitude=latitude, longitude=longitude)
    return await predict_beach_safety(request)
