import React from "react";
import { platformOptions } from "@/constants/home";

export function PlatformControls() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-6 pb-8 relative z-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-white/10 pt-6 gap-5">
        
        {/* Clean, Apple-style Pill Selector for Platforms */}
        <div className="flex items-center bg-zinc-800/40 p-1 rounded-full border border-white/5 backdrop-blur-xl overflow-x-auto custom-scrollbar">
          {platformOptions.map((platform, idx) => (
            <button
              key={platform}
              className={`px-4 py-1.5 text-xs font-medium transition-all duration-300 rounded-full whitespace-nowrap ${
                idx === 0 ? "bg-white/15 text-white shadow-sm" : "text-zinc-400 hover:text-white/80"
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
