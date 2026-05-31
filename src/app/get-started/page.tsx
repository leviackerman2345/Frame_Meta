import { ContentPage } from "@/components/ui/ContentPage";

export default function GetStartedPage() {
  return (
    <ContentPage
      title="Get Started"
      category="Feature"
      description="Your personalized cinematic journey begins the moment you tell us what you love. No algorithms guessing — just intelligent curation built on your actual taste. Here's how it works."
      sections={[
        {
          heading: "Step 1 — Explore the Catalog",
          body: "Start by browsing our curated collections, trending titles, and quality-ranked categories. Every title on FrameMeta is rated for premium home theater — 4K, HDR, Dolby Vision, and Dolby Atmos — so you can immediately see what your setup can truly showcase. No account required to explore.",
        },
        {
          heading: "Step 2 — Build Your Taste Profile",
          body: "As you browse, save titles, and interact with the platform, FrameMeta learns your preferences. We track what genres you gravitate toward, which directors and actors you follow, and what quality standards matter to you. Unlike traditional streaming algorithms, we weight critical quality and technical presentation — not just popularity.",
        },
        {
          heading: "Step 3 — Discover Hidden Gems",
          body: "Once we understand your taste, FrameMeta surfaces titles you'd never find through a standard search. Our recommendation engine cross-references your preferences with critic consensus, audience sentiment, and technical quality to surface hidden gems that match your exact profile.",
          list: [
            "Quality-ranked recommendations that prioritize critical merit over hype.",
            "Cross-platform discovery — find the best version of any title across all your streaming services.",
            "Mood-based browsing — search by tone, visual style, and atmosphere instead of just genre.",
            "Director and actor deep-dives — explore complete filmographies with quality ratings.",
          ],
        },
        {
          heading: "Step 4 — Stay Current",
          body: "FrameMeta's trends engine monitors what's rising across platforms, genres, and regions. Follow titles, directors, or franchises to get notified when new content arrives or when something in your taste profile starts trending. Our editorial team also publishes regular features on cinematic discoveries worth your time.",
        },
      ]}
      footer="FrameMeta is free to use. No account is required to browse — signing up simply unlocks personalized recommendations and watchlist features."
    />
  );
}
