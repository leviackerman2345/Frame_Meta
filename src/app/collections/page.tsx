import React from "react";
import { getDiscoverableCollections } from "@/lib/tmdb";
import { CollectionsClient } from "./CollectionsClient";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

// Revalidate every hour — the expensive pipeline result is also cached in memory,
// so most visitors get an instant response after the first build.
export const revalidate = 3600;

export default async function CollectionsPage() {
  // Fetch all collections on the server
  const collections = await getDiscoverableCollections(80);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Header - Apple Style */}
        <header className="mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Collections
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
            Explore the greatest cinematic universes, legendary franchises, and epic sagas in film history.
          </p>
        </header>

        {/* Client-side Filtering and Grid */}
        <CollectionsClient initialCollections={collections} />
      </div>

      <Footer />
    </main>
  );
}
