"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface ComingSoonPageProps {
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  category: string;
  accentClass?: string;
  infoTitle?: string;
  infoBody?: string;
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

export function ComingSoonPage({
  title,
  subtitle,
  description,
  category,
  infoTitle,
  infoBody,
}: ComingSoonPageProps) {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center relative">
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 md:px-12 text-center flex flex-col items-center pt-32 md:pt-40">
        {/* Back link */}
        <motion.div {...fadeUp(0)} className="mb-8 md:mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/30 hover:text-white/70 transition-colors duration-500 cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            Home
          </Link>
        </motion.div>

        {/* Category */}
        <motion.div {...fadeUp(0.08)} className="mb-5 md:mb-6">
          <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">
            {category}
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          {...fadeUp(0.16)}
          className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight leading-[1.1] mb-4"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.2)}
          className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/35 mb-5 md:mb-6"
        >
          {subtitle}
        </motion.p>

        {/* Description */}
        <motion.p
          {...fadeUp(0.28)}
          className="text-white/50 text-[15px] md:text-lg leading-[1.7] max-w-lg mx-auto mb-10 md:mb-14 font-light"
        >
          {description}
        </motion.p>

        {/* CTA */}
        <motion.div {...fadeUp(0.36)}>
          <Link
            href="/"
            className="bg-white text-black rounded-full px-8 py-3.5 text-sm font-medium hover:bg-white/90 transition-all duration-500 active:scale-[0.98] inline-flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to FrameMeta
          </Link>
        </motion.div>

        {/* Info card */}
        {(infoTitle || infoBody) && (
          <motion.div {...fadeUp(0.44)} className="w-full max-w-sm mt-10 md:mt-14">
            <div className="border-t border-white/[0.06] pt-8 text-left">
              {infoTitle && (
                <h3 className="text-sm font-medium text-white/60 tracking-tight mb-3">
                  {infoTitle}
                </h3>
              )}
              {infoBody && (
                <p className="text-white/40 text-[13px] leading-[1.7] font-light">
                  {infoBody}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
