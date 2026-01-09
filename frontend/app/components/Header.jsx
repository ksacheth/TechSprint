"use client";

import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <header className="h-16 shrink-0 border-b border-border-light bg-white flex items-center justify-between px-6 z-20 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="size-8 text-primary bg-primary/10 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">radar</span>
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight leading-none text-text-dark">
            CoastGuard AI
          </h1>
          <p className="text-xs text-slate-500 font-mono">NITK Surathkal</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
