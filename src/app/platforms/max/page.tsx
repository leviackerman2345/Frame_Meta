import { ContentPage } from "@/components/ui/ContentPage";

export default function MaxPage() {
  return (
    <ContentPage
      title="Max"
      category="Platform"
      description="HBO's prestige television, Warner Bros. cinema, and the Discovery catalog — curated with the cinematic precision these brands demand. Quality has always been the HBO standard."
      sections={[
        {
          heading: "Max on FrameMeta",
          body: "Max combines HBO's legendary original programming with Warner Bros.' theatrical releases and Discovery's documentary catalog. FrameMeta ranks this library by critical quality and technical presentation, helping you find the best of what's available across all three content pillars.",
          list: [
            "HBO Originals — ranked by season quality, from The Sopranos to The Last of Us.",
            "Warner Bros. theatricals — blockbuster films available in premium 4K HDR quality.",
            "Discovery documentaries — nature, science, and history content ranked by audience and critic scores.",
            "Technical specs — Dolby Vision and Dolby Atmos availability for every title.",
          ],
        },
        {
          heading: "HBO's Legacy",
          body: "HBO essentially invented prestige television. From The Sopranos and The Wire to Game of Thrones and Succession, HBO's original programming has consistently set the standard for what television can be. FrameMeta's quality rankings reflect this legacy, helping you explore HBO's deep catalog starting with the strongest entries.",
        },
        {
          heading: "Warner Bros. Cinema",
          body: "Warner Bros. has one of the richest film libraries in Hollywood, spanning from Casablanca and The Wizard of Oz to The Dark Knight and Dune. Max brings many of these titles to streaming for the first time, and FrameMeta helps you discover them ranked by critical acclaim and technical quality.",
        },
      ]}
      footer="Max catalog data is updated daily. HBO Original rankings are recalculated as new seasons are released."
    />
  );
}
