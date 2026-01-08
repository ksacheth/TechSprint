"use client";

import Image from "next/image";
import React from "react";

const Header = ({ activeTab, setActiveTab }) => {
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
      <nav className="flex items-center gap-6">
        <div className="h-6 w-px bg-slate-300"></div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-slate-500 hover:text-text-dark transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-1.5 size-2 bg-danger rounded-full border-2 border-white"></span>
          </button>
          <div className="flex items-center gap-2 pl-2">
            <div className="size-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
              <Image
                width={32}
                height={32}
                alt="User Avatar"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYJ3uooY_M4tpXEx5df2okUPm2nD40SdxuMmSy9vaRha__FBNtxEk9Qtx1QSXCRTpvGUMJDo0zoSeJyeS5hKE5oGKlBANhiMTUxvRjRFh8dUGH8bTYZukl12IWXUAO1aGxOVrRVQ6BuoghgO4tSaFSRkuNNiCckhiZ4sm1U5b2qBwQcecr0biXDFqnInJZK7-QjKWO9njOGW3DyB1cWwp77vOxkMhpkwE2-FNXMFLKNUGlylVYmgbCa29rJoEifvYxPrq7UHsZ6zFv"
              />
            </div>
            <div className="hidden lg:block text-xs text-left">
              <div className="font-medium text-text-dark">Ops Commander</div>
              <div className="text-slate-500">Online</div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
