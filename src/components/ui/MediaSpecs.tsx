"use client";

import React from "react";

interface MediaSpecsProps {
  year?: string | number;
  voteAverage?: number;
  popularity?: number;
  genres?: string[] | { id: number; name: string }[];
  mediaType?: "movie" | "tv" | "collection";
  className?: string;
}

/**
 * A reusable component to display technical specifications (4K, HDR, Atmos, etc.)
 * for movies, series, and collections.
 * 
 * Logic is simulated based on metadata to provide a premium, high-fidelity UI
 * similar to Apple TV+ and Netflix.
 */
export function MediaSpecs({
  year,
  voteAverage = 0,
  popularity = 0,
  genres = [],
  mediaType = "movie",
  className = "",
}: MediaSpecsProps) {
  const releaseYear = typeof year === "string" ? parseInt(year) : year;
  
  // Extract genre names
  const genreNames = genres.map(g => typeof g === "string" ? g : g.name);

  // Logic to determine which specs to show
  const specs = [];

  // 1. 4K / UHD
  // Most movies after 2014 or very popular movies are 4K
  if (releaseYear && releaseYear >= 2014 || popularity > 50) {
    specs.push("4K");
  }

  // 2. HDR / Dolby Vision
  // HDR common after 2015
  if (releaseYear && releaseYear >= 2015) {
    if (voteAverage >= 7.5 || popularity > 100) {
      specs.push("DOLBY VISION");
    } else {
      specs.push("HDR10");
    }
  }

  // 3. Audio (Dolby Atmos / 5.1)
  // Atmos common in Action/Sci-Fi/Animation after 2012
  const isHighAction = genreNames.some(g => 
    ["Action", "Sci-Fi", "Animation", "Adventure", "Fantasy"].includes(g)
  );
  
  if (releaseYear && releaseYear >= 2012 && (isHighAction || popularity > 80)) {
    specs.push("DOLBY ATMOS");
  } else if (releaseYear && releaseYear >= 2000) {
    specs.push("5.1");
  }

  // 4. Accessibility (AD, SDH, CC)
  // Almost all modern content has these
  if (releaseYear && releaseYear >= 2010) {
    specs.push("AD");
    specs.push("SDH");
    specs.push("CC");
  }

  if (specs.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center justify-center md:justify-start gap-1.5 ${className}`}>
      {specs.map((spec) => (
        <span
          key={spec}
          className="px-1.5 py-0.5 text-[9px] md:text-[10px] font-black tracking-widest bg-zinc-900/80 border border-white/10 rounded-sm text-zinc-400 uppercase leading-none h-5 flex items-center"
        >
          {spec}
        </span>
      ))}
    </div>
  );
}
