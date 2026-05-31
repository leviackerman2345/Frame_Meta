"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SPLASH_DURATION_MS = 1200;
const BRAND_NAME = "FrameMeta";

function CinematicSplash() {
  const brandStart = "Frame";
  const chars = useMemo(() => BRAND_NAME.split(""), []);

  return (
    <div className="fixed inset-0 z-[99999] bg-black cinematic-grain cinematic-vignette flex flex-col items-center justify-center">
      {/* Ambient spotlight */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-white/[0.015] rounded-full blur-[120px] pointer-events-none" />

      {/* Brand reveal */}
      <div className="relative z-10 flex flex-col items-center gap-5">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl tracking-[-0.02em] text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {chars.map((char, i) => (
            <motion.span
              key={i}
              className="cinematic-brand-char inline-block"
              style={{
                fontWeight: i < brandStart.length ? 500 : 700,
              }}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.5,
                delay: 0.3 + i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Accent line */}
        <motion.div
          className="cinematic-accent-line h-[1px] w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent origin-center"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Tagline */}
        <motion.p
          className="text-[11px] uppercase tracking-[0.35em] text-white/25 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          Cinematic Intelligence
        </motion.p>
      </div>

      {/* Bottom progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.04] overflow-hidden">
        <motion.div
          className="cinematic-progress-bar h-full bg-gradient-to-r from-white/10 via-white/30 to-white/10 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: SPLASH_DURATION_MS / 1000 - 0.3, delay: 0.2, ease: "linear" }}
        />
      </div>
    </div>
  );
}

/**
 * InitialLoader — cinematic splash on hard navigation (first visit / refresh).
 * Soft navigations (route transitions) skip this entirely and use loading.tsx skeletons.
 */
export function InitialLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = prefersReducedMotion ? 300 : SPLASH_DURATION_MS;

    const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    const isHardNavigation = navEntry?.type === "navigate" || navEntry?.type === "reload";

    if (isHardNavigation) {
      const timer = setTimeout(() => {
        setLoading(false);
        document.documentElement.removeAttribute("data-loading");
      }, duration);
      return () => clearTimeout(timer);
    } else {
      const clear = setTimeout(() => setLoading(false), 0);
      document.documentElement.removeAttribute("data-loading");
      return () => clearTimeout(clear);
    }
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            filter: "blur(8px)",
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[99999] initial-loader"
        >
          <CinematicSplash />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
