from ultralytics import YOLO


class VisionModule:
    
    # COCO dataset 0 is 'person'
    PERSON_ID = 0
    
    def __init__(self, model_path="models/yolov8n.pt"):
        """
        Initialize the VisionModule with a YOLO model loaded from the specified path.
        
        Parameters:
            model_path (str): Filesystem path or model identifier for the YOLO weights to load (default: "models/yolov8n.pt").
        """
        self.model = YOLO(model_path)

    def get_tracks(self, frame):
        """
        Return tracked person detections from a video frame.
        
        Processes the given image/frame with the module's tracker and returns only detections whose class corresponds to a person.
        
        Parameters:
            frame: Image or video frame to analyze (e.g., a NumPy array representing the frame).
        
        Returns:
            detections (list[dict]): A list of detection dictionaries. Each dictionary contains:
                - "id" (int): Tracking identifier for the object.
                - "box" (list[int]): Bounding box in [x1, y1, x2, y2] pixel coordinates.
                - "confidence" (float): Detection confidence score between 0 and 1.
        """
        results = self.model.track(frame, persist=True, conf=0.5, verbose=False)[0]
        
        detections = []
        
        if results.boxes.id is not None:
            classes = results.boxes.cls.int().cpu().tolist()
            boxes = results.boxes.xyxy.int().cpu().tolist()
            ids = results.boxes.id.int().cpu().tolist()
            confs = results.boxes.conf.float().cpu().tolist()
            
            for box, obj_id, conf, cls_id in zip(boxes, ids, confs, classes):
                if cls_id == self.PERSON_ID:
                    detections.append({
                        "id": obj_id,
                        "box": box,
                        "confidence": conf
                    })
        
        return detections