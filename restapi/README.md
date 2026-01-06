# Beach Safety Prediction System

Simple website and API that classifies beach safety using **global safety standards** based on current marine weather data.

## Features

- **Simple Web Interface**: Enter latitude/longitude and get instant safety warnings
- Fetches current marine data from Open-Meteo API
- Classifies safety using **international standards** (Beaufort scale, coastal safety guidelines)
- Returns: **Safe**, **Caution**, or **Danger** with risk factors

## Global Safety Standards

### Wave Height (Significant Wave Height)
- **Safe**: < 0.5 meters
- **Caution**: 0.5 - 1.5 meters
- **Danger**: ≥ 1.5 meters

### Wave Period (Peak Wave Period)
- **Safe**: > 10 seconds (longer, gentler waves)
- **Caution**: 6 - 10 seconds
- **Danger**: < 6 seconds (short, choppy waves)

### Ocean Current Velocity
- **Safe**: < 0.5 km/h
- **Caution**: 0.5 - 1.0 km/h
- **Danger**: ≥ 1.0 km/h

## Installation

```bash
pip install -r requirements.txt
```

## Running

```bash
python main.py
```

Then open your browser:
- **Website**: http://localhost:8000 (Simple interface to check beach safety)
- **API Docs**: http://localhost:8000/docs

## Website Usage

1. Open http://localhost:8000 in your browser
2. Enter the latitude and longitude of the beach
3. Click "Check Beach Safety"
4. View the safety level and warnings

## API Usage

### POST `/api/v1/predict`
```json
{
  "latitude": 13.00971,
  "longitude": 74.78874
}
```

### GET `/api/v1/predict/{latitude}/{longitude}`

**Response:**
```json
{
  "safety_level": "Safe",
  "risk_factors": ["All conditions within safe ranges"],
  "latitude": 13.00971,
  "longitude": 74.78874,
  "wave_height": 0.42,
  "wave_period": 6.55,
  "ocean_current_velocity": 0.2
}
```

## Example

```python
import httpx

async def get_safety(lat, lon):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:8000/api/v1/predict",
            json={"latitude": lat, "longitude": lon}
        )
        return response.json()

result = await get_safety(13.00971, 74.78874)
print(f"Safety: {result['safety_level']}")
print(f"Risk Factors: {result['risk_factors']}")
```

## Safety Classification Logic

- **Danger**: Any parameter exceeds danger threshold
- **Caution**: Any parameter in caution range (but no danger)
- **Safe**: All parameters within safe ranges
