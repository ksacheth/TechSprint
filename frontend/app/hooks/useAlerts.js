import axios from "axios";
import { useEffect, useState } from "react";

export default function useAlerts() {
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const response = await axios.get(backendUrl + "/api/getAlerts");

        const transformedAlerts = response.data.map((alert) => {
          let alertTime;
          if (alert.timestamp?.seconds)
            alertTime = new Date(alert.timestamp.seconds * 1000);
          else if (typeof alert.timestamp === "number")
            alertTime = new Date(alert.timestamp);
          else if (alert.timestamp) alertTime = new Date(alert.timestamp);
          else alertTime = new Date();

          const time = alertTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });

          const confidence = alert.confidence || 0;
          const level =
            confidence > 0.9
              ? "CRITICAL"
              : confidence > 0.7
              ? "ACTIVE"
              : "ENV WARNING";

          return {
            id: alert.id,
            time,
            level,
            title: "Incident Detected",
            location: {
              Lat: alert.coordinates?.latitude ?? null,
              Long: alert.coordinates?.longitude ?? null,
            },
            confidence: (confidence * 100).toFixed(0),
          };
        });

        setAlerts(transformedAlerts);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
        setLoading(false);
      }
    }
    fetchAlerts();
  }, []);

  return { alerts, setAlerts, loading };
}
