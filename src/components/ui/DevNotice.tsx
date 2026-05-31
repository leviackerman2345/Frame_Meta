"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export function DevNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("framemeta_dev_notice");
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 1600);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("framemeta_dev_notice", "dismissed");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={dismiss}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm bg-zinc-950/95 backdrop-blur-3xl border border-white/[0.08] rounded-[1.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden z-10"
          >
            {/* Ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-blue-500/[0.06] rounded-full blur-[80px] pointer-events-none" />

            {/* Close button */}
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/[0.06] text-zinc-500 hover:text-white transition-all duration-200 cursor-pointer z-20"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="relative p-7 md:p-8 flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-blue-500/[0.08] border border-blue-500/[0.12] flex items-center justify-center mb-5">
                <AlertTriangle className="w-7 h-7 text-blue-400" />
              </div>

              {/* Badge */}
              <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400/80 bg-blue-500/[0.06] border border-blue-500/[0.1] rounded-full mb-4">
                Under Development
              </span>

              {/* Heading */}
              <h2 className="text-lg font-semibold text-white tracking-tight mb-2">
                Welcome to FrameMeta
              </h2>

              {/* Description */}
              <p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-xs">
                This platform is currently under active development. You may encounter occasional bugs, slower load times, or incomplete features as we continue building.
              </p>

              {/* CTA */}
              <button
                onClick={dismiss}
                className="w-full px-6 py-3 bg-white text-black text-sm font-semibold rounded-full hover:bg-white/90 transition-all duration-200 active:scale-[0.97] cursor-pointer"
              >
                I Understand
              </button>

              {/* Fine print */}
              <p className="text-[10px] text-zinc-600 mt-4">
                This notice appears once per session.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
