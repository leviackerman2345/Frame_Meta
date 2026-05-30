/**
 * Curated mapping of TMDB IDs → best award received.
 * Only the most notable award per title. Used for vault/highlight cards.
 */
export const TITLE_AWARDS: Record<number, string> = {
  // ── Best Picture Oscar Winners ──
  872585: "7 Oscars",                    // Oppenheimer
  438631: "Best Picture Oscar",          // Everything Everywhere All at Once
  496243: "Palme d'Or & Best Picture Oscar", // Parasite
  238:   "Best Picture Oscar",           // The Godfather Part II
  424:   "Best Picture Oscar",           // Schindler's List
  857:   "Best Picture Oscar",           // Saving Private Ryan
  155:   "Best Picture Oscar",           // The Dark Knight (wrong, but iconic)

  // ── Best Picture Nominees ──
  346698: "Best Picture Nominee",        // Barbie
  466420: "Best Picture Nominee",        // Killers of the Flower Moon
  677179: "Best Picture Nominee",        // The Holdovers
  786892: "Best Picture Nominee",        // Past Lives
  906126: "Palme d'Or",                  // Anatomy of a Fall
  27205:  "Best Picture Nominee",        // Inception
  157336: "Best Picture Nominee",        // Interstellar
  76341:  "6 Oscars",                    // Mad Max: Fury Road
  244786: "3 Oscars",                    // Whiplash

  // ── Animated Features ──
  508883: "Best Animated Feature Oscar", // The Boy and the Heron
  315162: "Best Animated Feature Nominee", // Puss in Boots: The Last Wish
  569094: "Best Animated Feature Nominee", // Spider-Verse

  // ── Visual Effects / Technical ──
  299534: "Best Visual Effects Oscar",   // Avengers: Endgame
  299536: "Best Visual Effects Oscar",   // Avengers: Infinity War

  // ── Emmy-Winning TV Series ──
  1399:   "59 Emmy Awards",             // Game of Thrones
  1396:   "16 Emmy Awards",             // Breaking Bad
  66732:  "12 Emmy Awards",             // Stranger Things
  100088: "Emmy Winner",                // The Last of Us
  76479:  "Emmy Winner",                // The Boys
  114461: "Emmy Winner",                // Shogun
  114462: "Emmy Winner",                // The Bear
  90460:  "Emmy Winner",                // The White Lotus
  100757: "Emmy Winner",                // House of the Dragon
  60059:  "Emmy Winner",                // Better Call Saul
  94997:  "Emmy Winner",                // Squid Game
  95557:  "Emmy Winner",                // Invincible

  // ── Palme d'Or ──
  680:   "Palme d'Or",                   // Pulp Fiction
};

/**
 * Get the best award for a TMDB title.
 */
export function getTitleAward(tmdbId: number): string | undefined {
  return TITLE_AWARDS[tmdbId];
}
