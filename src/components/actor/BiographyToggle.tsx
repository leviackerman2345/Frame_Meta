"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BiographyToggleProps {
  biography: string;
}

export function BiographyToggle({ biography }: BiographyToggleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!biography || biography.trim() === "") {
    return (
      <p className="text-zinc-300/90 italic text-sm md:text-lg font-medium leading-relaxed" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        No biography available.
      </p>
    );
  }

  // Split by sentence
  const sentenceArray = biography.split(". ").map((s, i, arr) => 
    i === arr.length - 1 ? s : s + ". "
  );

  const initialSentences = sentenceArray.slice(0, 3);
  const remainingSentences = sentenceArray.slice(3);
  const hasMore = remainingSentences.length > 0;

  return (
    <div className="space-y-6 font-medium text-sm md:text-lg text-zinc-300/90" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      <div>
        <p className="leading-relaxed">
          {initialSentences.map((sentence, index) => (
            <span key={`init-${index}`}>{sentence}</span>
          ))}
          {!isExpanded && hasMore && <span>...</span>}
          
          <AnimatePresence>
            {isExpanded && (
              <span className="inline">
                {remainingSentences.map((sentence, index) => (
                  <motion.span
                    key={`rem-${index}`}
                    initial={{ opacity: 0, filter: "blur(10px)", y: 5 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    exit={{ opacity: 0, filter: "blur(5px)", y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.08,
                      ease: "easeOut"
                    }}
                    className="inline"
                  >
                    {sentence}
                  </motion.span>
                ))}
              </span>
            )}
          </AnimatePresence>
        </p>
      </div>

      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white font-bold text-xs uppercase tracking-widest hover:text-zinc-300 transition-colors cursor-pointer underline underline-offset-4 decoration-white/30 hover:decoration-white"
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
}
