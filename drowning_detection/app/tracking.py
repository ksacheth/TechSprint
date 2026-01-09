import math
import time
from collections import deque


class TrackingModule:
    def __init__(self, frames_to_watch=30, sensitivity=0.3):
        self.history = {}
        self.distress_counters = {}
        self.last_seen_pos = {}
        self.frames_to_watch = frames_to_watch 
        self.sensitivity = sensitivity

    def check_distress(self, swimmer_id, current_box):
        x1, y1, x2, y2 = current_box
        box_width = x2 - x1
        cx, cy = (x1 + x2) // 2, (y1 + y2) // 2

        if swimmer_id not in self.history:
            for old_id, (old_x, old_y, last_time) in list(self.last_seen_pos.items()):
                dist_from_vanished = math.sqrt((cx - old_x)**2 + (cy - old_y)**2)
                if dist_from_vanished < 50 and (time.time() - last_time) < 4.0:
                    self.history[swimmer_id] = self.history[old_id]
                    self.distress_counters[swimmer_id] = self.distress_counters.get(old_id, 0)
                    del self.last_seen_pos[old_id]
                    break

        if swimmer_id not in self.history:
            self.history[swimmer_id] = deque(maxlen=self.frames_to_watch)
            self.distress_counters[swimmer_id] = 0
        
        self.history[swimmer_id].append((cx, cy))
        self.last_seen_pos[swimmer_id] = (cx, cy, time.time())

        dist = 0
        if len(self.history[swimmer_id]) == self.frames_to_watch:
            start_pos = self.history[swimmer_id][0]
            dist = math.sqrt((cx - start_pos[0])**2 + (cy - start_pos[1])**2)
            
            threshold = box_width * self.sensitivity
            
            if dist < threshold:
                self.distress_counters[swimmer_id] += 1
            else:
                self.distress_counters[swimmer_id] = max(0, self.distress_counters[swimmer_id] - 2)

        is_drowning = self.distress_counters[swimmer_id] > 20
        return is_drowning, self.distress_counters[swimmer_id], dist