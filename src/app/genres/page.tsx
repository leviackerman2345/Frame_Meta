import Link from "next/link";
import { movieHomeContent } from "@/constants/movie-home";

const genreDescriptions: Record<string, string> = {
  Action: "High-intensity set pieces and kinetic storytelling.",
  Adventure: "Quest-driven stories with world-scale stakes.",
  Animation: "Stylized visual worlds with broad emotional range.",
  Comedy: "Timing-driven narratives built for delight and release.",
  Crime: "Power, morality, and consequence in tension.",
  Drama: "Character-first storytelling and emotional precision.",
  Fantasy: "Mythic systems, alternate rules, and wonder.",
  Horror: "Fear architecture built through sound, frame, and pacing.",
  Mystery: "Layered clues, misdirection, and revelation.",
  Noir: "Moral ambiguity, shadows, and fatal momentum.",
  Romance: "Intimacy, longing, and transformative connection.",
  "Sci-Fi": "Speculative ideas expressed through cinematic scale.",
  Thriller: "Escalating pressure and high-stakes uncertainty.",
};

export default function GenresPage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 md:px-10 py-28">
      <section className="mx-auto max-w-7xl">
        <div className="mb-12 md:mb-14">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/30">
            Genre Wall
          </p>
          <h1 className="mt-3 text-4xl md:text-6xl font-semibold tracking-tight">
            Explore Every Mood and Category
          </h1>
          <p className="mt-4 max-w-3xl text-base md:text-lg text-white/55 leading-relaxed">
            A full-screen portal to movie genres, optimized for fast visual discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {movieHomeContent.genres.map((genre, index) => (
            <Link
              key={genre}
              href={`/search?genre=${encodeURIComponent(genre)}`}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/80 px-6 py-7 shadow-[0_24px_70px_rgba(0,0,0,0.38)] transition-transform duration-500 hover:-translate-y-1 hover:border-white/20"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_35%)]" />
              <div className="relative z-10">
                <div className="text-[10px] font-black uppercase tracking-[0.32em] text-white/30">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-white">
                  {genre}
                </h2>
                <p className="mt-4 text-sm md:text-base leading-relaxed text-white/55">
                  {genreDescriptions[genre] || "Curated discovery picks from this genre."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

