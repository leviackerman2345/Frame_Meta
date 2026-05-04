import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const nodeEnv = process.env.NODE_ENV;
  const vercelEnv = process.env.VERCEL_ENV; // "production", "preview", or "development"

  // Strictly block in production — never expose env metadata publicly
  if (nodeEnv === "production" || vercelEnv === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const tmdbToken = process.env.TMDB_ACCESS_TOKEN;
  const nytKey = process.env.NYT_API_KEY;
  const omdbKey = process.env.OMDB_API_KEY;

  return NextResponse.json({
    nodeEnv,
    vercelEnv,
    // Only expose presence and masked preview — never the full value
    tmdbTokenPresent: !!tmdbToken,
    tmdbTokenLength: tmdbToken?.length ?? 0,
    tmdbTokenFirst4: tmdbToken?.substring(0, 4) ?? "N/A",
    nytKeyPresent: !!nytKey,
    omdbKeyPresent: !!omdbKey,
  });
}
