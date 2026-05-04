"use client";

import { Star } from "lucide-react";
import type { OMDbRating, TMDBTitleDetails } from "@/types/types";
import { MediaSpecs } from "./MediaSpecs";

interface MovieDetailsMetaProps {
  details: TMDBTitleDetails;
  year: string | number;
  runtimeStr: string;
  certification: string;
  rating: string | number;
  omdbRatings?: OMDbRating[];
}

export function MovieDetailsMeta({
  details,
  year,
  runtimeStr,
  certification,
  rating,
  omdbRatings = [],
}: MovieDetailsMetaProps) {

  return (
    <>
      {/* Metadata Row */}
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3 text-sm md:text-lg text-zinc-300/90 font-medium mb-5">
        {details.genres && details.genres.length > 0 && (
          <span className="text-white font-semibold">
            {details.genres[0].name}
          </span>
        )}
        <span className="opacity-40">•</span>
        <span>{year}</span>
        <span className="opacity-40">•</span>
        <span>{runtimeStr}</span>
        <span className="opacity-40">•</span>
        <span className="px-2 py-1 rounded bg-zinc-800/80 border border-zinc-700/50 text-xs font-bold tracking-wider uppercase">
          {certification}
        </span>
        <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-800/80 border border-zinc-700/50 text-white font-bold text-xs">
          <Star className="w-4 h-4 fill-white text-white" />
          {rating}
        </span>
      </div>

      {/* Tech Specs */}
      <MediaSpecs 
        year={year}
        popularity={details.popularity}
        voteAverage={details.vote_average}
        genres={details.genres}
        mediaType={details.title ? "movie" : "tv"}
      />
    </>
  );
}
