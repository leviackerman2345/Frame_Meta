import React from "react";
import { featuredSeriesHeading } from "@/config/site-content";
import { getOnTheAirTVSeries } from "@/lib/tmdb";
import { MediaCard } from "@/components/ui/MediaCard";


export async function FeaturedSeries() {
  const series = await getOnTheAirTVSeries(10);

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10 relative z-20">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white tracking-tight drop-shadow-sm">
          {featuredSeriesHeading.title}
        </h2>
        {featuredSeriesHeading.subtitle && (
          <p className="text-sm text-zinc-400/90 mt-1.5 font-medium">{featuredSeriesHeading.subtitle}</p>
        )}
      </div>

      <div className="flex gap-5 md:gap-6 overflow-x-auto pb-6 custom-scrollbar snap-x">
        {series.map((item) => (
          <MediaCard
            key={item.id}
            data={item}
            variant="slider"
          />
        ))}
      </div>
    </section>
  );
}
