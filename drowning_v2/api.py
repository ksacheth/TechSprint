import requests
import datetime
import cv2
import base64
import os
from dotenv import load_dotenv

load_dotenv()

BACKEND_URL = os.getenv('BACKEND_URL', 'http://localhost:3001') + "/api/reportIncident"

def send_alert(frame, score, video_name):
    # Resize frame to reduce size (max width 640px)
    """
    Send a drowning incident alert containing a compressed image frame and metadata to the configured backend.
    
    The function resizes the provided image to a maximum width of 640 pixels (preserving aspect ratio) and encodes it as a JPEG with quality 50, then base64-encodes the image and POSTs a JSON payload to BACKEND_URL containing: type "DROWNING", a UTC ISO timestamp, the confidence score, the video name, and the encoded frame. On successful HTTP response it prints "ALERT SENT"; on network or HTTP errors it prints a failure message.
    
    Parameters:
        frame (numpy.ndarray): Image frame in BGR or RGB format as an array.
        score (float): Confidence score for the detected incident.
        video_name (str): Identifier or name of the source video.
    """
    height, width = frame.shape[:2]
    if width > 640:
        scale = 640 / width
        new_width = 640
        new_height = int(height * scale)
        frame = cv2.resize(frame, (new_width, new_height))
    
    # Compress JPEG with lower quality
    _, buffer = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 50])
    img_b64 = base64.b64encode(buffer).decode()

    payload = {
        "type": "DROWNING",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "confidence": score,
        "video": video_name,
        "frame": img_b64
    }

    try:
        response = requests.post(
            BACKEND_URL,
            json=payload,
            timeout=5
        )
        response.raise_for_status()
        print("ALERT SENT")
    except requests.exceptions.RequestException as e:
        print(f"Failed to send alert: {e}")