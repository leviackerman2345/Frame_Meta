"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingScreen } from "./LoadingScreen";

/**
 * InitialLoader Component
 * Shows the premium LoadingScreen on the very first site entry.
 */
export function InitialLoader() {
  // sessionStorage check: only show the splash on the very first visit per
  // browser session. window.location.href triggers a full page reload which
  // remounts the entire React tree — without this guard, useState(true) would
  // reset on every hard navigation and show the splash every time.
  const [loading, setLoading] = useState(() => {
    if (typeof window === 'undefined') return false;
    const seen = sessionStorage.getItem('app_loaded');
    if (seen) return false;
    sessionStorage.setItem('app_loaded', '1');
    return true;
  });

  useEffect(() => {
    // Show loader for at least 1.5 seconds for a premium "splash" feel
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.1,
            filter: "blur(20px)",
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
          }}
          className="fixed inset-0 z-[99999]"
        >
          <LoadingScreen delay={0} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
