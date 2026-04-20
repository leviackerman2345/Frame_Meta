import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const tmdbToken = process.env.TMDB_ACCESS_TOKEN;
  const tmdbPublic = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
  const newsKey = process.env.NEWS_API_KEY;
  const nodeEnv = process.env.NODE_ENV;
  const vercelEnv = process.env.VERCEL_ENV; // "production", "preview", or "development"

  return NextResponse.json({
    nodeEnv,
    vercelEnv,
    tmdbTokenPresent: !!tmdbToken,
    tmdbTokenLength: tmdbToken?.length ?? 0,
    tmdbTokenFirst4: tmdbToken?.substring(0, 4) ?? "N/A",
    tmdbPublicPresent: !!tmdbPublic,
    newsKeyPresent: !!newsKey,
  });
}
