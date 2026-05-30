export const movieHomeContent = {
  filters: {
    platforms: [
      { key: "all", label: "All", logo: "/images/hero.png" },
      { key: "netflix", label: "Netflix", logo: "https://svgl.app/library/netflix-icon.svg" },
      { key: "disney", label: "Disney+", logo: "https://svgl.app/library/disneyplus.svg" },
      { key: "viu", label: "Viu", logo: "https://www.vectorlogo.zone/logos/viu/viu-ar21.svg" },
      { key: "hbo", label: "HBO Go", logo: "https://www.vectorlogo.zone/logos/hbogo/hbogo-ar21.svg" },
    ],
    durations: [
      { key: "all", label: "Any time", hint: "Everything" },
      { key: "short", label: "Under 90 min", hint: "Quick watch" },
      { key: "feature", label: "Feature films (2h+)", hint: "Long form" },
    ],
  },
  genres: [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Noir",
    "Romance",
    "Sci-Fi",
    "Thriller",
  ],
  moods: [
    { label: "Neon-noir", query: "neon noir" },
    { label: "Liminal spaces", query: "liminal spaces" },
    { label: "High-tension thrillers", query: "thriller" },
    { label: "Dream logic", query: "dreamlike" },
  ],
  visionaries: [
    { label: "Precision", query: "christopher nolan" },
    { label: "Atmosphere", query: "denis villeneuve" },
    { label: "Elegance", query: "park chan-wook" },
    { label: "Mythic scale", query: "hayao miyazaki" },
  ],
} as const;
