import Link from "next/link";
import { SectionHeader } from "@/components/sections/SectionHeader";

export interface PortalCard {
  label: string;
  query: string;
  description: string;
  eyebrow?: string;
}

interface PortalGridSectionProps {
  title: string;
  subtitle?: string;
  cards: PortalCard[];
  actionLabel?: string;
  actionHref?: string;
}

const palettes = [
  "from-white/15 via-white/8 to-transparent",
  "from-sky-500/25 via-cyan-500/10 to-transparent",
  "from-rose-500/25 via-pink-500/10 to-transparent",
  "from-amber-500/25 via-orange-500/10 to-transparent",
  "from-emerald-500/25 via-teal-500/10 to-transparent",
  "from-violet-500/25 via-indigo-500/10 to-transparent",
];

export function PortalGridSection({
  title,
  subtitle,
  cards,
  actionLabel,
  actionHref,
}: PortalGridSectionProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-12 py-10 relative z-20">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        layout="split"
        action={
          actionLabel && actionHref ? (
            <Link
              href={actionHref}
              className="hidden md:flex items-center gap-2 text-xs font-semibold text-white/55 hover:text-white transition-colors"
            >
              {actionLabel}
              <span aria-hidden="true">+</span>
            </Link>
          ) : null
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
        {cards.map((card, index) => (
          <Link
            key={`${card.label}-${index}`}
            href={`/search?q=${encodeURIComponent(card.query)}`}
            className="group relative min-h-[180px] overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/70 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-transform duration-500 hover:-translate-y-1 hover:border-white/20"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${palettes[index % palettes.length]}`} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_35%)] opacity-70" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[9px] font-semibold tracking-[0.18em] text-white/70">
                  {card.eyebrow || "Explore"}
                </span>
                <span className="text-xs font-medium text-white/35">Tap</span>
              </div>
              <div>
                <h3 className="max-w-[12ch] text-2xl md:text-3xl font-semibold tracking-tight text-white">
                  {card.label}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55">
                  {card.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
