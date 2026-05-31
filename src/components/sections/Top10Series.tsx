import React from "react";
import { titlesContent } from "@/constants/titles";
import { getPopularTVSeries } from "@/lib/tmdb";
import { MediaCard } from "@/components/ui/MediaCard";
import { SectionHeader } from "@/components/sections/SectionHeader";

export async function Top10Series() {
  const series = await getPopularTVSeries(10, true);

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10 relative z-20">
      <SectionHeader
        title={titlesContent.top10Series.heading.title}
        subtitle={titlesContent.top10Series.heading.subtitle}
      />

      <div className="flex gap-4 md:gap-5 overflow-x-auto pb-6 custom-scrollbar snap-x snap-mandatory px-px scroll-smooth scrollbar-hide">
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
