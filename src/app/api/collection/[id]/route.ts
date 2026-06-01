import { NextResponse } from "next/server";
import { fetchFromTMDB, getTMDBImageUrl, getTitleLogo } from "@/lib/tmdb";
import { enforceRateLimit } from "@/lib/api-guard";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimitResponse = enforceRateLimit(request, "collection", 30);
  if (rateLimitResponse) return rateLimitResponse;

  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  if (isNaN(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid collection ID" }, { status: 400 });
  }

  try {
    const collection = await fetchFromTMDB(`/collection/${String(id)}?language=en-US`);
    
    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    const today = new Date().toISOString().split("T")[0];
    const releasedParts = (collection.parts || []).filter((p: any) => (p.release_date || p.first_air_date) && (p.release_date || p.first_air_date) <= today);
    const logoUrl = await getTitleLogo(id, "collection").catch(() => null);

    const formattedParts = releasedParts.map((p: any) => ({
      id: p.id,
      title: p.title || p.name,
      description: p.overview,
      posterUrl: getTMDBImageUrl(p.poster_path, "w500"),
      backdropUrl: getTMDBImageUrl(p.backdrop_path, "original"),
      rating: Math.round((p.vote_average || 0) * 10) / 10,
      year: new Date(p.release_date || p.first_air_date).getFullYear(),
      genre: "Movie", // Simplified
      type: "movie"
    }));

    return NextResponse.json({
      id: collection.id,
      title: collection.name,
      overview: collection.overview,
      backdropUrl: getTMDBImageUrl(collection.backdrop_path, "original"),
      logoUrl,
      parts: formattedParts,
      rating: Math.round((formattedParts.reduce((acc: number, p: any) => acc + (p.rating || 0), 0) / formattedParts.length) * 10) / 10
    });
  } catch (error) {
    console.error("Collection API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
