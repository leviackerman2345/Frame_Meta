"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingScreen } from "./LoadingScreen";

/**
 * InitialLoader Component
 * Shows the premium LoadingScreen on hard reloads and first visits.
 */
export function InitialLoader() {
  // Start visible so users never see a blank screen while html[data-loading]
  // temporarily hides the page before this client component hydrates.
  const [loading, setLoading] = useState(true);

  // PerformanceNavigationTiming is used instead of sessionStorage because it
  // runs exclusively in the browser after hydration (inside useEffect), so
  // server and client always agree on the initial render. sessionStorage caused
  // a hydration mismatch because the server has no window object and always
  // returned false, while the client returned true on a first visit.
  //
  // Zero-flash architecture:
  // A blocking inline <script> in layout.tsx stamps data-loading="true" on
  // document.documentElement (<html>) synchronously during HTML parsing, before
  // the browser paints a single pixel. The CSS rule in globals.css then hides
  // Navbar/Footer from frame zero. This useEffect only needs to:
  //   1. Confirm it is a hard navigation and activate the loader state.
  //   2. Remove the attribute from document.documentElement (NOT document.body)
  //      when the 1500ms timer fires, so the layout chrome reappears.
  //   3. In the else branch: remove the attribute immediately for soft
  //      navigations so a stale attribute from a prior hard load can't hide
  //      content on subsequent page transitions.
  useEffect(() => {
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const isHardNavigation = navEntry?.type === 'navigate' || navEntry?.type === 'reload';

    if (isHardNavigation) {
      // Keep loader briefly on hard loads for a smooth handoff.
      const timer = setTimeout(() => {
        setLoading(false);
        // Remove from <html> to reveal page content — matches where the
        // blocking inline script set it (document.documentElement)
        document.documentElement.removeAttribute('data-loading');
      }, 650);

      return () => clearTimeout(timer);
    } else {
      // Soft navigation or back/forward — ensure the attribute is cleaned up
      // in case it was left over from a previous hard load
      const clear = setTimeout(() => setLoading(false), 0);
      document.documentElement.removeAttribute('data-loading');
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
            scale: 1.1,
            filter: "blur(20px)",
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
          }}
          className="fixed inset-0 z-[99999] initial-loader"
        >
          <LoadingScreen delay={0} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
