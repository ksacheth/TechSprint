import requests
import datetime


def send_incident_alert(swimmer_id, confidence, box):
    """
    Send a drowning incident alert to the local alerts endpoint.
    
    Parameters:
        swimmer_id: Identifier of the swimmer related to the incident.
        confidence (float): Detection confidence; will be rounded to two decimal places.
        box: Location bounding box or data describing the swimmer's position.
    
    Returns:
        int or str: HTTP response status code on success, or the string "Connection Failed" if the request could not be sent.
    """
    URL = "http://localhost:8080/alerts" 
    
    payload = {
        "incident_type": "DROWNING_DETECTION",
        "timestamp": datetime.datetime.now().isoformat(),
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