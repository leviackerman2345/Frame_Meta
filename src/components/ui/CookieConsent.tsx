"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, X } from "lucide-react";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("framemeta_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("framemeta_cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("framemeta_cookie_consent", "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto md:max-w-md z-[300]"
        >
          <div className="bg-zinc-950/90 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-5 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0">
                <Cookie className="w-5 h-5 text-zinc-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white tracking-tight mb-1.5">
                  Cookie Notice
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  We use cookies to enhance your experience, analyze site traffic, and personalize content. By continuing to browse, you agree to our use of cookies.
                </p>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={accept}
                    className="px-5 py-2 bg-white text-black text-xs font-semibold rounded-full hover:bg-white/90 transition-all duration-200 active:scale-[0.97] cursor-pointer"
                  >
                    Accept
                  </button>
                  <button
                    onClick={decline}
                    className="px-5 py-2 bg-white/[0.06] border border-white/[0.08] text-zinc-300 text-xs font-medium rounded-full hover:bg-white/[0.1] hover:text-white transition-all duration-200 cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              </div>
              <button
                onClick={decline}
                className="p-1.5 rounded-lg hover:bg-white/[0.06] text-zinc-500 hover:text-white transition-all duration-200 shrink-0 cursor-pointer"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
