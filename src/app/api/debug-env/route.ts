import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const routeKey = process.env.DEBUG_ENV_ROUTE_KEY;
  const providedKey = request.headers.get("x-debug-env-key");
  const debugEnabled = process.env.ENABLE_DEBUG_ENV_ROUTE === "true";

  if (!debugEnabled || !routeKey || providedKey !== routeKey) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const nodeEnv = process.env.NODE_ENV;
  const vercelEnv = process.env.VERCEL_ENV;
  const tmdbToken = process.env.TMDB_ACCESS_TOKEN;
  const nytKey = process.env.NYT_API_KEY;
  const omdbKey = process.env.OMDB_API_KEY;

  return NextResponse.json({
    nodeEnv,
    vercelEnv,
    tmdbTokenPresent: !!tmdbToken,
    tmdbTokenLength: tmdbToken?.length ?? 0,
    tmdbTokenFirst4: tmdbToken?.substring(0, 4) ?? "N/A",
    nytKeyPresent: !!nytKey,
    omdbKeyPresent: !!omdbKey,
  });
}
