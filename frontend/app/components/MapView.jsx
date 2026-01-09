"use client";

import React, { useState, useEffect, useRef } from "react";
import useAlerts from "../hooks/useAlerts";

const MapView = () => {
  const { alerts, setAlerts, loading } = useAlerts();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [mapsReady, setMapsReady] = useState(false);
  const [zoom, setZoom] = useState(16);

  useEffect(() => {
    const checkReady = setInterval(() => {
      if (window.google?.maps?.importLibrary) {
        setMapsReady(true);
        clearInterval(checkReady);
      }
    }, 300);
    return () => clearInterval(checkReady);
  }, []);

  useEffect(() => {
    const initMap = async () => {
      if (!mapsReady || !mapRef.current) return;

      const { Map } = await google.maps.importLibrary("maps");
      const { Marker } = await google.maps.importLibrary("marker");

      const mapOptions = {
        zoom: zoom,
        center: { lat: 13.0097, lng: 74.7887 }, // NITK Beach, Surathkal
        mapTypeId: "roadmap",
        gestureHandling: "greedy",
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
      };

      const newMap = map || new Map(mapRef.current, mapOptions);
      if (!map) {
        setMap(newMap);
      } else {
        // apply latest zoom to existing map instance
        newMap.setZoom(zoom);
      }

      // Asset markers
      if (alerts) {
        alerts.forEach((alert) => {
          const lat = Number(alert.location?.Lat);
          const lng = Number(alert.location?.Long);
          if (Number.isFinite(lat) && Number.isFinite(lng)) {
            new Marker({
              position: { lat, lng },
              map: newMap,
              title: alert.title || "Alert",
              icon: "",
            });
          } else {
            console.warn("Skipping marker: invalid coords", alert.location, alert);
          }
        });
      }
    };

    initMap();
  }, [mapsReady, zoom, alerts, map]);

  const handleZoom = (direction) => {
    setZoom((prev) => {
      if (direction === "in") return Math.min(prev + 1, 22);
      return Math.max(prev - 1, 0);
    });
  };

  return (
    <div className="flex-1 bg-slate-100 rounded-xl border border-border-light overflow-hidden relative shadow-sm flex flex-col">
      {/* Map Container */}
      <div
        ref={mapRef}
        className="flex-1 w-full h-full"
        style={{ minHeight: "400px" }}
      />

      {/* Controls */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
        <div className="bg-panel-light/90 backdrop-blur-sm border border-border-light rounded-lg p-1 shadow-lg flex flex-col">
          <button
            onClick={() => handleZoom("in")}
            className="p-2 hover:bg-slate-100 rounded text-slate-700 active:bg-slate-200"
            title="Zoom In"
          >
            <span className="material-symbols-outlined text-lg">add</span>
          </button>
          <button
            onClick={() => handleZoom("out")}
            className="p-2 hover:bg-slate-100 rounded text-slate-700 active:bg-slate-200"
            title="Zoom Out"
          >
            <span className="material-symbols-outlined text-lg">remove</span>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-10 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-sm rounded px-3 py-1.5 text-xs text-slate-300 font-mono border border-white/20">
         {`LAT: 13.0097  N • LNG: 74.7887  E`}
        </div>
      </div>
    </div>
  );
};

export default MapView;
