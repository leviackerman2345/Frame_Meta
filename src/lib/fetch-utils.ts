const DEFAULT_TIMEOUT_MS = 5000;

/**
 * Thin wrapper around fetch() that aborts after `timeoutMs` milliseconds.
 * Prevents third-party API calls from hanging indefinitely.
 * The AbortController timer is always cleared in .finally() to prevent leaks.
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit & { next?: { revalidate?: number } } = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}
