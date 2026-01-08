"use client";

import React, { useState } from "react";
import Image from "next/image";

const IncidentView = () => {
  const [isOthersOpen, setIsOthersOpen] = useState(false);

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
          <Image
            className="w-full h-full object-cover opacity-80"
            alt="Ocean waves with a swimmer in distress struggling against the current"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQAWn-Q8bBMFwkOuF8JpK07amvbxxqtLB5T0jcDQYAk0mArlJnC4c4AdEonbOtR8Lt5FSrOnVWE2w03ZWGW-gTAIE2_uGATMfjVgonHW8Q4GC-ZrIojRVzOQAlyQrhuFk9VttWRfVEQ83nYO8hSJOOBjQTOXAd1WONc-E7QVEIBjnIa6yOvjiCPGox02Rn4lRse2PLyV85j0o6ygcU0Rg2XEYYqCrvl4OHmtSq-czvdjb9bQL5mukJbA0maj1cwfeSzBAQa8pTqZkw"
            style={{ filter: "brightness(0.9)" }}
            fill
          />
          <div className="absolute top-[35%] left-[45%] w-[15%] h-[25%] border-2 border-danger shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-distress flex items-start justify-center">
            <div className="bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 -mt-4 uppercase tracking-tighter rounded">
              Distress 98%
            </div>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex justify-between">
            <span className="text-[10px] font-mono text-danger font-bold bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
              AI: DETECTED
            </span>
            <span className="text-[10px] font-mono text-slate-600 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
              FPS: 30
            </span>
          </div>
        </div>
        <div className="p-4 bg-slate-50 border-t border-border-light text-slate-700 text-sm">
          <p>
            <span className="font-bold text-text-dark">Tower 4:</span> Swimmer
            in distress, high probability. Dispatch team immediately.
          </p>
        </div>
      </div>
    </>
  );
};

export default IncidentView;
