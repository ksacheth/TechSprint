from ultralytics import YOLO


class VisionModule:
    
    # COCO dataset 0 is 'person'
    PERSON_ID = 0
    
    def __init__(self, model_path="models/yolov8n.pt"):
        self.model = YOLO(model_path)

    def get_tracks(self, frame):
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