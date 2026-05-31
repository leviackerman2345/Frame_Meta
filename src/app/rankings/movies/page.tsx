import { ContentPage } from "@/components/ui/ContentPage";

export default function RankingsMoviesPage() {
  return (
    <ContentPage
      title="Movie Rankings"
      category="Rankings"
      description="Definitive movie rankings that blend critic consensus, audience sentiment, technical quality, and cultural longevity into a single authoritative score — updated in real time."
      sections={[
        {
          heading: "Our Methodology",
          body: "FrameMeta rankings are built on a multi-dimensional scoring system that goes beyond simple averages. We normalize scores from multiple sources, weight them by relevance and recency, and factor in technical presentation quality to produce rankings that reflect both critical merit and real-world watchability.",
          list: [
            "TMDB weighted average — the foundation, normalized to a 0–100 scale.",
            "Metacritic score — professional critic consensus, weighted at 1.5x for depth of analysis.",
            "Rotten Tomatoes — Tomatometer (fresh/rotten ratio) and audience score, each weighted separately.",
            "Technical quality — 4K, HDR, Dolby Vision, and Dolby Atmos availability as quality multipliers.",
            "Recency decay — newer titles receive a slight boost; older titles are penalized only if cultural relevance has faded.",
          ],
        },
        {
          heading: "Ranking Categories",
          body: "We maintain separate ranking views to match how you actually think about movies:",
          list: [
            "All-Time — the definitive ranking of cinema history, from silent films to today.",
            "This Year — the best films released in the current calendar year.",
            "By Genre — quality-ranked within each genre, from action to documentary.",
            "By Decade — the best films of each era, weighted for historical context.",
            "By Platform — the best films available on each streaming service.",
            "Hidden Gems — high-quality films with low viewership that deserve more attention.",
          ],
        },
        {
          heading: "Why Rankings Matter",
          body: "In an era of algorithmic recommendations optimized for engagement, FrameMeta rankings are optimized for quality. We don't boost titles because they're new, because they have marketing budgets, or because they generate clicks. A 1994 film with a 95 Metacritic score ranks above a 2025 blockbuster with a 62 — because quality is timeless.",
        },
      ]}
      footer="Rankings are recalculated daily. Methodology last reviewed: May 2026."
    />
  );
}
