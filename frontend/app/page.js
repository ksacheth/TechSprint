"use client";

import React, { useState } from "react";
import Header from "./components/Header";
import StatusBar from "./components/StatusBar";
import AlertList from "./components/AlertList";
import MapView from "./components/MapView";
import IncidentView from "./components/IncidentView";

/**
 * Render the client-side Home dashboard with a header, status bar, and a responsive three-column layout showing Alerts, Map, and Incident Feeds.
 *
 * The header is given and can update the internal `activeTab` state (initially "Mission Control"); the main grid places AlertList in the left panel, MapView in the center, and IncidentView in the right panel.
 *
 * @returns {JSX.Element} The Home page element.
 */
export default function Home() {
  const [activeTab, setActiveTab] = useState("Mission Control");

  return (
    <>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <StatusBar />
      <main className="flex-1 p-4 overflow-hidden mb-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
          {/* Left Panel: Alerts */}
          <section className="lg:col-span-3 bg-panel-light rounded-xl border border-border-light flex flex-col overflow-hidden shadow-sm h-full">
            <AlertList />
          </section>

          {/* Center Panel: Map */}
          <section className="lg:col-span-6 flex flex-col h-full relative group">
            <MapView />
          </section>

          {/* Right Panel: Incident Feeds */}
          <section className="lg:col-span-3 flex flex-col gap-4 h-full">
            <IncidentView />
          </section>
        </div>
      </main>
    </>
  );
}