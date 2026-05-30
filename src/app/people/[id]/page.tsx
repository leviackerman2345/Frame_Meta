import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPersonBasicInfo, getPersonCredits } from "@/lib/tmdb";
import { getCuratedPersonById } from "@/constants/people";
import { PersonDetailClient } from "@/components/people/PersonDetailClient";
import { SectionErrorBoundary } from "@/components/actor/SectionErrorBoundary";

export const revalidate = 3600; // Cache individual profile pages for 1 hour

interface PageProps {
  params: Promise<{ id: string }>;
}

// Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const person = await getPersonBasicInfo(id);
    if (!person || !person.name) {
      return {
        title: "Artist Profile — FrameMeta",
        description: "Explore artist filmography and visual signatures.",
      };
    }

    const curated = getCuratedPersonById(id);
    const roleText = curated ? curated.role : person.known_for_department || "Artist";
    const awardText = curated ? ` (${curated.awardsBadge.split("•")[0]?.trim()})` : "";

    return {
      title: `${person.name} — ${roleText}${awardText} | FrameMeta`,
      description: person.biography
        ? `${person.name}'s dynamic filmography and visual styles. Bio: ${person.biography.substring(0, 150)}...`
        : `Explore the dynamic profile, films, visual style tags, and frequent collaborators of filmmaker and artist ${person.name} on FrameMeta.`,
    };
  } catch {
    return {
      title: "Artist Profile — FrameMeta",
    };
  }
}

// Asynchronous Segment Fetcher that hydrates the presentation container
async function HydratedProfile({ id }: { id: string }) {
  const [person, credits] = await Promise.all([
    getPersonBasicInfo(id),
    getPersonCredits(id),
  ]);

  if (!person || !person.id) {
    notFound();
  }

  const curated = getCuratedPersonById(id);

  return (
    <PersonDetailClient
      person={person}
      movieCredits={credits.movieCredits || { cast: [], crew: [] }}
      tvCredits={credits.tvCredits || { cast: [], crew: [] }}
      curatedData={curated}
    />
  );
}

// Fallback profile skeleton
function ProfileSkeleton() {
  return (
    <div className="w-full min-h-screen bg-black text-white pt-32 pb-16 animate-pulse">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-12 items-start">
        <div className="w-full md:w-[360px] aspect-[3/4] rounded-[2.5rem] bg-white/5 border border-white/10 shrink-0" />
        <div className="flex-1 flex flex-col gap-6 w-full items-start">
          <div className="h-4 w-32 bg-white/10 rounded-full" />
          <div className="h-16 w-3/4 bg-white/10 rounded-2xl" />
          <div className="h-6 w-1/2 bg-white/5 rounded-lg" />
          <div className="space-y-3 w-full pt-4">
            <div className="h-4 w-full bg-white/5 rounded" />
            <div className="h-4 w-full bg-white/5 rounded" />
            <div className="h-4 w-5/6 bg-white/5 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ArtistDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-black text-white pb-16">
      <SectionErrorBoundary label="Artist profile container">
        <Suspense fallback={<ProfileSkeleton />}>
          <HydratedProfile id={id} />
        </Suspense>
      </SectionErrorBoundary>
    </main>
  );
}
