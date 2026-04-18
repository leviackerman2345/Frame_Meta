import Image from "next/image";
import { Play, Plus } from "lucide-react";
import { featuredMovie, heroButtons } from "@/config/site-content";

export function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-end">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={featuredMovie.backgroundImage}
          alt={featuredMovie.backgroundAlt}
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
        {/* Dark Vignette / Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-24 md:px-12 flex flex-col gap-6">
        {/* Movie Logo / Title */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white bg-white/20 backdrop-blur-md rounded-full border border-white/10">
              {featuredMovie.badge}
            </span>
            <span className="flex items-center gap-1 text-sm font-medium text-zinc-300">
              <span className="text-yellow-500">★</span> {featuredMovie.rating}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4 drop-shadow-lg leading-tight">
            {featuredMovie.title}
          </h1>
          
          <p className="text-zinc-300 text-lg md:text-xl font-medium mb-8 drop-shadow-md line-clamp-3 leading-relaxed">
            {featuredMovie.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-black rounded-full font-semibold text-lg hover:bg-zinc-200 transition-all duration-300 hover:scale-105 shadow-xl">
              <Play className="w-5 h-5 fill-black" strokeWidth={1} />
              {heroButtons.watchNow}
            </button>
            <button 
              className="flex items-center justify-center gap-2 p-3.5 bg-zinc-600/30 backdrop-blur-md border border-white/10 text-white rounded-full font-medium transition-all hover:bg-zinc-600/60 hover:scale-105 hover:border-white/30 group"
              aria-label={heroButtons.addToWishlist}
            >
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
