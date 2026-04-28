import React from "react";
import Link from "next/link";
import { asianSpotlightHeading } from "@/config/site-content";
import { getAsianSpotlight } from "@/lib/tmdb";
import { MediaCard } from "@/components/ui/MediaCard";


interface Props {
  searchParams?: Promise<{ country?: string }>;
}

export async function AsianSpotlight({ searchParams }: Props) {
  const params = await searchParams;
  const country = (params?.country as "KR" | "JP" | "CN" | "TH") || "KR";
  const movies = await getAsianSpotlight(country, 10);

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10 relative z-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-5">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight drop-shadow-sm">
            {asianSpotlightHeading.title}
          </h2>
          {asianSpotlightHeading.subtitle && (
            <p className="text-sm text-zinc-400/90 mt-1.5 font-medium">{asianSpotlightHeading.subtitle}</p>
          )}
        </div>

        {/* Clean, Apple-style Pill Selector (Server-Side Tabs) */}
        <div className="flex items-center bg-zinc-800/40 p-1 rounded-full border border-white/5 backdrop-blur-xl">
          {(["KR", "JP", "CN", "TH"] as const).map((code) => {
            const labels: Record<string, string> = { KR: "Korean", JP: "Japanese", CN: "Chinese", TH: "Thai" };
            return (
              <Link
                key={code}
                href={`/?country=${code}`}
                scroll={false}
                className={`px-4 py-1.5 text-xs font-medium transition-all duration-300 rounded-full ${country === code ? "bg-white/15 text-white shadow-sm" : "text-zinc-400 hover:text-white/80"
                  }`}
              >
                {labels[code]}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex gap-5 md:gap-6 overflow-x-auto pb-6 custom-scrollbar snap-x">
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
