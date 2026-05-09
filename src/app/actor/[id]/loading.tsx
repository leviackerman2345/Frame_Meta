/**
 * WHY THIS FILE RETURNS NULL
 * --------------------------
 * CastCard uses a background fetch pattern: it pre-fetches the actor page HTML
 * and forces the ISR cache to populate BEFORE calling window.location.href.
 * By the time the browser navigates, the page is already fully cached and
 * renders instantly from the ISR cache — there is no actual loading period.
 *
 * If this file returned a spinner, Next.js would still flash it for one frame
 * during the navigation handoff even though the page is already ready. Returning
 * null suppresses that flash entirely and makes the transition seamless.
 *
 * The Suspense skeletons inside page.tsx still handle slow data-fetching
 * gracefully — this file only controls the route-level shell loading state.
 */
export default function Loading() {
  return null;
}
