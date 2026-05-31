"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { TitleLogo } from "@/components/ui/TitleLogo";
import type { Clip } from "@/types/types";

interface MovieLoopSectionProps {
  clips: Clip[];
}

const PREVIEW_LOOP_SECONDS = 20;

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement,
        options: {
          width?: string | number;
          height?: string | number;
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: { target: YouTubePlayer }) => void;
            onStateChange?: (event: { data: number; target: YouTubePlayer }) => void;
            onError?: (event: { data: number; target: YouTubePlayer }) => void;
          };
        }
      ) => YouTubePlayer;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
    __frameMetaYouTubeApiReady?: Promise<void>;
  }
}

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  mute: () => void;
  destroy: () => void;
}

function loadYouTubeIframeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (window.__frameMetaYouTubeApiReady) return window.__frameMetaYouTubeApiReady;

  window.__frameMetaYouTubeApiReady = new Promise((resolve) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]'
    );

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      resolve();
    };

    if (existingScript) return;

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
  });

  return window.__frameMetaYouTubeApiReady;
}

function MovieLoopCard({ clip }: { clip: Clip }) {
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const playerHostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isHovering || !clip.youtubeId) {
      if (playbackTimeoutRef.current) clearTimeout(playbackTimeoutRef.current);
      playbackTimeoutRef.current = null;
      if (playerRef.current) {
        try {
          playerRef.current.pauseVideo();
        } catch {
          // no-op
        }
        playerRef.current.destroy();
        playerRef.current = null;
      }
      isPlayingRef.current = false;
      return;
    }

    let cancelled = false;

    const mountPlayer = async () => {
      await loadYouTubeIframeApi();
      if (cancelled || !playerHostRef.current || !window.YT?.Player) return;

      const origin =
        typeof window !== "undefined" ? window.location.origin : "https://www.youtube.com";

      playerRef.current = new window.YT.Player(playerHostRef.current, {
        width: "100%",
        height: "100%",
        videoId: clip.youtubeId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          loop: 1,
          start: 0,
          end: PREVIEW_LOOP_SECONDS,
          playlist: clip.youtubeId,
          iv_load_policy: 3,
          fs: 0,
          disablekb: 1,
          origin,
        },
        events: {
          onReady: (event) => {
            if (cancelled) return;
            event.target.mute();
            event.target.seekTo(0, true);
            event.target.playVideo();
          },
          onStateChange: (event) => {
            if (!window.YT?.PlayerState || cancelled) return;
            if (event.data === window.YT.PlayerState.PLAYING) {
              isPlayingRef.current = true;
              setIsPlaying(true);
            }
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.seekTo(0, true);
              event.target.playVideo();
            }
          },
          onError: () => {
            isPlayingRef.current = false;
            setIsPlaying(false);
          },
        },
      });

      // Prevent black YouTube frame from taking over if playback is blocked.
      playbackTimeoutRef.current = setTimeout(() => {
        if (!cancelled && !isPlayingRef.current) {
          if (playerRef.current) {
            playerRef.current.destroy();
            playerRef.current = null;
          }
          setIsPlaying(false);
        }
      }, 1800);
    };

    mountPlayer();

    return () => {
      cancelled = true;
      if (playbackTimeoutRef.current) clearTimeout(playbackTimeoutRef.current);
      playbackTimeoutRef.current = null;
    };
  }, [clip.youtubeId, isHovering]);

  function handleMouseEnter() {
    isPlayingRef.current = false;
    setIsPlaying(false);
    setIsHovering(true);
  }

  function handleMouseLeave() {
    isPlayingRef.current = false;
    setIsPlaying(false);
    setIsHovering(false);
  }

  const artwork = clip.thumbnailUrl || clip.posterPath || "/images/poster-placeholder.jpg";

  return (
    <Link
      href={`/titles/${clip.tmdbId}?type=${clip.mediaType}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-zinc-950 shadow-lg shadow-black/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 select-none cursor-pointer"
    >
      {/* Static Movie Thumbnail Background (No YT Logo branding) */}
      <Image
        src={artwork}
        alt={clip.title}
        fill
        className="object-cover object-center pointer-events-none transition-transform duration-1000 ease-out group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, 400px"
        priority
      />

      {/* Remount on each hover to trigger fresh autoplay from the start */}
      {isHovering && (
        <div
          className={`absolute inset-0 z-10 w-full h-full overflow-hidden pointer-events-none transition-opacity duration-200 ${
            isPlaying ? "opacity-100" : "opacity-0"
          }`}
        >
          <div ref={playerHostRef} className="absolute inset-0 w-full h-full scale-[1.04] origin-center" />
        </div>
      )}

      {/* Glass play indicator */}
      <div className="absolute inset-0 z-15 flex items-center justify-center pointer-events-none transition-all duration-500 group-hover:opacity-0 group-hover:scale-90">
        <div className="w-12 h-12 rounded-full bg-white/[0.1] backdrop-blur-xl border border-white/[0.15] flex items-center justify-center text-white transition-all duration-300">
          <Play className="w-4 h-4 fill-white stroke-none translate-x-[1px]" />
        </div>
      </div>

      {/* Clean vignette for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-95" />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent z-20 pointer-events-none" />

      {/* Floating Meta Details Overlay */}
      <div
        className={`absolute inset-x-0 bottom-0 p-5 md:p-6 z-30 flex flex-col items-center justify-center text-center pointer-events-none transition-opacity duration-200 ${
          isPlaying ? "opacity-0" : "opacity-100"
        }`}
      >
        <TitleLogo
          id={clip.tmdbId}
          title={clip.title}
          type={clip.mediaType}
          logoClassName="h-9 md:h-11 max-w-[85%] mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:scale-[1.03]"
          fallbackClassName="text-center text-base md:text-lg font-bold text-white leading-tight line-clamp-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:scale-[1.03]"
          className="justify-center mb-1.5"
          sizes="(max-width: 768px) 250px, 350px"
        />

        <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 transition-colors duration-300 group-hover:text-zinc-300">
          {clip.category}
        </span>
      </div>
    </Link>
  );
}

export function MovieLoopSection({ clips }: MovieLoopSectionProps) {
  // Allow exactly 3 cards to view at a time on the screen grid
  const displayClips = clips.slice(0, 3);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-12 py-10 relative z-20">
      <SectionHeader
        title="The Loop"
        subtitle="Muted cinematic previews for a quick visual read."
        layout="split"
        action={
          <Link
            href="/clips"
            className="hidden md:flex items-center gap-2 text-xs font-semibold text-white/55 hover:text-white transition-colors"
          >
            See all clips <span aria-hidden="true">+</span>
          </Link>
        }
      />

      {/* Scrollable horizontal carousel container on mobile, 3-Column Grid on md+ */}
      <div className="flex md:grid md:grid-cols-3 gap-5 md:gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-1">
        {displayClips.map((clip) => (
          <div key={clip.id} className="w-[85%] sm:w-[48%] md:w-auto shrink-0 snap-center snap-always">
            <MovieLoopCard clip={clip} />
          </div>
        ))}
      </div>
    </section>
  );
}
