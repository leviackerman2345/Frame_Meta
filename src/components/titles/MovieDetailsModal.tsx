"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { MovieDetailsHero } from "./MovieDetailsHero";
import { MovieDetailsMeta } from "./MovieDetailsMeta";
import { MovieDetailsExtended } from "./MovieDetailsExtended";
import { getTMDBImageUrl } from "@/lib/tmdb";
import { getProviderLink, getCategoryLabel, getCategoryColor } from "@/lib/provider-links";
import type {
  MovieCard,
  OMDbRating,
  TMDBCastMember,
  TMDBCrewMember,
  TMDBProvider,
  TMDBReview,
  TMDBTitleDetails,
  TMDBEpisode,
} from "@/types/types";

interface MovieDetailsModalProps {
  isModal?: boolean;
  type?: "movie" | "tv";
  details: TMDBTitleDetails;
  logoUrl: string | null;
  backdropUrl: string;
  rating: string | number;
  year: string | number;
  runtimeStr: string;
  certification: string;
  providers: TMDBProvider[];
  cast: TMDBCastMember[];
  crew?: TMDBCrewMember[];
  watchLink?: string;
  inCinema?: boolean;
  recommendations?: MovieCard[];
  omdbRatings?: OMDbRating[];
  reviews?: TMDBReview[];
}

