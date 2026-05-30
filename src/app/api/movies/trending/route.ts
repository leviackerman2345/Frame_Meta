import { NextResponse } from "next/server";
import { getTrendingMovies } from "@/lib/tmdb";
import { enforceRateLimit } from "@/lib/api-guard";
export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET(request: Request) {
  const rateLimited = enforceRateLimit(request, "api:movies:trending", 60, 60_000);
  if (rateLimited) return rateLimited;

  try {
    const data = await getTrendingMovies("day");
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Failed to fetch trending movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending movies" },
      { status: 500 }
    );
  }
}
