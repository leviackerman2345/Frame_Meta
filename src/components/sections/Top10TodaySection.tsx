"use client";

import { useState } from "react";
import { MediaCard } from "@/components/ui/MediaCard";
import { SectionHeader } from "@/components/sections/SectionHeader";
import type { MovieCard } from "@/types/types";

interface Top10TodaySectionProps {
  globalItems: MovieCard[];
  localItems: MovieCard[];
  localLabel: string;
  contentType?: "films" | "series";
}

export function Top10TodaySection({
  globalItems,
  localItems,
  localLabel,
  contentType = "films",
}: Top10TodaySectionProps) {
  const [activeTab, setActiveTab] = useState<"local" | "global">("local");
  const items = activeTab === "global" ? globalItems : localItems;
  const laneLabel = activeTab === "global" ? "Global" : `Local · ${localLabel}`;
  const term = contentType === "series" ? "shows" : "films";
  const laneSubtitle =
    activeTab === "global"
      ? `The ${term} drawing the widest attention today.`
      : `The ${term} most relevant to viewers in ${localLabel}.`;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-12 py-10 relative z-20">
      <SectionHeader
        title="Top 10 today"
        subtitle="Switch between the worldwide chart and your local ranking."
        layout="split"
        action={
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setActiveTab("global")}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                activeTab === "global"
                  ? "bg-white text-black"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Global
            </button>
            <button
              onClick={() => setActiveTab("local")}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                activeTab === "local"
                  ? "bg-white text-black"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Local
            </button>
          </div>
        }
      />

      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.22em] text-white/30">
            {laneLabel}
          </p>
          <p className="mt-1 text-sm text-white/55">{laneSubtitle}</p>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 custom-scrollbar snap-x snap-mandatory px-1 scroll-smooth scrollbar-hide">
          {items.map((item) => (
            <MediaCard key={item.id} data={item} variant="slider" />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-8 text-sm text-white/45">
          No titles match the current filters.
        </div>
      )}
    </section>
  );
}

