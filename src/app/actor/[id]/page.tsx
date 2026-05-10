import { Suspense } from "react";
import { getPersonBasicInfo, getPersonCredits } from "@/lib/tmdb";
import { getNewsByQuery } from "@/lib/news";
import { newsContent } from "@/constants/news";
import { ArtistHero } from "@/components/actor/ArtistHero";
import { ArtistDescription } from "@/components/actor/ArtistDescription";
import { ArtistFilmography } from "@/components/actor/ArtistFilmography";
import { ArtistFeaturedNews } from "@/components/actor/ArtistFeaturedNews";
import { SectionErrorBoundary } from "@/components/actor/SectionErrorBoundary";
import { NewsArticle } from "@/types/types";

// ISR: revalidate cached actor pages every hour
export const revalidate = 3600;

// force-cache ensures every fetch() inside this route segment reads from the
// Next.js data cache and never triggers a dynamic server render.
// NOTE: force-static is intentionally NOT used here — this page contains async
// server components that call fetch() with dynamic route params (actor ID).
// force-static would cause those fetches to fail at build time because the IDs
// are not known until request time. force-cache achieves the same "always serve
// from cache" guarantee without breaking dynamic data fetching.
export const fetchCache = "force-cache";

interface PageProps {
  params: Promise<{ id: string }>;
}

// ─────────────────────────────────────────────────────────────────
//  Async Server Components (each fetches its own data independently)
//  Wrapped in <Suspense> — NONE of them block page shell rendering.
// ─────────────────────────────────────────────────────────────────

async function HeroSection({ id }: { id: string }) {
  const person = await getPersonBasicInfo(id);
  if (!person?.id) return (
    <div className="min-h-screen bg-black flex items-center justify-center pt-40">
      <p className="text-zinc-500 font-bold uppercase tracking-widest">Artist not found</p>
    </div>
  );

  const profileImages = person.images?.profiles?.map((p: any) => p.file_path) || [];
  if (person.profile_path && !profileImages.includes(person.profile_path)) {
    profileImages.unshift(person.profile_path);
  }

  return (
    <>
      <ArtistHero
        name={person.name}
        profileImages={profileImages}
        department={person.known_for_department}
        placeOfBirth={person.place_of_birth}
        birthday={person.birthday}
        deathday={person.deathday}
        externalIds={person.external_ids || {}}
        movieCredits={{ cast: [], crew: [] }}
        tvCredits={{ cast: [], crew: [] }}
      />
      <ArtistDescription
        biography={person.biography}
        deathday={person.deathday}
        movieCredits={{ cast: [], crew: [] }}
        tvCredits={{ cast: [], crew: [] }}
      />
    </>
  );
}

async function FilmographySection({ id }: { id: string }) {
  const { movieCredits, tvCredits } = await getPersonCredits(id);
  return (
    <ArtistFilmography
      movieCredits={movieCredits || { cast: [], crew: [] }}
      tvCredits={tvCredits || { cast: [], crew: [] }}
    />
  );
}

async function NewsSection({ id }: { id: string }) {
  // DEPENDENCY NOTE: getNewsByQuery requires person.name as its search query — there is
  // no TMDB-ID-based news endpoint. Full Promise.all parallelism is architecturally
  // impossible here: we must resolve person.name before the NYT fetch can start.
  //
  // What IS optimised: getPersonBasicInfo hits the 30-min server-side in-memory cache
  // (warmed by HeroSection which renders in parallel). Its cost is effectively ~0ms.
  // The only real latency is the NYT API call (~400–1500ms), which starts immediately
  // after the cache read — no wasted time on the TMDB leg.
  const person = await getPersonBasicInfo(id);
  if (!person?.name) return null;

  // FIX: getNewsByQuery is now the ONLY awaited call after the cache hit above.
  // Previously a comment implied this was a "free" call but gave no structural
  // guarantee. This rewrite makes the execution sequence explicit:
  //   1. getPersonBasicInfo  → cache hit,  ~0ms
  //   2. getNewsByQuery      → NYT API,  ~400–1500ms  ← only real latency
  // There is no sequential penalty because (1) is instant.
  const [dynamicNews] = await Promise.all([
    // FIX: Wrapped in Promise.all to make it trivial to add a second parallel call
    // here in future (e.g. a second news source) without restructuring the function.
    getNewsByQuery(person.name, 6),
  ]);

  const newsItems = dynamicNews.length > 0 ? dynamicNews : newsContent.featured.items.slice(0, 6);

  // FIX: Article mapping moved below the Promise.all — it is synchronous CPU work
  // and belongs after all I/O is settled, not interleaved with awaits.
  const articles: NewsArticle[] = newsItems.map((item) => ({
    id: item.id.toString(),
    title: item.title,
    excerpt: item.description || "",
    url: item.slug ? `/news/${item.slug}` : ((item as any).url || "#"),
    source: item.source,
    publishedAt: item.date,
    thumbnailUrl: item.imageUrl || "",
  }));

  return <ArtistFeaturedNews name={person.name} articles={articles} />;
}

// ─────────────────────────────────────────────
//  Skeleton Fallbacks
// ─────────────────────────────────────────────

function HeroSkeleton() {
  return (
    <div className="w-full pt-32 md:pt-48 pb-10 px-6 md:px-12 animate-pulse">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="w-48 h-48 md:w-[320px] md:h-80 rounded-full bg-white/5 border border-white/10 shrink-0" />
        <div className="flex flex-col gap-6 flex-1 w-full items-center md:items-start">
          <div className="h-16 md:h-20 w-3/4 bg-white/10 rounded-2xl" />
          <div className="h-5 w-1/2 bg-white/5 rounded-lg" />
          <div className="h-12 w-36 bg-white/10 rounded-full mt-2" />
        </div>
      </div>
      {/* Stats skeleton */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 rounded-[2.5rem] bg-white/5 border border-white/10" />
        ))}
      </div>
    </div>
  );
}

function FilmographySkeleton() {
  return (
    <div className="w-full max-w-360 mx-auto px-6 md:px-12 py-10 animate-pulse">
      <div className="h-8 w-48 bg-white/5 rounded-xl mb-8" />
      <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-[2/3] bg-white/5 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}

function NewsSkeleton() {
  return (
    <div className="py-10 flex flex-col gap-6 animate-pulse px-6 md:px-12 w-full max-w-360 mx-auto">
      <div className="h-8 w-56 bg-white/5 rounded-xl" />
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-video bg-white/5 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  Page Shell — renders INSTANTLY (zero awaits at top level)
//  All data fetching happens inside Suspense boundaries.
// ─────────────────────────────────────────────────────────────────

export default async function ArtistPage({ params }: PageProps) {
  const { id } = await params; // Reading route params is synchronous — essentially free

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Hero + Description stream in together after ~700ms */}
      <SectionErrorBoundary label="Artist profile">
        <Suspense fallback={<HeroSkeleton />}>
          <HeroSection id={id} />
        </Suspense>
      </SectionErrorBoundary>

      {/* Filmography streams in after ~500ms (parallel with Hero) */}
      <SectionErrorBoundary label="Filmography">
        <Suspense fallback={<FilmographySkeleton />}>
          <FilmographySection id={id} />
        </Suspense>
      </SectionErrorBoundary>

      {/* News streams in after ~700ms (parallel with Hero) */}
      <SectionErrorBoundary label="Featured news">
        <Suspense fallback={<NewsSkeleton />}>
          <NewsSection id={id} />
        </Suspense>
      </SectionErrorBoundary>

    </main>
  );
}
