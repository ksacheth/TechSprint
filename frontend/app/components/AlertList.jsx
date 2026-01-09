"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import "dotenv/config";
import useAlerts from "../hooks/useAlerts";

function AlertList() {
  const { alerts, setAlerts, loading } = useAlerts();

  const handleDismiss = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const getAlertStyles = (level) => {
    switch (level) {
      case "CRITICAL":
        return {
          bg: "bg-danger/5",
          border: "border-danger/20",
          badgeBg: "bg-danger",
          badgeText: "text-white",
          timeColor: "text-danger",
          hover: "hover:bg-danger/10",
          bar: "bg-danger",
        };
      case "ENV WARNING":
        return {
          bg: "bg-panel-light",
          border: "border-l-4 border-caution",
          badgeBg: "bg-caution/10",
          badgeText: "text-caution",
          timeColor: "text-caution",
          hover: "hover:bg-slate-50",
          bar: "",
        };
      case "ACTIVE":
        return {
          bg: "bg-panel-light",
          border: "border border-border-light",
          badgeBg: "bg-primary/10",
          badgeText: "text-primary",
          timeColor: "text-slate-500",
          hover: "hover:bg-slate-50",
          bar: "",
        };
      case "RESOLVED":
        return {
          bg: "bg-panel-light opacity-60",
          border: "border border-border-light",
          badgeBg: "bg-safe/10",
          badgeText: "text-safe",
          timeColor: "text-slate-500",
          hover: "hover:opacity-100",
          bar: "",
        };
      default:
        return {};
    }
  };

  return (
    <>
      <div className="p-4 border-b border-border-light flex justify-between items-center bg-slate-50">
        <h2 className="text-lg font-bold text-text-dark flex items-center gap-3">
          <span className="material-symbols-outlined text-danger text-2xl">
            notifications_active
          </span>
          Active Alerts
        </h2>
        <span className="bg-danger/10 text-danger text-sm font-bold px-3 py-1 rounded-full">
          {loading
            ? "..."
            : alerts.filter((a) => a.level === "CRITICAL").length}{" "}
          Critical
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3 rounded-b-2xl">
        {loading ? (
          <p className="text-center text-slate-500">Loading alerts...</p>
        ) : (
          alerts.map((alert) => {
            const styles = getAlertStyles(alert.level);
            return (
              <div
                key={alert.id}
                className={`${styles.bg} ${styles.border} rounded-lg p-4 group transition-colors cursor-pointer relative overflow-hidden shadow-sm ${styles.hover}`}
              >
                {alert.level === "CRITICAL" && ( <div className={`absolute top-0 left-0 w-1 h-full ${styles.bar}`} ></div>)}
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-mono font-bold ${styles.timeColor } ${ alert.level === "CRITICAL" ? "bg-danger/10 px-2 py-0.5 rounded" : "" }`}>
                    {alert.time}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-sm ${styles.badgeBg} ${styles.badgeText} ${alert.level === "CRITICAL" ? "animate-pulse" : ""}`}>
                    {alert.level}
                  </span>
                </div>

                <h3 className={`font-bold text-base leading-tight mb-2 ${ alert.level === "RESOLVED" ? "text-slate-600 font-medium" : "text-text-dark"}`}>
                  {alert.title}
                </h3>
                <p className={`text-sm mb-3 ${ alert.level === "RESOLVED" ? "text-slate-500" : "text-slate-600" }`}>
                  {/* {`Lat: ${alert.location.Lat} Long: ${alert.location.Long}`} */}
                  {`. Confidence: ${alert.confidence}%`}
                </p>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

export default AlertList;
