import { ContentPage } from "@/components/ui/ContentPage";

export default function AwardsPage() {
  return (
    <ContentPage
      title="Awards"
      category="Feature"
      description="Every major film award, festival selection, and critical accolade — organized, searchable, and contextualized so you can understand what recognition actually means for a title's quality."
      sections={[
        {
          heading: "What We Cover",
          body: "FrameMeta tracks awards and recognition across the global cinematic landscape. From the Academy Awards and Cannes to regional festivals and critics' circle awards — we maintain a comprehensive database of nominations, wins, and notable snubs, all linked directly to the title's FrameMeta profile.",
          list: [
            "Academy Awards (Oscars) — all categories, historical and current.",
            "Cannes Film Festival — Palme d'Or, Grand Prix, and jury selections.",
            "BAFTA, Golden Globes, and SAG Awards.",
            "Independent Spirit Awards and Gotham Awards.",
            "Venice, Berlin, Toronto, and Sundance festival selections.",
            "Regional critics' circle awards across 20+ countries.",
          ],
        },
        {
          heading: "How to Use Awards Data",
          body: "Every award entry on FrameMeta links directly to the title's full profile — so you can instantly see ratings, streaming availability, technical quality specs, and cast information. Use awards data to discover critically acclaimed titles you might have missed, explore the filmography of award-winning directors and actors, or build watchlists organized by recognition.",
        },
        {
          heading: "Awards & Quality",
          body: "An award nomination signals industry recognition, but it doesn't always correlate with what you'll personally enjoy. That's why FrameMeta contextualizes awards alongside our quality metrics. A Palme d'Or winner that's only available in 480p on one platform tells a different story than one available in 4K Dolby Vision across three services. We give you the full picture.",
        },
        {
          heading: "Awards Season Tracking",
          body: "During awards season (October through March), we provide real-time tracking of nominations, predictions, and results. Follow the conversation from early festival buzz through to Oscar night — with editorial analysis of what each win means for the films and filmmakers involved.",
        },
      ]}
      footer="Awards data is updated within 24 hours of official announcements. Historical data covers major awards from 1929 to present."
    />
  );
}
