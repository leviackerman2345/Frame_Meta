"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Reusable Loading Screen component
 * Includes a 200ms delay to prevent flickering on fast connections.
 */
export function LoadingScreen({ fullScreen = true, delay = 200 }: { fullScreen?: boolean; delay?: number }) {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShouldShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const containerClasses = fullScreen 
    ? "fixed inset-0 z-[9999] bg-black/80 backdrop-blur-xl flex items-center justify-center"
    : "flex items-center justify-center p-8 w-full h-full";

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={containerClasses}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-white shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
            <p className="text-sm font-bold text-white/50 uppercase tracking-[0.2em] animate-pulse">
              Loading…
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
