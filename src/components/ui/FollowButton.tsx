"use client";

import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FollowButtonProps {
  label?: string;
}

export function FollowButton({ label = "Follow" }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={() => setIsFollowing(!isFollowing)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center justify-center h-11 rounded-full font-bold text-xs uppercase tracking-widest overflow-hidden transition-all duration-300 min-w-[140px] px-8 border"
      animate={{
        backgroundColor: isFollowing 
          ? "#000000" 
          : (isHovered ? "#3b82f6" : "#ffffff"),
        color: isFollowing || isHovered ? "#ffffff" : "#000000",
        borderColor: isFollowing ? "#ffffff" : "transparent",
      }}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <AnimatePresence mode="wait">
        {isFollowing ? (
          <motion.div
            key="following"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Following</span>
          </motion.div>
        ) : (
          <div className="relative flex items-center justify-center w-full h-full">
            {/* HOVER STATE: Large Centered Plus */}
            <motion.div
              initial={false}
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1.8 : 0.6,
                y: isHovered ? 0 : 10,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <Plus className="w-4 h-4 stroke-[4]" />
            </motion.div>

            {/* DEFAULT STATE: Icon + Text */}
            <motion.div
              animate={{
                opacity: isHovered ? 0 : 1,
                x: isHovered ? -20 : 0,
                filter: isHovered ? "blur(4px)" : "blur(0px)",
              }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{label}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
