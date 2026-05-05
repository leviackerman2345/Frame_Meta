import Image from "next/image";
import Link from "next/link";
import { homeContent } from "@/constants/home";
import { createInfiniteScrollData } from "@/lib/carousel";
import type { Partner } from "@/types/types";

export function Partners() {
  const { heading, items } = homeContent.partners;
  const scrollingPartners = createInfiniteScrollData<Partner>(items);

  return (
    <section className="relative w-full max-w-[100vw] overflow-hidden mx-auto py-24 z-20">
      <div className="flex flex-col items-center text-center mb-16 px-6">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4 drop-shadow-lg leading-tight font-sans">
          {heading.title}
        </h2>
        <p className="text-zinc-300 text-lg md:text-xl font-normal mb-2 drop-shadow-md max-w-2xl leading-relaxed font-sans">
          {heading.subtitle}
        </p>
      </div>

      {/* Automatic Clickable Carousel */}
      <div className="w-full relative flex group/carousel mt-4">
        {/* Double container for seamless effect. Pauses on hover. */}
        <div className="flex gap-4 md:gap-6 px-4 animate-infinite-scroll">
          {scrollingPartners.map((partner, index) => (
            <Link
              key={`${partner.name}-${index}`}
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer"
              title={partner.name}
              className="shrink-0 group block"
            >
              <div className="w-auto h-17.5 md:h-20 bg-zinc-900/30 backdrop-blur-md border border-white/10 rounded-2xl px-6 md:px-8 flex items-center justify-center gap-4 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-800/50 hover:border-white/20 hover:shadow-[0_10px_30px_rgba(255,255,255,0.06)] active:scale-95">
                <Image
                  src={partner.logo}
                  alt={`${partner.name} Logo`}
                  width={120}
                  height={32}
                  className={`h-6 md:h-8 w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 ${partner.customImgClass || ""}`}
                  loading="lazy"
                  draggable={false}
                />
                <div className="w-px h-6 bg-white/10 hidden md:block" />
                <h3 className="text-zinc-400 font-medium text-sm md:text-base group-hover:text-white transition-colors font-sans tracking-wide">
                  {partner.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Decorative gradient Fades */}
      <div className="absolute top-0 left-0 w-32 h-full bg-linear-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-full bg-linear-to-l from-black to-transparent z-10 pointer-events-none" />
    </section>
  );
}
