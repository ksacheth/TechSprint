"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const StatusBar = () => {
  const [time, setTime] = useState("");
  const [weather, setWeather] = useState({
    riskLevel: "NA",
    tideHeight: "NA",
    tideDirection: "NA",
    windSpeed: "NA",
    windDirection: "NA",
    uvIndex: "NA",
  });

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const updateTime = () => setTime(formatter.format(new Date()));

    updateTime(); // set immediately on mount
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    /**
     * Fetches current weather and tide data from the backend and updates the component's weather state.
     *
     * Updates the `weather` state with received values and uses `"NA"` or `"N/A"` fallbacks when fields are missing. Any fetch errors are caught and logged to the console.
     */
    async function getWeather() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const response = await axios.get(backendUrl + "/api/getWeather");

        if (response.data) {
          const data = response.data;

          setWeather({
            riskLevel: data.riskLevel || "NA",
            tideHeight: data.tideData.waveHeight
              ? `${data.tideData.waveHeight}ft`
              : "N/A",
            tideDirection: data.tideData.direction || "N/A",
            windSpeed: data.tideData.currentVelocity
              ? `${data.tideData.currentVelocity}kn`
              : "N/A",
            windDirection: data.weatherSummary.windDirection || "N/A",
            uvIndex: data.weatherSummary.uvIndex || "N/A",
          });
        }
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      }
    }

    getWeather();
  }, []);

  return (
    <div className="shrink-0 h-20 bg-panel-light border-b border-border-light flex items-stretch px-6 divide-x divide-border-light shadow-lg z-10 overflow-x-auto rounded-2xl mx-3">
      <div className="flex items-center gap-4 pr-8 py-2 min-w-max rounded-2xl">
        <div className="flex flex-col ">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
            Global Risk Level
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="material-symbols-outlined text-caution text-2xl">
              warning
            </span>
            <span className="text-2xl font-bold text-caution tracking-tight">
              {weather.riskLevel}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 px-6 py-2 min-w-max rounded-2xl">
        <span className="material-symbols-outlined text-primary text-2xl">
          water
        </span>
        <div>
          <span className="text-[11px] uppercase text-slate-500 font-semibold block">
            Tide Height
          </span>
          <span className="font-mono text-lg font-medium text-text-dark">
            {weather.tideHeight}{" "}
            <span className="text-slate-500 ml-1 text-sm">
              ({weather.tideDirection})
            </span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 px-6 py-2 min-w-max rounded-2xl">
        <span className="material-symbols-outlined text-primary text-2xl">
          air
        </span>
        <div>
          <span className="text-[11px] uppercase text-slate-500 font-semibold block">
            Wind Speed
          </span>
          <span className="font-mono text-lg font-medium text-text-dark">
            {weather.windSpeed}{" "}
            <span className="text-slate-500 ml-1 text-sm">
              {weather.windDirection}
            </span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 px-6 py-2 min-w-max rounded-2xl">
        <span className="material-symbols-outlined text-primary text-2xl">
          wb_sunny
        </span>
        <div>
          <span className="text-[11px] uppercase text-slate-500 font-semibold block">
            UV Index
          </span>
          <span className="font-mono text-lg font-medium text-text-dark">
            {weather.uvIndex}{" "}
            <span className="text-caution ml-1 text-sm">(High)</span>
          </span>
        </div>
      </div>
      <div className="flex-1 hidden md:block"></div>
      <div className="flex items-center pl-6 py-2 min-w-max">
        <span className="font-mono text-3xl font-bold text-text-dark tracking-widest tabular-nums">
          {time}
        </span>
        <span className="ml-2 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
          IST (UTC+5:30)
        </span>
      </div>
    </div>
  );
};

export default StatusBar;