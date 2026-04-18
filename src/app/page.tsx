import { Hero } from "@/components/sections/Hero";
import { Partners } from "@/components/sections/Partners";
import { trendingHeading } from "@/config/site-content";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 w-full bg-black font-sans">
      <Hero />
      <Partners />

      {/* Trending Section Placeholder */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12 relative z-20 pt-8">
        <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-md">{trendingHeading.title}</h2>
        <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar snap-x">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="min-w-[200px] md:min-w-[240px] h-[300px] md:h-[360px] bg-zinc-800/60 backdrop-blur-sm border border-white/5 rounded-2xl shadow-xl snap-start relative overflow-hidden group cursor-pointer"
            >
              {/* Placeholder Image Layer */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-900 group-hover:scale-105 transition-transform duration-500" />

              {/* Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <div className="h-4 w-1/2 bg-white/20 rounded mb-2" />
                <div className="h-3 w-1/3 bg-white/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
