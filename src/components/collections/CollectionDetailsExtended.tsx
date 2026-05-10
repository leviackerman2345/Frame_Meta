"use client";

import Image from "next/image";
import { Sparkles, Plus, Star, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { MediaCard } from "@/components/ui/MediaCard";
import { CastSection } from "@/components/sections/CastSection";
import { MediaSpecs } from "@/components/ui/MediaSpecs";
import { RelatedNewsSection } from "@/components/sections/RelatedNewsSection";
import type { CollectionData } from "@/types/types";

interface CollectionDetailsExtendedProps {
  data: CollectionData;
}

export function CollectionDetailsExtended({ data }: CollectionDetailsExtendedProps) {
  const { title, overview, backdropUrl, parts, rating, yearSpan, genres } = data;
  const router = useRouter();

  return (
    <div className="flex flex-col bg-black min-h-screen">
      {/* 1st Section: Hero (Matched to Movie Modal Hero Design) */}
      <div className="relative w-full overflow-hidden min-h-screen md:min-h-screen flex flex-col">
        {/* Close Button - Matched to Movie Modal position */}
        <button
          onClick={() => router.back()}
          className="absolute top-6 right-6 z-40 flex items-center justify-center w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white transition-all duration-300 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image Section */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image
            src={backdropUrl || ""}
            alt={title}
            fill
            className="object-cover object-center contrast-[1.1] saturate-[1.1]"
            sizes="100vw"
            unoptimized
            priority
          />
          {/* Sleek minimalist dark overlay for Apple-like depth and readability */}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
        </div>

        {/* Content Section */}
        <div className="relative z-30 flex flex-col justify-end items-center text-center md:items-start md:text-left flex-1 p-6 sm:p-10 md:p-16 lg:p-24 w-full min-h-screen md:min-h-screen">
          {/* Title */}
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight subpixel-antialiased drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] text-white mb-8 md:mb-10">
            {title}
          </h2>


          {/* Action Buttons */}
          <div className="flex flex-nowrap items-center justify-center md:justify-start gap-2 sm:gap-4 w-full md:w-auto mb-10 md:mb-12">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-8 py-3 md:py-3.5 rounded-full bg-white text-black hover:bg-zinc-200 font-bold text-xs sm:text-sm md:text-lg shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
              Watch Collection
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-8 py-3 md:py-3.5 rounded-full bg-zinc-800/60 backdrop-blur-md border border-white/10 hover:bg-zinc-700/60 text-white font-semibold text-xs sm:text-sm md:text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap">
              <Plus className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
              My Wish List
            </button>
          </div>

          {/* Tech Specs */}
          <MediaSpecs 
            year={yearSpan?.split("-")[0].trim() || parts[0]?.year}
            popularity={Math.max(...parts.map(p => p.popularity || 0))}
            voteAverage={Number(rating)}
            genres={genres}
            mediaType="collection"
          />
        </div>
      </div>

      {/* 2nd Section: Body (Matched to Movie Modal Extended Body Design) */}
      <div className="relative z-30 w-full px-6 sm:px-10 md:px-16 lg:px-24 py-20 md:py-28 flex flex-col gap-16 md:gap-24">
        {/* Background Image with Glassmorphism */}
        {backdropUrl && (
          <div className="absolute inset-0 z-[-1] pointer-events-none">
            <div className="sticky top-0 w-full h-dvh">
              <Image
                src={backdropUrl}
                alt={title || "Background"}
                fill
                className="object-cover brightness-75 contrast-[1.1] saturate-[1.1]"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/15 backdrop-blur-3xl" />
            </div>
          </div>
        )}

        {/* Collection Title */}
        <h4 className="text-3xl md:text-5xl font-black tracking-tight text-white text-center">
          {title}
        </h4>

        {/* Synopsis Section */}
        <div className="max-w-306 text-left w-full mx-auto flex flex-col gap-4">
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Synopsis
          </h3>
          <p className="text-zinc-200 text-base md:text-lg leading-relaxed font-medium">
            {overview || "No overview available."}
          </p>
        </div>

        {/* Metadata Grid (Matched to Movie Modal Design) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-5 max-w-306 text-left w-full mx-auto">
          {/* Left Metadata Column */}
          <div className="flex flex-col gap-4">
            <div className="text-sm md:text-base">
              <span className="text-white font-bold">Items: </span>
              <span className="text-zinc-200 font-medium">{parts.length}</span>
            </div>
            <div className="text-sm md:text-base">
              <span className="text-white font-bold">Average Rating: </span>
              <span className="text-zinc-200 font-medium">{Math.round(Number(rating) * 10)}%</span>
            </div>
            {yearSpan && (
              <div className="text-sm md:text-base">
                <span className="text-white font-bold">Active Years: </span>
                <span className="text-zinc-200 font-medium">{yearSpan}</span>
              </div>
            )}
          </div>

          {/* Right Metadata Column */}
          <div className="flex flex-col gap-4">
            <div className="text-sm md:text-base">
              <span className="text-white font-bold">Total Runtime: </span>
              <span className="text-zinc-200 font-medium">{data.totalRuntime}</span>
            </div>
            <div className="text-sm md:text-base">
              <span className="text-white font-bold">Total Revenue: </span>
              <span className="text-zinc-200 font-medium">{data.totalRevenue}</span>
            </div>
            {genres.length > 0 && (
              <div className="text-sm md:text-base">
                <span className="text-white font-bold">Genres: </span>
                <span className="text-zinc-200 font-medium">{genres.join(" • ")}</span>
              </div>
            )}
          </div>
        </div>

        {/* Titles Grid (Matched to Movie Modal "Episode Guide" Style) */}
        {parts.length > 0 && (
          <div className="max-w-306 w-full mx-auto flex flex-col gap-8 text-left">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
                Titles in Collection
              </h3>
              <p className="text-zinc-200 text-sm md:text-base font-medium">
                Explore all {parts.length} entries in chronological order
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10">
              {parts.map((item, idx) => (
                <div key={item.id} className="w-full">
                  <MediaCard
                    data={{
                      ...item,
                      badge: item.badge || `${idx + 1} OF ${parts.length}`,
                      rank: idx + 1
                    }}
                    container="grid"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coming Soon Section */}
        {data.comingSoon && data.comingSoon.length > 0 && (
          <div className="max-w-306 w-full mx-auto flex flex-col gap-8 text-left">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
                Coming Soon
              </h3>
              <p className="text-zinc-200 text-sm md:text-base font-medium">
                Anticipated future releases coming to this universe
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10">
              {data.comingSoon.map((item) => (
                <div key={item.id} className="w-full">
                  <MediaCard data={item} glow={true} container="grid" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cast Section (Reusable Component) */}
        {data.cast && data.cast.length > 0 && (
          <CastSection
            title="Leading Performances"
            subtitle="Discover the iconic actors who star throughout this multi-film collection"
            cast={data.cast}
          />
        )}

        {/* Crew Section (Reusable Component) */}
        {data.crew && data.crew.length > 0 && (
          <CastSection
            title="Behind the Camera"
            subtitle="The directors, writers, and producers who masterminded this cinematic universe"
            cast={data.crew as any}
          />
        )}

        {/* Related News Section */}
        <RelatedNewsSection 
          query={title} 
          title={`Latest News: ${title}`}
          description={`Stay informed with the latest updates and editorial features about the ${title}.`}
        />
      </div>
    </div>
  );
}
