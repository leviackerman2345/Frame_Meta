import type { MovieCard } from "@/types/types";
import { MediaCard } from "@/components/ui/MediaCard";
import { SectionHeader } from "@/components/sections/SectionHeader";

interface AsianSpotlightSectionProps {
  filipinoItems: MovieCard[];
  koreanItems: MovieCard[];
  animeItems: MovieCard[];
}

function Strip({
  label,
  subtitle,
  items,
}: {
  label: string;
  subtitle: string;
  items: MovieCard[];
}) {
  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.22em] text-white/30">
            {label}
          </p>
          <p className="mt-1 text-sm text-white/55">{subtitle}</p>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 custom-scrollbar snap-x snap-mandatory px-1 scroll-smooth">
          {items.map((item) => (
            <MediaCard key={item.id} data={item} variant="slider" />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-8 text-sm text-white/45">
          No titles match the current filters.
        </div>
      )}
    </div>
  );
}

export function AsianSpotlightSection({
  filipinoItems,
  koreanItems,
  animeItems,
}: AsianSpotlightSectionProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-12 py-10 relative z-20">
      <SectionHeader
        title="The Asian Spotlight"
        subtitle="Filipino cinema, Korean drama, and anime selected for regional depth."
        layout="split"
      />

      <div className="space-y-10">
        <Strip
          label="Filipino"
          subtitle="Local stories and standout Filipino films."
          items={filipinoItems}
        />
        <Strip
          label="K-Dramas"
          subtitle="Korean series with strong emotional pull."
          items={koreanItems}
        />
        <Strip
          label="Anime"
          subtitle="Stylized worlds with a strong visual identity."
          items={animeItems}
        />
      </div>
    </section>
  );
}
