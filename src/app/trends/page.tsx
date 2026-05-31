import { ContentPage } from "@/components/ui/ContentPage";

export default function TrendsPage() {
  return (
    <ContentPage
      title="Trends"
      category="Feature"
      description="Real-time cultural intelligence — what the world is watching, discussing, and rediscovering, distilled into actionable insights for the modern viewer."
      sections={[
        {
          heading: "What We Track",
          body: "Our trends engine monitors multiple signals across 40+ markets to surface what's genuinely rising — not just what's being promoted. We analyze streaming velocity, social media discourse, critic reappraisals, search volume, and seasonal viewing patterns to build a real-time picture of global cinematic culture.",
          list: [
            "Streaming velocity — how quickly a title is gaining viewers across platforms.",
            "Social discourse — mentions, discussions, and sentiment across social media and review platforms.",
            "Critic reappraisals — titles receiving renewed critical attention or retrospective acclaim.",
            "Seasonal patterns — horror films in October, prestige dramas in awards season, family content during holidays.",
            "Regional shifts — what's breaking out in specific markets before it reaches the global stage.",
          ],
        },
        {
          heading: "Rising vs. Popular",
          body: "Most platforms show you what's popular. We show you what's rising. A title with 10,000 new viewers today and 1,000 yesterday is more interesting than one with 100,000 steady viewers. Our trends engine is designed to surface the films and series about to break through — before they hit the mainstream consciousness.",
        },
        {
          heading: "Trend Categories",
          body: "We organize trends into actionable categories so you can find exactly what you're looking for:",
          list: [
            "Global Rising — titles gaining momentum across multiple markets simultaneously.",
            "Critics' Rediscovery — older films receiving renewed critical attention.",
            "Platform Breakouts — titles surging on specific streaming services.",
            "Genre Revivals — emerging trends within specific genres or subgenres.",
            "Festival Circuit — titles generating buzz from film festival screenings.",
          ],
        },
        {
          heading: "For Industry Professionals",
          body: "FrameMeta trends data is valuable for content strategists, acquisition teams, and marketing professionals. Our aggregated, anonymized trend data can inform content decisions, release timing, and audience targeting. Contact us for enterprise data access and custom reporting.",
        },
      ]}
      footer="Trends data is updated hourly. Historical trend data is available for the past 12 months."
    />
  );
}
