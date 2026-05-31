import { ContentPage } from "@/components/ui/ContentPage";

export default function CareersPage() {
  return (
    <ContentPage
      title="Careers"
      category="Company"
      description="We're a small, focused team of engineers, designers, and cinephiles building the most intelligent way to discover what to watch next. If you care deeply about both craft and cinema, we'd love to hear from you."
      sections={[
        {
          heading: "How We Work",
          body: "FrameMeta is remote-first and async-heavy. We believe great work happens when talented people have the space to think deeply, not when they're stuck in meetings. Our communication happens through written documents, code reviews, and structured updates — not Slack threads and status meetings.",
          list: [
            "Remote-first — work from anywhere with a reliable internet connection.",
            "Async communication — we prioritize written clarity over real-time noise.",
            "Small teams — every person has outsized impact. No passengers.",
            "Deep focus — we protect maker time and minimize context-switching.",
          ],
        },
        {
          heading: "Our Stack",
          body: "We build with modern tools chosen for developer experience and performance:",
          list: [
            "Frontend — Next.js 16, TypeScript, Tailwind CSS v4, Framer Motion.",
            "Data — TMDB API, custom aggregation layer, edge caching.",
            "Infrastructure — Vercel, edge functions, ISR with 5-minute revalidation.",
            "Design — Figma, component-driven design system, pixel-perfect implementation.",
          ],
        },
        {
          heading: "Who We're Looking For",
          body: "We value taste, intellectual curiosity, and a bias for action. We look for people who notice the details — the 1px border difference, the 100ms animation delay, the copy that doesn't quite land. You don't need to be a film expert, but you should care about building something beautiful and useful.",
          list: [
            "Frontend engineers who obsess over interaction design and performance.",
            "Designers who can ship — from concept to production code.",
            "Data engineers who can build reliable, real-time content pipelines.",
            "Editors and writers with deep film knowledge and sharp editorial judgment.",
          ],
        },
        {
          heading: "Benefits",
          list: [
            "Competitive salary benchmarked to your local market.",
            "Flexible hours — we care about output, not when you're online.",
            "Equipment budget for your ideal setup.",
            "Annual team retreats at film festivals.",
            "Unlimited access to FrameMeta's premium features.",
          ],
        },
      ]}
      footer="To apply, send your work and a note about what you'd improve on FrameMeta to careers@framemeta.com. We read every application."
    />
  );
}
