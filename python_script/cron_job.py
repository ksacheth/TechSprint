from dotenv import load_dotenv
import os
import requests
import time
import logging

load_dotenv()  # Load variables from .env file

# NITK Beach Coordinates
NITK_LAT = 13.00971
NITK_LONG = 74.78874

# API Endpoints
PREDICT_URL = os.getenv('PREDICT_URL')
UPDATE_URL = os.getenv('UPDATE_URL')

def run_job():
    print(f"Starting job for NITK Beach ({NITK_LAT}, {NITK_LONG})...")

    # Get the data from predict URL
    try:
        payload = {"latitude": NITK_LAT, "longitude": NITK_LONG}
        response = requests.post(PREDICT_URL, json=payload)
        response.raise_for_status()
        
        prediction_data = response.json()
        print(f"Prediction received: {prediction_data['safety_level']}")
        
    except Exception as e:
        print(f"Error fetching prediction: {e}")
        return

    # Format the data for sending to Update URL
    m3_payload = {
        "riskLevel": prediction_data['safety_level'],
        "tideData": {
            "waveHeight": prediction_data.get('wave_height'),
            "wavePeriod": prediction_data.get('wave_period'),
            "currentVelocity": prediction_data.get('ocean_current_velocity')
        },
        "risk_factors": prediction_data['risk_factors'],
        "location" : {
            "latitude": prediction_data.get('latitude'),
            "longitude": prediction_data.get('longitude')
        },
        "weatherSummary": ", ".join(prediction_data.get('risk_factors', [])) or "Normal conditions"
    }

    # Push to Update URL
    try:
        update_response = requests.post(UPDATE_URL, json=m3_payload)
        update_response.raise_for_status()
        print("Data successfully pushed to Incident Management System")
    except Exception as e:
        print(f"Error updating dashboard: {e}")

if __name__ == "__main__":
    while True:
        run_job()
        time.sleep(360)