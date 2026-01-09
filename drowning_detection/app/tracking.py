import math
import time
from collections import deque


class TrackingModule:
    def __init__(self, frames_to_watch=30, sensitivity=0.3):
        """
        Initialize tracking state for drowning/distress detection.
        
        Sets up per-swimmer storage and configuration used to monitor movement over a sliding window of frames.
        
        Parameters:
            frames_to_watch (int): Number of recent frames to retain per swimmer for movement history (window size).
            sensitivity (float): Multiplier applied to a swimmer's bounding-box width to compute the movement threshold.
        """
        self.history = {}
        self.distress_counters = {}
        self.last_seen_pos = {}
        self.frames_to_watch = frames_to_watch 
        self.sensitivity = sensitivity

    def check_distress(self, swimmer_id, current_box):
        """
        Assess whether a tracked swimmer is potentially drowning based on recent movement and update tracking state.
        
        Updates per-swimmer position history and distress counters, attempts to re-associate recent vanished tracks with the provided swimmer_id when appropriate, and determines drowning state from the accumulated distress counter.
        
        Parameters:
            swimmer_id: Identifier for the swimmer being tracked (e.g., int or str).
            current_box (tuple): Bounding box as (x1, y1, x2, y2) in image coordinates.
        
        Returns:
            tuple:
                is_drowning (bool): `true` if the swimmer's distress counter exceeds the drowning threshold, `false` otherwise.
                distress_counter (int): Current distress counter for the swimmer after this update.
                dist (float): Euclidean distance between the current center and the position recorded frames_to_watch frames ago; 0 if insufficient history.
        """
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