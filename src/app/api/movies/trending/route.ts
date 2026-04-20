import { NextResponse } from "next/server";
import { getTrendingMovies } from "@/lib/tmdb";

export async function GET() {
  try {
    const data = await getTrendingMovies("day");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch trending movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending movies" },
      { status: 500 }
    );
  }
}
