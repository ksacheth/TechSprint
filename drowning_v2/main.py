import cv2
from ultralytics import YOLO
import mediapipe as mp
import os
from api import send_alert

VIDEO_DIR = "videos"


def main():
    model = YOLO("yolov8n.pt")
    pose = mp.solutions.pose.Pose()
    draw = mp.solutions.drawing_utils

    videos = [
        os.path.join(VIDEO_DIR, v)
        for v in os.listdir(VIDEO_DIR)
        if v.endswith((".mp4", ".webm", ".avi"))
    ]

    if not videos:
        print("No videos found in videos/")
        return

    while True:  # LOOP FOREVER (camera simulation)
        for video in videos:
            video_name = os.path.basename(video)
            print(f"Playing {video_name}")

            cap = cv2.VideoCapture(video)

            still_counter = 0
            prev_center = None
            alerted = False

            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break

                results = model(frame, conf=0.4, verbose=False)[0]

                for box in results.boxes:
                    if int(box.cls.item()) != 0:
                        continue

                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    person_crop = frame[y1:y2, x1:x2]

                    if person_crop.size == 0:
                        continue

                    rgb = cv2.cvtColor(person_crop, cv2.COLOR_BGR2RGB)
                    pose_result = pose.process(rgb)

                    cy = (y1 + y2) // 2

                    if prev_center is not None:
                        movement = abs(cy - prev_center)
                    else:
                        movement = 0

                    prev_center = cy

                    if movement < 5:
                        still_counter += 1
                    else:
                        still_counter = max(0, still_counter - 2)

                    drowning = still_counter > 15
                    color = (0, 0, 255) if drowning else (0, 255, 0)

                    cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)

                    cv2.putText(
                        frame,
                        f"Stillness: {still_counter}",
                        (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.6,
                        color,
                        2
                    )

                    if drowning:
                        cv2.putText(
                            frame,
                            "DROWNING DETECTED",
                            (x1, y2 + 25),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            0.7,
                            (0, 0, 255),
                            2
                        )

                        if not alerted:
                            # Normalize confidence to 0-1 range (stillness > 15 = drowning)
                            confidence = min(still_counter / 20.0, 1.0)
                            send_alert(
                                frame=frame,
                                score=confidence,
                                video_name=video_name
                            )
                            alerted = True

                cv2.imshow("Drowning Detection", frame)
                if cv2.waitKey(30) & 0xFF == ord("q"):
                    cap.release()
                    cv2.destroyAllWindows()
                    return

            cap.release()

        print("Restarting all videos\n")


if __name__ == "__main__":
    main()
