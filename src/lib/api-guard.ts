import { NextResponse } from "next/server";

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_MAX_REQUESTS = 60;
const DEFAULT_MAX_PAGE = 50;
const DEFAULT_MAX_QUERY_LENGTH = 100;
const MAX_RATE_LIMIT_KEYS = 10_000;

function getClientIp(request: Request): string {
  // On Vercel, x-real-ip is set by the platform and is not spoofable.
  const vercelIp = request.headers.get("x-real-ip");
  if (vercelIp) return vercelIp;

  // On other platforms, take the LAST entry in x-forwarded-for
  // (rightmost = closest to server, hardest for clients to spoof).
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const parts = forwardedFor.split(",");
    const last = parts[parts.length - 1]?.trim();
    if (last) return last;
  }

  // Last-resort: combine user-agent length + first char for rate limit bucketing.
  const ua = request.headers.get("user-agent") || "ua-missing";
  return `unknown:${ua.length}:${ua.charCodeAt(0)}`;
}

function pruneRateLimitStore(now: number) {
  // Remove expired buckets first.
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }

  // Hard bound memory in pathological traffic patterns.
  if (rateLimitStore.size <= MAX_RATE_LIMIT_KEYS) return;

  const entries = Array.from(rateLimitStore.entries()).sort(
    (a, b) => a[1].resetAt - b[1].resetAt
  );
  const toDelete = rateLimitStore.size - MAX_RATE_LIMIT_KEYS;
  for (let i = 0; i < toDelete; i++) {
    rateLimitStore.delete(entries[i][0]);
  }
}

export function enforceRateLimit(
  request: Request,
  scope: string,
  maxRequests: number = DEFAULT_MAX_REQUESTS,
  windowMs: number = DEFAULT_WINDOW_MS
): NextResponse | null {
  const ip = getClientIp(request);
  const now = Date.now();
  pruneRateLimitStore(now);
  const key = `${scope}:${ip}`;
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (current.count >= maxRequests) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  current.count += 1;
  rateLimitStore.set(key, current);
  return null;
}

export function sanitizePage(
  rawPage: string | null,
  maxPage: number = DEFAULT_MAX_PAGE
): number {
  const parsed = parseInt(rawPage || "1", 10);
  const page = Number.isNaN(parsed) ? 1 : parsed;
  return Math.min(maxPage, Math.max(1, page));
}

export function sanitizeQuery(
  value: string | null,
  maxLength: number = DEFAULT_MAX_QUERY_LENGTH
): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const clipped = trimmed.slice(0, maxLength);
  const allowed = /^[\p{L}\p{N}\s.,:;'!?\-_/&()]+$/u.test(clipped);
  if (!allowed) return null;
  return clipped;
}
