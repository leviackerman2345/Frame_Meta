import Image from "next/image";
import Link from "next/link";
import { homeContent } from "@/constants/home";
import { createInfiniteScrollData } from "@/lib/carousel";
import type { Partner } from "@/types/types";

export function Partners() {
  const { heading, items } = homeContent.partners;
  const scrollingPartners = createInfiniteScrollData<Partner>(items);

  return (
    <section className="relative w-full overflow-hidden mx-auto py-24 z-20">
      <div className="flex flex-col items-center text-center mb-12 px-6">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-3">
          {heading.title}
        </h2>
        <p className="text-zinc-400 text-sm md:text-base max-w-xl leading-relaxed">
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
              <div className="w-auto h-16 md:h-18 bg-white/[0.03] border border-white/[0.06] rounded-xl px-6 md:px-8 flex items-center justify-center gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.06] hover:border-white/[0.1] cursor-pointer">
                <Image
                  src={partner.logo}
                  alt={`${partner.name} Logo`}
                  width={120}
                  height={32}
                  className={`h-5 md:h-7 w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 ${partner.customImgClass || ""}`}
                  loading="lazy"
                  draggable={false}
                />
                <div className="w-px h-5 bg-white/[0.06] hidden md:block" />
                <h3 className="text-zinc-500 font-medium text-sm group-hover:text-zinc-200 transition-colors">
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
