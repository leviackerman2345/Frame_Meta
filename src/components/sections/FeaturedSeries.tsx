import React from "react";
import { titlesContent } from "@/constants/titles";
import { getOnTheAirTVSeries } from "@/lib/tmdb";
import { MediaCard } from "@/components/ui/MediaCard";
import { SectionHeader } from "@/components/sections/SectionHeader";


export async function FeaturedSeries() {
  const series = await getOnTheAirTVSeries(10, true);

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12 relative z-20">
      <SectionHeader
        title={titlesContent.featuredSeries.heading.title}
        subtitle={titlesContent.featuredSeries.heading.subtitle}
      />

      <div className="flex gap-4 md:gap-5 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory px-px scroll-smooth scrollbar-hide">
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
