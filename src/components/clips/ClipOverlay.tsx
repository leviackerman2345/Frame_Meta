"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, Clapperboard, Plus, Share2 } from "lucide-react";
import Link from "next/link";
import { Clip } from "@/types/types";
import { useAuth } from "@/contexts/AuthContext";
import { TitleLogo } from "@/components/ui/TitleLogo";

interface ClipOverlayProps {
  clip: Clip;
  isActive?: boolean;
  setModalOpen?: (isOpen: boolean) => void;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

interface GlassActionButtonProps {
  label: string;
  count?: string;
  pressed?: boolean;
  href?: string;
  onClick?: () => void;
  children: ReactNode;
}

function GlassActionButton({
  label,
  count,
  pressed,
  href,
  onClick,
  children,
}: GlassActionButtonProps) {
  const buttonContent = (
    <span className="relative z-10 text-white transition-colors duration-300">
      {children}
    </span>
  );

  const buttonClassName = [
    "group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full",
    "border border-white/15 bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
    "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:bg-white/15 hover:border-white/25 active:scale-95",
    pressed ? "ring-2 ring-white/40 bg-white/20 border-white/30" : "",
  ].join(" ");

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      {href ? (
        <Link href={href} className={buttonClassName} aria-label={label}>
          {buttonContent}
        </Link>
      ) : (
        <button onClick={onClick} className={buttonClassName} aria-label={label}>
          {buttonContent}
        </button>
      )}
      <span className="text-zinc-300 font-medium text-[10px] uppercase tracking-widest drop-shadow-md select-none mt-1 group-hover:text-white transition-colors duration-200">
        {count ?? label}
      </span>
    </div>
  );
}

