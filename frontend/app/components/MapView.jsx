"use client";

import React, { useState, useEffect, useRef } from "react";
import useAlerts from "../hooks/useAlerts";

const MapView = () => {
  const { alerts, setAlerts, loading } = useAlerts();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [layers, setLayers] = useState({
    showAssets: true,
    ripCurrentFlow: false,
  });

  const [zoom, setZoom] = useState(16);

  useEffect(() => {
    const initMap = async () => {
      const { Map } = await google.maps.importLibrary("maps");

      const mapOptions = {
        zoom: zoom,
        center: { lat: 13.0097, lng: 74.7887 }, // NITK Beach, Surathkal
        mapTypeId: "roadmap",
        gestureHandling: "greedy",
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
      };

      if (mapRef.current) {
        const newMap = new Map(mapRef.current, mapOptions);
        setMap(newMap);

        // Asset markers
        if (layers.showAssets && alerts) {
          alerts.forEach((alert) => {
            const lat = Number(alert.location?.Lat);
            const lng = Number(alert.location?.Long);
            if (Number.isFinite(lat) && Number.isFinite(lng)) {
              new google.maps.Marker({
                position: { lat, lng },
                map: newMap,
                title: alert.title || "Alert",
                icon: "",
              });
            } else {
              console.warn(
                "Skipping marker: invalid coords",
                alert.location,
                alert
              );
            }
          });
        }
      }
    };

    if (window.google?.maps) {
      initMap();
    }
  }, [layers, zoom]);

  const toggleLayer = (key) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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

      <div className="absolute top-4 right-4 z-10">
        <div className="bg-panel-light/90 backdrop-blur-sm border border-border-light rounded-lg p-2 shadow-lg flex flex-col gap-2 min-w-[140px]">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer hover:text-text-dark select-none">
            <input
              type="checkbox"
              checked={layers.showAssets}
              onChange={() => toggleLayer("showAssets")}
              className="rounded border-slate-300 bg-white text-primary focus:ring-primary h-3.5 w-3.5"
            />
            Show Assets
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer hover:text-text-dark select-none">
            <input
              type="checkbox"
              checked={layers.ripCurrentFlow}
              onChange={() => toggleLayer("ripCurrentFlow")}
              className="rounded border-slate-300 bg-white text-caution focus:ring-caution h-3.5 w-3.5"
            />
            Rip Current Flow
          </label>
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
