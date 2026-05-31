import { ContentPage } from "@/components/ui/ContentPage";

export default function RankingsTVShowsPage() {
  return (
    <ContentPage
      title="TV Show Rankings"
      category="Rankings"
      description="Television rankings that account for the full arc — pilot quality, season consistency, finale reception, and cultural staying power. Because a show is more than its average episode score."
      sections={[
        {
          heading: "Beyond Episode Scores",
          body: "Most TV rankings average episode ratings and call it a day. That's misleading. A show with a brilliant first season and a disastrous finale is a fundamentally different experience than one that improves steadily over its run. Our TV rankings factor in the complete viewing journey.",
          list: [
            "Season trajectory — does the show improve, maintain, or decline over its run?",
            "Finale satisfaction — how audiences and critics received the series conclusion.",
            "Consistency — the standard deviation of episode quality within each season.",
            "Cultural longevity — is the show still discussed and rewatched years after ending?",
            "Production quality — cinematography, sound design, and visual effects across the series.",
          ],
        },
        {
          heading: "Series vs. Limited Series",
          body: "We rank ongoing series and limited series separately, recognizing that they're fundamentally different formats. A limited series tells a complete story in one season — its ranking reflects the quality of that single, contained narrative. An ongoing series is judged on its ability to sustain quality over multiple seasons, which is a far more difficult achievement.",
        },
        {
          heading: "Ranking Categories",
          list: [
            "All-Time — the definitive ranking of television, from classic sitcoms to modern prestige drama.",
            "Currently Airing — the best shows with new episodes this season.",
            "By Genre — quality-ranked within drama, comedy, sci-fi, documentary, and more.",
            "By Platform — the best shows available on each streaming service.",
            "Complete Series — shows that have ended, ranked on their full run.",
            "Hidden Gems — exceptional shows with low viewership that deserve discovery.",
          ],
        },
        {
          heading: "The Prestige TV Factor",
          body: "We're living in a golden age of television, and our rankings reflect that. Shows like Breaking Bad, The Wire, and Chernobyl represent a level of sustained storytelling quality that rivals the best cinema. Our ranking methodology is designed to recognize and surface this kind of excellence — not just what's trending this week.",
        },
      ]}
      footer="TV rankings are updated weekly. Series data covers over 15,000 titles from 1950 to present."
    />
  );
}
