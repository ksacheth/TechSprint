import requests
import datetime
import cv2
import base64


def send_alert(frame, score, video_name):
    _, buffer = cv2.imencode(".jpg", frame)
    img_b64 = base64.b64encode(buffer).decode()

    payload = {
        "type": "DROWNING",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "confidence": score,
        "video": video_name,
        "frame": img_b64
    }

    try:
        requests.post(
            "http://localhost:8080/alerts",
            json=payload,
            timeout=1
        )
        print("ALERT SENT")
    except requests.exceptions.RequestException:
        print("Failed to send alert")
