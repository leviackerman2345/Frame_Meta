"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export interface ContentSection {
  heading: string;
  body?: string;
  list?: string[];
}

interface ContentPageProps {
  title: string;
  category: string;
  description: string;
  sections: ContentSection[];
  footer?: string;
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

export function ContentPage({
  title,
  category,
  description,
  sections,
  footer,
}: ContentPageProps) {
  return (
    <main className="min-h-screen bg-black relative">
      {/* Hero */}
      <section className="relative z-10 pt-32 md:pt-40 pb-4 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp(0)} className="mb-6 md:mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/30 hover:text-white/70 transition-colors duration-500 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              Home
            </Link>
          </motion.div>

          <motion.div {...fadeUp(0.08)} className="mb-4 md:mb-5">
            <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">
              {category}
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.16)}
            className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight leading-[1.1] mb-4"
          >
            {title}
          </motion.h1>

          <motion.p
            {...fadeUp(0.24)}
            className="text-white/50 text-[15px] md:text-lg leading-[1.7] max-w-2xl font-light"
          >
            {description}
          </motion.p>
        </div>
      </section>

      {/* Thin divider */}
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="h-px bg-white/[0.06]" />
      </div>

      {/* Content sections */}
      <section className="relative z-10 pt-10 md:pt-14 pb-20 md:pb-28 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          {sections.map((section, index) => (
            <motion.article
              key={index}
              {...fadeUp(0)}
              className="group py-8 md:py-10 border-b border-white/[0.04] last:border-b-0"
            >
              {/* Section number */}
              <span className="block text-[11px] font-medium text-white/25 mb-3 tracking-wide">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight leading-tight mb-3 group-hover:text-white/90 transition-colors duration-500">
                {section.heading}
              </h2>

              {section.body && (
                <p className="text-white/50 text-[15px] md:text-base leading-[1.8] mb-4 max-w-2xl font-light">
                  {section.body}
                </p>
              )}

              {section.list && section.list.length > 0 && (
                <ul className="space-y-3 mt-4">
                  {section.list.map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="mt-2 w-[3px] h-[3px] rounded-full bg-white/20 shrink-0" />
                      <span className="text-white/50 text-[15px] md:text-base leading-[1.8] font-light">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.article>
          ))}
        </div>
      </section>

      {/* Footer note */}
      {footer && (
        <>
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            <div className="h-px bg-white/[0.04]" />
          </div>
          <section className="relative z-10 pt-10 md:pt-14 pb-16 md:pb-24 px-6 md:px-12">
            <div className="max-w-4xl mx-auto">
              <motion.p
                {...fadeUp(0)}
                className="text-white/35 text-xs md:text-[13px] leading-[1.7] max-w-xl font-light"
              >
                {footer}
              </motion.p>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
