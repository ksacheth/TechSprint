import axios from "axios";
import { useEffect, useState } from "react";

/**
 * Provides transformed alert data fetched from the backend along with a setter and loading state.
 *
 * @returns {Object} An object containing alert state and loading status.
 * @property {Array<Object>|null} alerts - Array of transformed alerts or `null` if none loaded. Each alert object contains:
 *   - {string|number} id
 *   - {string} time - Formatted local time (en-US, 2-digit hour and minute).
 *   - {string} level - One of `"CRITICAL"`, `"ACTIVE"`, or `"ENV WARNING"`.
 *   - {string} title - Fixed string `"Incident Detected"`.
 *   - {string} confidence - Confidence as a percentage string (e.g., `"85"`).
 *   - {string|null} frame - Frame data or `null`.
 *   - {string} type - Alert type (defaults to `"DROWNING"` when absent).
 * @property {function} setAlerts - Setter to replace the `alerts` array.
 * @property {boolean} loading - `true` while alerts are being fetched, `false` afterwards.
 */
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
            confidence > 0.7
              ? "CRITICAL"
              : confidence > 0.6
              ? "ACTIVE"
              : "ENV WARNING";

          return {
            id: alert.id,
            time,
            level,
            title: "Incident Detected",
            // location: {
            //   Lat: alert.coordinates?.latitude ?? null,
            //   Long: alert.coordinates?.longitude ?? null,
            // },
            confidence: (confidence * 100).toFixed(0),
            frame: alert.frame || null,
            type: alert.type || "DROWNING",
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