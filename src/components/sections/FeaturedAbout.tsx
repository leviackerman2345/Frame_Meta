"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  Film,
  Sparkles,
  Globe,
  Zap,
  Shield,
  Users,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Content Data                                                       */
/* ------------------------------------------------------------------ */

const sectionHeading = {
  label: "WHY FRAMEMETA",
  title: "Engineered for\nCinematic Excellence",
  description:
    "We build more than a platform — we craft an ecosystem where storytelling meets cutting-edge technology. Every pixel, every frame, every interaction is designed to elevate your viewing experience.",
};

const features = [
  {
    icon: Film,
    number: "01",
    title: "Cinematic-Grade Streaming",
    description:
      "Experience every frame in stunning 4K HDR with Dolby Atmos spatial audio. Our adaptive bitrate engine ensures flawless playback — from blockbuster action to intimate indie dramas.",
    tags: ["4K HDR", "Dolby Atmos", "Adaptive Bitrate"],
  },
  {
    icon: Sparkles,
    number: "02",
    title: "AI-Powered Discovery",
    description:
      "Our proprietary recommendation engine goes beyond watch history. It analyzes directorial styles, cinematography preferences, and narrative patterns to surface films you never knew you needed.",
    tags: ["Smart Curation", "Deep Learning", "Taste Profiles"],
  },
  {
    icon: Globe,
    number: "03",
    title: "Global Content Network",
    description:
      "Access the world's most diverse streaming catalog. From Korean masterworks to European arthouse, Latin American thrillers to Bollywood epics — all in one unified experience.",
    tags: ["200+ Regions", "Multi-Language", "Local Originals"],
  },
  {
    icon: Zap,
    number: "04",
    title: "Zero-Latency Architecture",
    description:
      "Built on a globally distributed edge network with intelligent pre-caching. Content loads instantly — no buffering, no lag, no compromise. Just seamless cinematic immersion.",
    tags: ["Edge CDN", "Pre-Caching", "Instant Load"],
  },
  {
    icon: Shield,
    number: "05",
    title: "Studio-Grade Security",
    description:
      "Enterprise-level DRM and encryption protect every title. Our platform meets the security standards required by major studios, ensuring early-window content arrives safely.",
    tags: ["DRM Protection", "Encrypted", "Studio Certified"],
  },
  {
    icon: Users,
    number: "06",
    title: "Community & Social",
    description:
      "Watch parties, critic circles, and curated lists — connect with cinephiles worldwide. Share reviews, build watchlists together, and join live discussions during premieres.",
    tags: ["Watch Parties", "Reviews", "Curated Lists"],
  },
];

/* ------------------------------------------------------------------ */
/*  Feature Card Component                                             */
/* ------------------------------------------------------------------ */

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative py-8 md:py-10 border-b border-white/[0.06] last:border-b-0"
    >
      {/* Number watermark */}
      <span className="absolute top-6 right-0 text-[64px] md:text-[80px] font-black text-white/[0.03] leading-none select-none pointer-events-none group-hover:text-white/[0.06] transition-colors duration-500">
        {feature.number}
      </span>

      {/* Icon + Title Row */}
      <div className="flex items-start gap-4 mb-4 md:mb-5 relative z-10">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0 group-hover:bg-white/[0.1] group-hover:border-white/[0.15] transition-all duration-500">
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-zinc-400 group-hover:text-white transition-colors duration-500" />
        </div>
        <div className="pt-1">
          <h3 className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight">
            {feature.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-zinc-400 text-sm md:text-[15px] leading-[1.7] mb-5 md:mb-6 relative z-10 group-hover:text-zinc-300 transition-colors duration-500">
        {feature.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 relative z-10">
        {feature.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500 border border-white/[0.06] rounded-full group-hover:text-zinc-300 group-hover:border-white/[0.1] transition-all duration-500"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Section Component                                             */
/* ------------------------------------------------------------------ */

export function FeaturedAbout() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 });

  return (
    <section
      ref={sectionRef}
      id="featured-about"
      className="relative w-full bg-brand-black overflow-hidden"
    >
      {/* Decorative ambient glow */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-brand-accent/[0.03] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-yellow-400/[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* Section Header — outside the pinned area */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 pt-16 md:pt-28 pb-8 md:pb-12">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-4 md:mb-6">
            {sectionHeading.label}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] whitespace-pre-line">
            {sectionHeading.title}
          </h2>
        </motion.div>
      </div>

      {/* Two-Column Layout: Pinned Left + Scrollable Right */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 pb-16 md:pb-28">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 lg:h-[85vh]">
          {/* Left Column — Pinned (no scroll) */}
          <div className="lg:w-1/2 shrink-0 flex flex-col justify-center">
            {/* Image Container */}
            <div className="relative aspect-[4/5] md:aspect-[3/4] w-full rounded-2xl md:rounded-3xl overflow-hidden border border-white/[0.06] shadow-2xl mb-6 md:mb-8">
              <Image
                src="/images/featured-about.png"
                alt="FrameMeta cinematic production studio"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

              {/* Floating badge on image */}
              <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6">
                  <p className="text-white/90 text-sm md:text-base font-medium leading-relaxed">
                    {sectionHeading.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {[
                { value: "200+", label: "Regions" },
                { value: "4K HDR", label: "Quality" },
                { value: "50M+", label: "Users" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-zinc-900/30 backdrop-blur-xl border border-white/[0.06] rounded-xl md:rounded-2xl p-3 md:p-4 text-center hover:border-white/[0.12] transition-all duration-500"
                >
                  <div className="text-lg md:text-2xl font-black text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-[10px] md:text-xs font-semibold text-zinc-500 uppercase tracking-[0.15em] mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column — Independent scrolling */}
          <div className="lg:w-1/2 lg:overflow-y-auto lg:pr-2 flex flex-col gap-0">
            {features.map((feature, index) => (
              <FeatureCard key={feature.number} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
