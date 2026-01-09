import requests
import datetime


def send_incident_alert(swimmer_id, confidence, box):
    URL = "http://localhost:8080/alerts" 
    
    payload = {
        "incident_type": "DROWNING_DETECTION",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),,
        "swimmer_id": swimmer_id,
        "confidence": round(confidence, 2),
        "location_data": {"box": box},
        "status": "URGENT"
    }

    try:
        response = requests.post(URL, json=payload, timeout=1)
        return response.status_code
    except:
        return "Connection Failed"
