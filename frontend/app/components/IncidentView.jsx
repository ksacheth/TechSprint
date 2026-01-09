"use client";

import React, { useState } from "react";
import Image from "next/image";
import useAlerts from "../hooks/useAlerts";

const IncidentView = () => {
  const [isOthersOpen, setIsOthersOpen] = useState(false);
  const { alerts, loading } = useAlerts();

  // Get the latest critical alert
  const latestIncident =
    alerts?.find((a) => a.level === "CRITICAL" && a.frame) || alerts?.[0];

  return (
    <>
      <div className="bg-panel-light rounded-xl border border-danger overflow-hidden shrink-0 shadow-lg shadow-danger/20 flex flex-col">
        <div className="p-4 border-b border-danger/20 flex justify-between items-center bg-danger/10">
          <h2 className="text-lg font-bold text-danger flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl">videocam</span>
            Current Incident View
          </h2>
          <span className="text-xs font-bold text-white bg-danger px-3 py-1 rounded-full animate-pulse">
            LIVE FEED
          </span>
        </div>
        <div className="aspect-video relative bg-slate-100 group">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-500">Loading feed...</p>
            </div>
          ) : latestIncident?.frame ? (
            <>
              <img
                className="w-full h-full object-cover opacity-80"
                alt="Live incident detection feed"
                src={`data:image/jpeg;base64,${latestIncident.frame}`}
                style={{ filter: "brightness(0.9)" }}
              />
              <div className="absolute top-[35%] left-[45%] w-[15%] h-[25%] border-2 border-danger shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-distress flex items-start justify-center">
                <div className="bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 -mt-4 uppercase tracking-tighter rounded">
                  {latestIncident.type} {latestIncident.confidence}%
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                <span className="text-[10px] font-mono text-danger font-bold bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
                  AI: DETECTED
                </span>
                <span className="text-[10px] font-mono text-slate-600 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
                  {latestIncident.time}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-500">No active incidents</p>
            </div>
          )}
        </div>
        <div className="p-4 bg-slate-50 border-t border-border-light text-slate-700 text-sm">
          <p>
            <span className="font-bold text-text-dark">
              {latestIncident?.type || "No Incident"}:
            </span>{" "}
            {latestIncident
              ? `Detected at ${latestIncident.time} with ${latestIncident.confidence}% confidence. Dispatch team immediately.`
              : "Monitoring active."}
          </p>
        </div>
      </div>
    </>
  );
};

export default IncidentView;
