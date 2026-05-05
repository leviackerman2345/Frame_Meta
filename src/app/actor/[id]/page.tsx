import { getPersonDetails } from "@/lib/tmdb";
import { getNewsByQuery } from "@/lib/news";
import { featuredNewsData } from "@/constants/news";
import { ArtistHero } from "@/components/actor/ArtistHero";
import { ArtistDescription } from "@/components/actor/ArtistDescription";
import { ArtistFilmography } from "@/components/actor/ArtistFilmography";
import { ArtistFeaturedNews } from "@/components/actor/ArtistFeaturedNews";
import { NewsArticle } from "@/types/types";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Artist Profile Page
 * 
 * Composes the artist profile using 5 key components in a specific order:
 * 1. ArtistHero
 * 2. ArtistDescription
 * 3. ArtistAwards (Currently omitted as component is pending)
 * 4. ArtistFilmography
 * 5. ArtistFeaturedNews
 * 
 * Phase 5 completion: Final assembly.
 */
export default async function ArtistPage({ params }: PageProps) {
  const { id } = await params;
  const person = await getPersonDetails(id);

  if (!person || !person.id) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-zinc-500 font-bold uppercase tracking-widest">Artist not found</p>
      </div>
    );
  }

  // Fetch news articles filtered by artist name
  const dynamicNews = await getNewsByQuery(person.name, 6);
  const newsItems = dynamicNews.length > 0 ? dynamicNews : featuredNewsData.slice(0, 6);
  
  // Map NewsItem (from lib/news.ts) to NewsArticle (as required by ArtistFeaturedNews)
  const articles: NewsArticle[] = newsItems.map((item) => ({
    id: item.id.toString(),
    title: item.title,
    excerpt: item.description || "",
    url: item.slug ? `/news/${item.slug}` : (item.url || "#"),
    source: item.source,
    publishedAt: item.date, // news.ts returns formatted date string
    thumbnailUrl: item.imageUrl || "",
  }));

  // Extract profile images for the hero section
  const profileImages = person.images?.profiles?.map((p: any) => p.file_path) || [];
  if (person.profile_path && !profileImages.includes(person.profile_path)) {
    profileImages.unshift(person.profile_path);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* 1. ArtistHero */}
      <ArtistHero 
        name={person.name} 
        profileImages={profileImages} 
        department={person.known_for_department}
        placeOfBirth={person.place_of_birth}
        birthday={person.birthday}
        deathday={person.deathday}
        externalIds={person.external_ids || {}}
        movieCredits={person.movie_credits || { cast: [], crew: [] }}
        tvCredits={person.tv_credits || { cast: [], crew: [] }}
      />
      
      {/* 2. ArtistDescription */}
      <ArtistDescription
        biography={person.biography}
        deathday={person.deathday}
        movieCredits={person.movie_credits || { cast: [], crew: [] }}
        tvCredits={person.tv_credits || { cast: [], crew: [] }}
      />

      {/* 3. ArtistAwards (Hidden if empty/missing) */}
      {/* Pending implementation of Phase 3 component */}

      {/* 4. ArtistFilmography */}
      <ArtistFilmography 
        movieCredits={person.movie_credits || { cast: [], crew: [] }} 
        tvCredits={person.tv_credits || { cast: [], crew: [] }} 
      />

      {/* 5. ArtistFeaturedNews */}
      <ArtistFeaturedNews 
        name={person.name} 
        articles={articles} 
      />

      <Footer />
    </main>
  );
}
