import React from "react";
import Link from "next/link";
import { titlesContent } from "@/constants/titles";
import { getAsianSpotlight } from "@/lib/tmdb";
import { MediaCard } from "@/components/ui/MediaCard";
import { SectionHeader } from "@/components/sections/SectionHeader";


interface Props {
  searchParams?: Promise<{ country?: string }>;
}

export async function AsianSpotlight({ searchParams }: Props) {
  const params = await searchParams;
  const { countries, heading } = titlesContent.asianSpotlight;
  const defaultCountry = countries[0]?.code || "KR";
  const country =
    (params?.country as (typeof countries)[number]["code"]) ||
    defaultCountry;
  const movies = await getAsianSpotlight(country, 10, true);

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10 relative z-20">
      <SectionHeader
        title={heading.title}
        subtitle={heading.subtitle}
        layout="split"
        action={(
          <div className="flex items-center bg-zinc-800/40 p-1 rounded-full border border-white/5 backdrop-blur-xl">
            {countries.map(({ code, label }) => (
              <Link
                key={code}
                href={`/?country=${code}`}
                scroll={false}
                className={`px-4 py-1.5 text-xs font-medium transition-all duration-300 rounded-full ${
                  country === code
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-zinc-400 hover:text-white/80"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      />

      <div className="flex gap-4 md:gap-5 overflow-x-auto pb-6 custom-scrollbar snap-x snap-mandatory px-px scroll-smooth scrollbar-hide">
        {movies.map((movie) => (
          <MediaCard
            key={movie.id}
            data={movie}
            variant="slider"
          />
        ))}
      </div>
    </section>
  );
}
