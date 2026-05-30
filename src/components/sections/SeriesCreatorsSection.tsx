import Link from "next/link";
import { SectionHeader } from "@/components/sections/SectionHeader";

const CREATORS = [
  {
    name: "Vince Gilligan",
    role: "Showrunner",
    shows: "Breaking Bad, Better Call Saul",
    query: "vince gilligan",
    gradient: "from-emerald-500/20 via-teal-600/5 to-transparent",
  },
  {
    name: "Hwang Dong-hyuk",
    role: "Creator & Director",
    shows: "Squid Game",
    query: "hwang dong-hyuk",
    gradient: "from-rose-500/20 via-pink-600/5 to-transparent",
  },
  {
    name: "Mike White",
    role: "Creator & Writer",
    shows: "The White Lotus, Enlightened",
    query: "mike white",
    gradient: "from-amber-500/20 via-yellow-600/5 to-transparent",
  },
  {
    name: "Craig Mazin",
    role: "Showrunner",
    shows: "The Last of Us, Chernobyl",
    query: "craig mazin",
    gradient: "from-cyan-500/20 via-blue-600/5 to-transparent",
  },
  {
    name: "Phoebe Waller-Bridge",
    role: "Creator & Star",
    shows: "Fleabag, Killing Eve",
    query: "phoebe waller-bridge",
    gradient: "from-purple-500/20 via-violet-600/5 to-transparent",
  },
  {
    name: "David Chase",
    role: "Creator",
    shows: "The Sopranos",
    query: "david chase",
    gradient: "from-red-600/20 via-zinc-900/5 to-transparent",
  },
];

export function SeriesCreatorsSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-12 py-10 relative z-20">
      <SectionHeader
        title="The Visionaries"
        subtitle="Track premium television by its creative architect."
        layout="split"
        action={
          <Link
            href="/people"
            className="hidden md:flex items-center gap-2 text-xs font-semibold text-white/55 hover:text-white transition-colors"
          >
            Browse all creators <span aria-hidden="true">+</span>
          </Link>
        }
      />

      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory px-1 scroll-smooth">
        {CREATORS.map((creator) => (
          <Link
            key={creator.name}
            href={`/search?q=${encodeURIComponent(creator.query)}`}
            className="group relative shrink-0 w-[260px] md:w-[300px] rounded-[2rem] border border-white/8 bg-zinc-950/50 overflow-hidden snap-start"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${creator.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />

            <div className="relative p-6 md:p-8 flex flex-col gap-4">
              <div className="w-16 h-16 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-white/80">
                  {creator.name.charAt(0)}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold tracking-tight text-white group-hover:text-white transition-colors">
                  {creator.name}
                </h3>
                <p className="text-xs text-white/40 mt-0.5">{creator.role}</p>
              </div>

              <p className="text-sm text-white/55 leading-relaxed">
                {creator.shows}
              </p>

              <div className="flex items-center gap-1.5 text-xs font-medium text-white/40 group-hover:text-white/70 transition-colors">
                <span>Explore filmography</span>
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                  &rarr;
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
