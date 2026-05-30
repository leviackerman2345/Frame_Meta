import { NextResponse } from "next/server";
import { discoverByGenre } from "@/lib/tmdb";
import { enforceRateLimit, sanitizePage, sanitizeQuery } from "@/lib/api-guard";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET(request: Request) {
  const rateLimited = enforceRateLimit(request, "api:discover", 45, 60_000);
  if (rateLimited) return rateLimited;

  const { searchParams } = new URL(request.url);
  const genre = sanitizeQuery(searchParams.get("genre"), 40) || "";
  const page = sanitizePage(searchParams.get("page"));

  if (!genre) {
    return NextResponse.json(
      { error: "Invalid or empty genre." },
      { status: 400 }
    );
  }

  try {
    const data = await discoverByGenre(genre, page);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Failed to discover titles:", error);
    return NextResponse.json(
      { error: "Failed to discover titles" },
      { status: 500 }
    );
  }
}
