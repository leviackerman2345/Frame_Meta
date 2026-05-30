export const seriesHomeContent = {
  filters: {
    platforms: [
      { key: "all", label: "All", logo: "" },
      {
        key: "netflix",
        label: "Netflix",
        logo: "https://svgl.app/library/netflix-icon.svg",
      },
      {
        key: "disney",
        label: "Disney+",
        logo: "https://svgl.app/library/disneyplus.svg",
      },
      {
        key: "viu",
        label: "Viu",
        logo: "https://www.vectorlogo.zone/logos/viu/viu-ar21.svg",
      },
      {
        key: "hbo",
        label: "HBO Go",
        logo: "https://www.vectorlogo.zone/logos/hbogo/hbogo-ar21.svg",
      },
    ],
    binge: [
      { key: "all", label: "Any length", hint: "Everything" },
      { key: "short", label: "Short Episodes", hint: "<30 min" },
      { key: "limited", label: "Limited Series", hint: "Single season" },
      { key: "deep", label: "Deep Lore", hint: "5+ seasons" },
    ],
  },
  genres: [
    "K-Drama",
    "Sci-Fi & Fantasy",
    "Anime",
    "True Crime",
    "Docuseries",
    "Fantasy",
    "Thriller",
    "Comedy",
    "Drama",
    "Horror",
    "Mystery",
    "Romance",
    "Action & Adventure",
  ],
  moods: [
    { label: "Cosy Comfort", query: "feel good series" },
    { label: "Mind-Benders", query: "psychological thriller series" },
    { label: "Neon Thrillers", query: "cyberpunk series" },
    { label: "Epic Sagas", query: "epic fantasy series" },
    { label: "Dark Comedy", query: "dark comedy series" },
    { label: "Slow Burn", query: "slow burn drama series" },
  ],
  visionaries: [
    { label: "Vince Gilligan", query: "vince gilligan" },
    { label: "Mike White", query: "mike white" },
    { label: "Hwang Dong-hyuk", query: "hwang dong-hyuk" },
    { label: "Craig Mazin", query: "craig mazin" },
    { label: "Phoebe Waller-Bridge", query: "phoebe waller-bridge" },
    { label: "David Chase", query: "david chase" },
  ],
} as const;