export default function ClipOverlay({ clip, isActive }: ClipOverlayProps) {
  const { isLoggedIn, openLoginModal } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);

  // No longer tracking modal state locally to avoid race conditions across the feed.
  // The parent ClipFeed now monitors the pathname and determines the active modal state.

  // The auth gate pattern — check first, act second, never assume logged in.
  // This ensures that user actions which require identity (like, comment)
  // consistently prompt for login before proceeding.
  const handleWishlist = () => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    setIsWishlisted((prev) => !prev);
  };

  // Why share has no auth gate — sharing benefits the platform regardless of login state.
  // We want to remove all friction from users distributing content externally.
  const handleShare = async () => {
    const url = window.location.href;
    const title = clip.title;

    if (navigator?.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        // User cancelled share or share failed
        console.error("Share failed", err);
      }
    } else if (navigator?.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
      } catch (err) {
        console.error("Failed to copy", err);
      }
    }
  };

  // Extract number from certification for the age rating, defaulting to 18
  const certNumberMatch = clip.certification?.match(/\d+/);
  const ageNumber = certNumberMatch ? certNumberMatch[0] : "18";

  return (
    <>
      {/* Top-left Age Rating */}
      <motion.div
        initial={{ 
          opacity: 0,
          backgroundColor: "rgba(37, 99, 235, 1)",
          backdropFilter: "blur(0px)",
          borderColor: "rgba(255, 255, 255, 0)"
        }}
        animate={isActive ? { 
          opacity: 1,
          backgroundColor: ["rgba(37, 99, 235, 1)", "rgba(37, 99, 235, 1)", "rgba(37, 99, 235, 0.4)"],
          backdropFilter: ["blur(0px)", "blur(0px)", "blur(12px)"],
          borderColor: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.2)"]
        } : { 
          opacity: 0,
          backgroundColor: "rgba(37, 99, 235, 1)",
          backdropFilter: "blur(0px)",
          borderColor: "rgba(255, 255, 255, 0)"
        }}
        transition={{ 
          opacity: { duration: 0.2 },
          backgroundColor: { times: [0, 0.66, 1], duration: 1.2, ease: "easeOut" },
          backdropFilter: { times: [0, 0.66, 1], duration: 1.2, ease: "easeOut" },
          borderColor: { times: [0, 0.66, 1], duration: 1.2, ease: "easeOut" }
        }}
        className="absolute top-24 left-4 px-4 py-2 md:px-5 md:py-3 flex items-center justify-center z-50 rounded border"
      >
        <motion.span
          initial={{ scale: 0.5 }}
          animate={isActive ? { scale: 1 } : { scale: 0.5 }}
          transition={{ delay: isActive ? 0.2 : 0, duration: 0.3, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-black text-white tracking-tighter"
        >
          {ageNumber}
        </motion.span>
        <motion.span
          initial={{ opacity: 0, textShadow: "0 0 0px rgba(255,255,255,0)" }}
          animate={isActive ? {
            opacity: 1,
            textShadow: ["0 0 40px rgba(255,255,255,1)", "0 0 0px rgba(255,255,255,0)"]
          } : { opacity: 0, textShadow: "0 0 0px rgba(255,255,255,0)" }}
          transition={{ delay: isActive ? 0.4 : 0, duration: 0.4 }}
          className="text-4xl md:text-5xl font-black text-gray-300 ml-1"
        >
          +
        </motion.span>
      </motion.div>

      {/* Right-side action bar */}
      <div className="absolute right-4 bottom-28 flex flex-col items-center gap-7 z-20">
        <GlassActionButton
          label="Wishlist"
          pressed={isWishlisted}
          onClick={handleWishlist}
          count={isWishlisted ? "Saved" : "Save"}
        >
          {isWishlisted ? <Check className="h-6 w-6 text-emerald-400" /> : <Plus className="h-6 w-6" />}
        </GlassActionButton>

        <GlassActionButton
          label="Share"
          onClick={handleShare}
        >
          <Share2 className="h-5.5 w-5.5" />
        </GlassActionButton>

        <GlassActionButton
          label="Clip"
          href={`/titles/${clip.tmdbId}?type=${clip.mediaType}`}
          count={formatCount(clip.popularity || 0)}
        >
          <Clapperboard className="h-5.5 w-5.5" />
        </GlassActionButton>
      </div>

      {/* Bottom gradient scrim behind text — ensures text is readable over any video content */}
      <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none z-10" />

      {/* Bottom-left info panel with responsive width safety limit */}
      <Link
        href={`/titles/${clip.tmdbId}?type=${clip.mediaType}`}
        className="absolute left-4 bottom-28 z-20 max-w-[calc(100%-80px)] md:max-w-[75%] flex items-end gap-4 hover:bg-white/5 rounded-2xl transition-colors duration-200 cursor-pointer group p-2 -ml-2"
      >
        {clip.posterPath && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block flex-shrink-0"
          >
            <img
              src={clip.posterPath}
              alt={clip.title}
              className="w-24 h-36 rounded-lg border border-white/20 shadow-2xl object-cover"
            />
          </motion.div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            {clip.posterPath && (
              <img
                src={clip.posterPath}
                alt=""
                className="w-8 h-12 rounded md:hidden border border-white/10 object-cover"
              />
            )}
            <span className="inline-block bg-white/10 backdrop-blur-sm text-white/70 text-xs font-black uppercase tracking-widest rounded-full px-3 py-1">
              {clip.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <TitleLogo
              id={clip.tmdbId}
              title={clip.title}
              type={clip.mediaType}
              className="max-w-[260px] justify-start md:max-w-[420px]"
              logoClassName="h-16 md:h-24"
              fallbackClassName="text-left text-2xl md:text-4xl font-bold text-white leading-tight drop-shadow-xl line-clamp-2"
              sizes="(max-width: 768px) 260px, 420px"
            />
            <ChevronRight className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <p className="text-base text-white/80 line-clamp-2 mt-2 leading-relaxed max-w-xl drop-shadow-md">
            {clip.description}
          </p>

          <div className="text-sm text-white/50 mt-3 flex items-center gap-3">
            <span className="font-semibold text-white/80">{clip.year}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="uppercase tracking-widest text-[11px] font-bold text-white/60">
              {clip.mediaType === 'movie' ? 'Film' : 'Series'}
            </span>
            {clip.duration > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="font-medium">{clip.duration}s</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </>
  );
}
