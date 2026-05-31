import { ContentPage } from "@/components/ui/ContentPage";

export default function AboutPage() {
  return (
    <ContentPage
      title="About FrameMeta"
      category="Company"
      description="FrameMeta is a cinematic intelligence platform built for how modern audiences actually discover film and television — through taste, context, and quality. We believe the best recommendation engine is one that respects your intelligence."
      sections={[
        {
          heading: "Our Mission",
          body: "We're building the definitive platform for cinematic discovery. In an era of infinite content and finite attention, FrameMeta helps you find what's truly worth watching — not just what's trending. Every title on our platform is evaluated for technical quality, critical merit, and cultural impact, so you spend less time searching and more time watching.",
        },
        {
          heading: "What We Do",
          body: "FrameMeta aggregates critic scores, audience sentiment, technical quality metrics, and streaming availability into a single, beautifully curated experience. We rate every title for premium home theater — 4K, HDR, Dolby Vision, and Dolby Atmos — so you always know what your setup can truly showcase. Our recommendation engine learns your taste, not just your watch history.",
          list: [
            "Quality-first ratings that blend TMDB, Metacritic, and Rotten Tomatoes scores with technical presentation data.",
            "Streaming availability across all major platforms, updated in real time.",
            "Cast and crew profiles with full filmographies, awards history, and collaboration networks.",
            "Editorial features, trend analysis, and curated collections built by cinephiles, for cinephiles.",
          ],
        },
        {
          heading: "Our Values",
          body: "Everything we build is guided by three principles:",
          list: [
            "Quality over quantity — we'd rather surface one perfect recommendation than a wall of mediocre options.",
            "Transparency — our ratings methodology is open, our data sources are cited, and we never accept payment for placement.",
            "Craft — we believe the tools we use to discover art should be held to the same standard as the art itself.",
          ],
        },
        {
          heading: "The Technology",
          body: "FrameMeta is built on a modern web stack optimized for speed and visual fidelity. We use Next.js with server-side rendering for instant page loads, Tailwind CSS for a consistent design system, and a custom recommendation layer that processes TMDB data alongside critic aggregates. Our platform is designed to feel as premium as the content it surfaces.",
        },
      ]}
      footer="FrameMeta is an independent platform. We are not affiliated with, endorsed by, or connected to any streaming service, studio, or film distributor."
    />
  );
}
