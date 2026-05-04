"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface TitleLogoProps {
  id: number;
  title: string;
  type?: "movie" | "series" | "tv";
  className?: string;
  logoUrl?: string | null;
}

const clientLogoCache = new Map<string, string | null>();

export function TitleLogo({ id, title, type = "movie", className = "", logoUrl: providedLogoUrl }: TitleLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(providedLogoUrl ?? null);
  const [loading, setLoading] = useState(providedLogoUrl === undefined);

  // Normalize type for API
  const apiType = type === "series" || type === "tv" ? "tv" : "movie";

  useEffect(() => {
    if (providedLogoUrl !== undefined) {
      setLogoUrl(providedLogoUrl);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();
    const cacheKey = `${apiType}-${id}`;

    if (clientLogoCache.has(cacheKey)) {
      setLogoUrl(clientLogoCache.get(cacheKey) ?? null);
      setLoading(false);
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
        if (!response.ok) return;
        const data = await response.json();
        if (isMounted) {
          setLogoUrl(data.logoUrl);
          clientLogoCache.set(cacheKey, data.logoUrl ?? null);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted && (error as Error).name !== "AbortError") {
          setLoading(false);
        }
      }
    };

    fetchLogo();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id, apiType, providedLogoUrl]);

  return (
    <div className={`relative w-full flex items-center justify-center ${className}`}>
      <AnimatePresence mode="wait">
        {loading ? (
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
        ) : logoUrl ? (
          <motion.div
            key="logo"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full h-10 md:h-12"
          >
            <Image
              src={logoUrl}
              alt={title}
              fill
              className="object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
              sizes="140px"
              unoptimized
            />
          </motion.div>
        ) : (
          <motion.h3
            key="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-white font-bold text-sm md:text-base leading-tight drop-shadow-md line-clamp-2 w-full text-center"
          >
            {title}
          </motion.h3>
        )}
      </AnimatePresence>
    </div>
  );
}
