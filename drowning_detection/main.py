import cv2
from app.vision import VisionModule
from app.tracking import TrackingModule
from app.api import send_incident_alert
import os

def main():
    vision = VisionModule()
    # tracker = TrackingModule(frames_to_watch=50, stillness_threshold=10)
    tracker = TrackingModule(frames_to_watch=50)
    
    video = os.path.join("sample_vids", "drowning.webm")
    cap = cv2.VideoCapture(video)
    # cap = cv2.VideoCapture(0)
    alerted_ids = set() 

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret: break

        # 1. Get detections from Vision
        swimmers = vision.get_tracks(frame)

        for s in swimmers:
            # Now check_distress returns 3 values
            is_distressed, score, d = tracker.check_distress(s['id'], s['box'])
            
            color = (0, 255, 0)
            if is_distressed:
                send_incident_alert(s['id'], s['confidence'], s['box'])
                color = (0, 0, 255)
            
            x1, y1, x2, y2 = s['box']
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            
            # DEBUG TEXT: See the ID, the score, and the distance moved
            debug_label = f"ID:{s['id']} Score:{score} Dist:{int(d)}"
            cv2.putText(frame, debug_label, (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.4, color, 1)

        cv2.imshow("Beach Monitor", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'): break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
