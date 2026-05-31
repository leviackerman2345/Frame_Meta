"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface TitleLogoProps {
  id: number;
  title: string;
  type?: "movie" | "series" | "tv";
  className?: string;
  logoClassName?: string;
  fallbackClassName?: string;
  sizes?: string;
  logoUrl?: string | null;
}

const clientLogoCache = new Map<string, string | null>();

export function TitleLogo({
  id,
  title,
  type = "movie",
  className = "",
  logoClassName = "h-10 md:h-12",
  fallbackClassName = "text-white font-bold text-sm md:text-base leading-tight drop-shadow-md line-clamp-2 w-full text-center",
  sizes = "140px",
  logoUrl: providedLogoUrl,
}: TitleLogoProps) {
  const apiType = type === "series" || type === "tv" ? "tv" : "movie";
  const cacheKey = `${apiType}-${id}`;
  const cachedLogoUrl = providedLogoUrl === undefined ? clientLogoCache.get(cacheKey) : undefined;
  const [fetchedLogo, setFetchedLogo] = useState<{
    cacheKey: string;
    logoUrl: string | null;
    loaded: boolean;
  }>({
    cacheKey,
    logoUrl: cachedLogoUrl ?? providedLogoUrl ?? null,
    loaded: cachedLogoUrl !== undefined || providedLogoUrl !== undefined,
  });

  const displayLogoUrl =
    providedLogoUrl !== undefined
      ? providedLogoUrl
      : cachedLogoUrl !== undefined
        ? cachedLogoUrl
        : fetchedLogo.cacheKey === cacheKey
          ? fetchedLogo.logoUrl
          : null;
  const isLoading =
    providedLogoUrl === undefined &&
    cachedLogoUrl === undefined &&
    (fetchedLogo.cacheKey !== cacheKey || !fetchedLogo.loaded);

  useEffect(() => {
    if (providedLogoUrl !== undefined) {
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    if (clientLogoCache.has(cacheKey)) {
      return () => {
        isMounted = false;
        controller.abort();
      };
    }
    const fetchLogo = async () => {
      try {
        const response = await fetch(`/api/titles/${id}/logo?type=${apiType}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          if (isMounted) {
            setFetchedLogo({ cacheKey, logoUrl: null, loaded: true });
          }
          return;
        }
        const data = await response.json();
        if (isMounted) {
          clientLogoCache.set(cacheKey, data.logoUrl ?? null);
          setFetchedLogo({ cacheKey, logoUrl: data.logoUrl ?? null, loaded: true });
        }
      } catch (error) {
        if (isMounted && (error as Error).name !== "AbortError") {
          setFetchedLogo({ cacheKey, logoUrl: null, loaded: true });
        }
      }
    };

    fetchLogo();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [cacheKey, id, apiType, providedLogoUrl]);

  const hasJustify = className.includes("justify-");
  const alignmentClass = hasJustify ? "" : "justify-center";
  const isLeftAligned = className.includes("justify-start");
  const objectPositionClass = isLeftAligned ? "object-left" : "object-center";

  return (
    <div className={`relative w-full flex items-center ${alignmentClass} ${className}`}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          /* Shimmer placeholder while fetching */
          <div
            key="shimmer"
            className="w-[70%] h-4 rounded-md bg-white/5 overflow-hidden"
          >
            <div
              className="h-full w-full animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent"
              style={{ animationDuration: "1.5s" }}
            />
          </div>
        ) : displayLogoUrl ? (
          <motion.div
            key="logo"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className={`relative w-full ${logoClassName}`}
          >
            <Image
              src={displayLogoUrl}
              alt={title}
              fill
              className={`object-contain ${objectPositionClass} drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]`}
              sizes={sizes}
              unoptimized
            />
          </motion.div>
        ) : (
          <motion.h3
            key="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={fallbackClassName}
          >
            {title}
          </motion.h3>
        )}
      </AnimatePresence>
    </div>
  );
}
