"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Film,
  Sparkles,
  Globe,
  Zap,
  Shield,
  Users,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

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
/*  Main Section Component                                             */
/* ------------------------------------------------------------------ */

export function FeaturedAbout() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Desktop only: pin left column while right column scrolls ──
      ScrollTrigger.matchMedia({
        "(min-width: 1024px)": () => {
          if (!leftColRef.current || !rightColRef.current) return;

          ScrollTrigger.create({
            trigger: rightColRef.current,
            start: "top top",
            end: "bottom bottom",
            pin: leftColRef.current,
            pinSpacing: false,
          });
        },
      });

      // ── Header entrance (all breakpoints) ──
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            once: true,
          },
        });
      }

      // ── Card entrance animations (all breakpoints) ──
      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });

        tl.from(card, {
          opacity: 0,
          y: 50,
          duration: 0.7,
          ease: "power3.out",
          delay: index * 0.05,
        });

        const iconContainer = card.querySelector(".card-icon");
        if (iconContainer) {
          tl.from(
            iconContainer,
            { scale: 0.8, opacity: 0, duration: 0.5, ease: "back.out(1.7)" },
            "-=0.4"
          );
        }

        const tags = card.querySelectorAll(".card-tag");
        if (tags.length) {
          tl.from(
            tags,
            { opacity: 0, x: -10, duration: 0.4, stagger: 0.06, ease: "power2.out" },
            "-=0.2"
          );
        }
      });

      // ── Progress bar scrub (all breakpoints) ──
      if (progressRef.current && rightColRef.current) {
        gsap.to(progressRef.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rightColRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 0.3,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="featured-about"
      className="relative w-full bg-brand-black"
    >
      {/* Decorative ambient glow */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-brand-accent/[0.03] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-yellow-400/[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* Section Header — scrolls away normally */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-28 pb-8 md:pb-12">
        <div ref={headerRef}>
          <span className="inline-block text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-4 md:mb-6">
            {sectionHeading.label}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] whitespace-pre-line">
            {sectionHeading.title}
          </h2>
        </div>
      </div>

      {/* Two-Column Scrollytelling */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-28">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16">
          {/* Left Column — GSAP pins this on desktop */}
          <div
            ref={leftColRef}
            className="lg:w-1/2 shrink-0"
          >
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

            {/* Progress indicator */}
            <div className="mt-6 md:mt-8">
              <div className="h-px bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  ref={progressRef}
                  className="h-full bg-white/20 origin-left"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>
            </div>
          </div>

          {/* Right Column — scrolls naturally, drives the pin duration */}
          <div
            ref={rightColRef}
            className="lg:w-1/2 flex flex-col"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.number}
                  ref={(el) => {
                    if (el) cardRefs.current[index] = el;
                  }}
                  className="group relative py-8 md:py-10 border-b border-white/[0.06] last:border-b-0"
                >
                  {/* Number watermark */}
                  <span className="absolute top-6 right-0 text-[64px] md:text-[80px] font-black text-white/[0.03] leading-none select-none pointer-events-none group-hover:text-white/[0.06] transition-colors duration-500">
                    {feature.number}
                  </span>

                  {/* Icon + Title Row */}
                  <div className="flex items-start gap-4 mb-4 md:mb-5 relative z-10">
                    <div className="card-icon w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0 group-hover:bg-white/[0.1] group-hover:border-white/[0.15] transition-all duration-500">
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
                        className="card-tag px-3 py-1 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500 border border-white/[0.06] rounded-full group-hover:text-zinc-300 group-hover:border-white/[0.1] transition-all duration-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