export function MovieDetailsModal({
  isModal = true,
  type = "movie",
  details,
  logoUrl,
  backdropUrl,
  rating,
  year,
  runtimeStr,
  certification,
  providers,
  cast,
  crew = [],
  watchLink,
  inCinema,
  recommendations,
  omdbRatings = [],
  reviews = [],
}: MovieDetailsModalProps) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<TMDBEpisode | null>(null);

  // Close on ESC key and trap focus only when in modal mode
  useEffect(() => {
    if (!isModal) return;
    lastActiveElementRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.back();
      }

      if (e.key === "Tab" && overlayRef.current) {
        const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
        );

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, isModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (!isModal) return;
    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");
    return () => {
      document.body.style.overflow = "unset";
      document.body.classList.remove("modal-open");
      lastActiveElementRef.current?.focus();
    };
  }, [isModal]);

  const handleDismiss = (e: React.MouseEvent) => {
    if (!isModal) return;
    if (e.target === overlayRef.current) {
      router.back();
    }
  };

  const renderEpisodeModal = () => {
    if (!selectedEpisode) return null;
    return createPortal(
      <div 
        onClick={() => setSelectedEpisode(null)}
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12 cursor-pointer"
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-2xl w-full bg-zinc-950/60 backdrop-blur-3xl border border-white/[0.08] rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh] cursor-default"
        >
          {/* Close Button */}
          <button 
            onClick={() => setSelectedEpisode(null)}
            className="absolute top-5 right-5 z-30 w-9 h-9 rounded-full bg-zinc-950/50 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-zinc-950/80 transition-all duration-300 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Row 1: Visual + Overlaid Text */}
          <div className="relative w-full aspect-video overflow-hidden">
            {selectedEpisode.still_path ? (
              <Image
                src={getTMDBImageUrl(selectedEpisode.still_path, "original")}
                alt={selectedEpisode.name || "Episode"}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white/40 bg-zinc-900">
                No Preview Available
              </div>
            )}
            
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10 pointer-events-none" />

            {/* Overlaid Content (Title & Specs) */}
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 z-20 flex flex-col gap-3.5 text-left">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-intent-cyan uppercase tracking-widest">
                  Episode {selectedEpisode.episode_number}
                </span>
                <h3 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
                  {selectedEpisode.name || `Episode ${selectedEpisode.episode_number}`}
                </h3>
              </div>

              {/* Tech Specs & Rating */}
              <div className="flex items-center gap-2 flex-wrap">
                {selectedEpisode.vote_average !== undefined && selectedEpisode.vote_average > 0 && (
                  <div className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-xl border border-white/10 text-xs font-semibold text-white">
                    ★ {selectedEpisode.vote_average.toFixed(1)}
                  </div>
                )}
                <div className="px-3 py-1 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] text-[10px] font-bold text-white/80 uppercase tracking-widest">
                  4K UHD
                </div>
                <div className="px-3 py-1 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] text-[10px] font-bold text-white/80 uppercase tracking-widest">
                  HDR
                </div>
                <div className="px-3 py-1 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] text-[10px] font-bold text-white/80 uppercase tracking-widest">
                  Atmos
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Text & Providers */}
          <div className="p-8 md:p-10 flex flex-col gap-6 text-left overflow-y-auto bg-zinc-950/30">
            {/* Plot */}
            {selectedEpisode.overview && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                  Description
                </span>
                <p className="text-white/80 text-sm md:text-base leading-relaxed font-normal">
                  {selectedEpisode.overview}
                </p>
              </div>
            )}

            {/* Where to Watch */}
            {providers && providers.length > 0 && (
              <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-white/[0.06]">
                <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                  Available to Stream
                </span>
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                  {providers.map((provider) => {
                    const providerLogo = provider.logo_path
                      ? `https://image.tmdb.org/t/p/w92${provider.logo_path}`
                      : null;
                    const providerUrl = getProviderLink(provider, details.id, type);
                    const categoryLabel = getCategoryLabel(provider.category);
                    const categoryColor = getCategoryColor(provider.category);
                    return (
                      <a
                        key={provider.provider_id}
                        href={providerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`${provider.provider_name} — ${categoryLabel}`}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex-shrink-0 hover:bg-white/[0.08] transition-colors duration-300"
                      >
                        {providerLogo && (
                          <div className="relative w-5 h-5 rounded-md overflow-hidden shadow-sm">
                            <Image src={providerLogo} alt={provider.provider_name || "Provider"} fill className="object-cover" unoptimized />
                          </div>
                        )}
                        <span className="text-white/90 text-xs font-medium">
                          {provider.provider_name}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium border ${categoryColor}`}>
                          {categoryLabel}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>,
      document.body
    );
  };

  if (!isModal) {
    const titleText = details.title || details.name || "Title";
    const genresList = details.genres?.map((g) => g.name).slice(0, 2).join(", ");
    const metaInfo = [year, genresList, rating ? `${rating}/10` : undefined]
      .filter(Boolean)
      .join(" • ");

    return (
      <main className="w-full min-h-screen flex flex-col bg-black text-white relative z-10">
        <div className="h-24" /> {/* Spacer below the floating liquid-glass Navbar */}
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full flex flex-col bg-black"
        >
          {/* Widescreen Boxed Hero Card - 1:1 Match to Homepage Hero Layout */}
          <section className="w-full max-w-7xl mx-auto px-4 md:px-12 pt-8 md:pt-10 pb-6">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 shadow-2xl">
              
              {/* Background Backdrop Image */}
              <div className="absolute inset-0">
                <Image
                  src={backdropUrl}
                  alt={titleText}
                  fill
                  className="object-cover object-center contrast-[1.05] saturate-[1.15]"
                  sizes="(max-width: 1024px) 100vw, 1200px"
                  priority
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/35" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
              </div>

              {/* Grid content wrapper */}
              <div className="relative z-10 grid gap-8 lg:grid-cols-[1.12fr_0.88fr] p-6 md:p-10 lg:p-12 min-h-[460px]">
                
                {/* Left Column details */}
                <div className="flex flex-col justify-end gap-4 max-w-2xl text-left">
                  
                  {/* Eyebrow badge */}
                  <span className="inline-flex w-max items-center rounded-full border border-cyan-300/40 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                    Feature Presentation
                  </span>
                  
                  {/* Title / Logo */}
                  {logoUrl ? (
                    <div className="relative w-[90%] max-w-100 h-20 md:h-28">
                      <Image
                        src={logoUrl}
                        alt={titleText}
                        fill
                        className="object-contain object-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-md">
                      {titleText}
                    </h1>
                  )}

                  {/* Metadata */}
                  {metaInfo && <p className="text-sm md:text-base text-zinc-200/90 font-medium">{metaInfo}</p>}

                  {/* Synopsis */}
                  {details.overview && (
                    <p className="max-w-xl text-xs md:text-sm leading-relaxed text-zinc-200/85 font-medium line-clamp-3">
                      {details.overview}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-1">
                    {watchLink ? (
                      <Link
                        href={watchLink}
                        target="_blank"
                        className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-xs md:text-sm font-extrabold text-black transition hover:bg-zinc-200 active:scale-95 shadow-lg gap-2"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><polygon points="8 5 19 12 8 19 8 5"/></svg>
                        Watch Now
                      </Link>
                    ) : (
                      <button
                        onClick={() => alert("Title is not currently streaming.")}
                        className="inline-flex items-center justify-center rounded-full bg-white/15 px-6 py-3 text-xs md:text-sm font-extrabold text-white transition hover:bg-white/25 active:scale-95 backdrop-blur-md gap-2"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><polygon points="8 5 19 12 8 19 8 5"/></svg>
                        Watch Now
                      </button>
                    )}

                    <button
                      onClick={() => {
                        const trailerSec = document.getElementById("trailers-section");
                        if (trailerSec) {
                          trailerSec.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          alert("Trailer is not available");
                        }
                      }}
                      className="inline-flex items-center justify-center rounded-full border border-white/25 bg-black/35 px-6 py-3 text-xs md:text-sm font-bold text-white transition hover:border-white/50 hover:bg-black/55 active:scale-95 gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                      Watch Trailer
                    </button>
                  </div>
                </div>

                {/* Right Column (Info Tray matching 1:1 with Homepage featured highlight card) */}
                <div className="self-end hidden lg:block z-20">
                  <div className="rounded-3xl border border-white/15 bg-black/45 p-6 backdrop-blur-md shadow-2xl text-left max-w-sm ml-auto">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#00B5A5] mb-4">Quick Specs</p>
                    <div className="space-y-4">
                      {/* Maturity Rating */}
                      {certification && (
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Maturity Rating</span>
                          <span className="rounded-md border border-white/20 bg-white/5 px-2.5 py-0.5 text-xs font-bold text-white">
                            {certification}
                          </span>
                        </div>
                      )}

                      {/* Runtime */}
                      {runtimeStr && (
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Duration</span>
                          <span className="text-xs font-bold text-white">{runtimeStr}</span>
                        </div>
                      )}

                      {/* Rating */}
                      {rating && (
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Critics Score</span>
                          <span className="text-xs font-extrabold text-[#00B5A5] flex items-center gap-1">
                            ★ {rating}/10
                          </span>
                        </div>
                      )}

                      {/* Provider Badges */}
                      {providers.length > 0 && (
                        <div className="flex flex-col gap-2 pt-1">
                          <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Now Streaming On</span>
                          <div className="flex flex-wrap gap-1.5">
                            {providers.slice(0, 3).map((prov) => (
                              <span
                                key={prov.provider_id}
                                className="rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[9px] font-bold text-zinc-300"
                              >
                                {prov.provider_name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* Extended Details Section (Synopsis, Grid) */}
          <MovieDetailsExtended
            type={type}
            details={details}
            logoUrl={logoUrl}
            providers={providers}
            watchLink={watchLink}
            inCinema={inCinema}
            recommendations={recommendations}
            cast={cast}
            crew={crew}
            omdbRatings={omdbRatings}
            reviews={reviews}
            onEpisodeClick={setSelectedEpisode}
          />
        </motion.div>
        {renderEpisodeModal()}
      </main>
    );
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleDismiss}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl flex overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={details?.title || details?.name || "Title details"}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full min-h-screen z-50 flex flex-col bg-transparent"
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={() => router.back()}
          className="absolute top-6 right-6 z-40 flex items-center justify-center w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white transition-all duration-300 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Section (Includes Backdrop, Title, Actions) */}
        <MovieDetailsHero
          details={details}
          logoUrl={logoUrl}
          backdropUrl={backdropUrl}
        >
          {/* Metadata & Tech Specs inside the same layout wrapper */}
          <MovieDetailsMeta
            details={details}
            year={year}
            runtimeStr={runtimeStr}
            certification={certification}
            rating={rating}
            omdbRatings={omdbRatings}
          />
        </MovieDetailsHero>

        {/* Extended Details Section (Synopsis, Grid) */}
        <MovieDetailsExtended type={type} details={details} logoUrl={logoUrl} providers={providers} watchLink={watchLink} inCinema={inCinema} recommendations={recommendations} cast={cast} crew={crew} omdbRatings={omdbRatings} reviews={reviews} onEpisodeClick={setSelectedEpisode} />
      </motion.div>
      {renderEpisodeModal()}
    </div>
  );
}
