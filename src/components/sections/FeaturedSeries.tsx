import React from "react";
import { featuredSeriesHeading } from "@/constants/titles";
import { getOnTheAirTVSeries } from "@/lib/tmdb";
import { MediaCard } from "@/components/ui/MediaCard";
import { SectionHeader } from "@/components/sections/SectionHeader";


export async function FeaturedSeries() {
  const series = await getOnTheAirTVSeries(10, true);

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10 relative z-20">
      <SectionHeader
        title={featuredSeriesHeading.title}
        subtitle={featuredSeriesHeading.subtitle}
      />

      <div className="flex gap-5 md:gap-6 overflow-x-auto pb-6 custom-scrollbar snap-x px-1 scroll-smooth">
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
