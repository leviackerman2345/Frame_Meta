import type { Metadata } from "next";
import { PeopleIndexClient } from "@/components/people/PeopleIndexClient";
import { curatedPeople } from "@/constants/people";
import { getTrendingPeople, getPopularPeople } from "@/lib/tmdb";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "The Visionaries — FrameMeta",
  description:
    "Discover the minds behind the camera, the masters of light, screenwriting pioneers, and chameleonic actors shaping modern cinema at FrameMeta.",
};

export default async function PeoplePage() {
  let trendingPeople: any[] = [];
  let popularPeople: any[] = [];

  try {
    [trendingPeople, popularPeople] = await Promise.all([
      getTrendingPeople(16),
      getPopularPeople(20),
    ]);
  } catch (error) {
    console.error("Failed to fetch people for index page:", error);
  }

  return (
    <main className="min-h-screen bg-black text-white pb-16">
      <h1 className="sr-only">
        The Visionaries — Directors, Cinematographers, and Creative Minds behind
        the Frame
      </h1>
      <PeopleIndexClient
        curatedPeople={curatedPeople}
        trendingPeople={trendingPeople}
        popularPeople={popularPeople}
      />
    </main>
  );
}
