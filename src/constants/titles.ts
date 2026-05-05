import type { MovieCard } from "@/types/types";

// ---------------------------------------------------------------------------
// Hero Section
// ---------------------------------------------------------------------------


export const featuredMoviesHeading = {
  title: "Featured Movies",
  subtitle: "Handpicked cinematic experiences",
} as const;


export const featuredMovies = [
  {
    id: 701,
    title: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    badge: "Featured",
    rating: 4.8,
    genre: "Sci-Fi",
    year: 2024,
    backgroundImage: "/images/poster-placeholder.jpg",
  },
  {
    id: 702,
    title: "Oppenheimer",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    badge: "Award Winner",
    rating: 4.9,
    genre: "Biography",
    year: 2023,
    backgroundImage: "/images/poster-placeholder.jpg",
  },
  {
    id: 703,
    title: "Spider-Man: Across the Spider-Verse",
    description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    badge: "Featured",
    rating: 4.8,
    genre: "Animation",
    year: 2023,
    backgroundImage: "/images/poster-placeholder.jpg",
  }
];


export const featuredSeriesHeading = {
  title: "Featured TV Series",
  subtitle: "Binge-worthy shows curated for you",
} as const;


export const featuredSeries = [
  {
    id: 801,
    title: "Shōgun",
    description: "When a mysterious European ship is found marooned in a nearby fishing village, Lord Yoshii Toranaga discovers secrets that could tip the scales of power.",
    badge: "Featured",
    rating: 4.9,
    genre: "Historical Drama",
    year: 2024,
    backgroundImage: "/images/poster-placeholder.jpg",
  },
  {
    id: 802,
    title: "Succession",
    description: "The Roy family is known for controlling the biggest media and entertainment company in the world. However, their world changes when their father steps down.",
    badge: "Must Watch",
    rating: 4.8,
    genre: "Drama",
    year: 2023,
    backgroundImage: "/images/poster-placeholder.jpg",
  },
  {
    id: 803,
    title: "The Bear",
    description: "A young chef from the fine dining world comes home to Chicago to run his family sandwich shop after a heartbreaking death in his family.",
    badge: "Featured",
    rating: 4.7,
    genre: "Comedy-Drama",
    year: 2023,
    backgroundImage: "/images/poster-placeholder.jpg",
  }
];

// ---------------------------------------------------------------------------
// Partners / Streaming Hub Section
// ---------------------------------------------------------------------------


export const trendingHeading = {
  title: "Trending Movies",
} as const;

// ---------------------------------------------------------------------------
// Top 10 Movies
// ---------------------------------------------------------------------------


export const top10MoviesHeading = {
  title: "Top 10 Movies",
  subtitle: "Global Rankings",
} as const;


export const top10Movies: MovieCard[] = [
  { id: 1, title: "The Good Dinosaur", studio: "Disney Pixar", rank: 1, rating: 4.8, genre: "Animation", year: 2015, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 2, title: "Aladdin", studio: "Disney", rank: 2, rating: 4.7, genre: "Adventure", year: 2019, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 3, title: "Raya and the Last Dragon", studio: "Disney", rank: 3, rating: 4.5, genre: "Fantasy", year: 2021, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 4, title: "Luca", studio: "Disney Pixar", rank: 4, rating: 4.6, genre: "Animation", year: 2021, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 5, title: "Tangled", studio: "Disney", rank: 5, rating: 4.9, genre: "Animation", year: 2010, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 6, title: "Coco", studio: "Disney Pixar", rank: 6, rating: 4.9, genre: "Animation", year: 2017, posterUrl: "/images/poster-placeholder.jpg" },
];

// ---------------------------------------------------------------------------
// Top 10 TV Series
// ---------------------------------------------------------------------------


export const top10SeriesHeading = {
  title: "Top 10 TV Series",
  subtitle: "Global Rankings",
} as const;


export const top10Series: MovieCard[] = [
  { id: 101, title: "The Mandalorian", studio: "Lucasfilm", rank: 1, rating: 4.8, genre: "Sci-Fi", year: 2019, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 102, title: "Stranger Things", studio: "Netflix", rank: 2, rating: 4.7, genre: "Sci-Fi", year: 2016, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 103, title: "Loki", studio: "Marvel Studios", rank: 3, rating: 4.6, genre: "Action", year: 2021, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 104, title: "The Witcher", studio: "Netflix", rank: 4, rating: 4.5, genre: "Fantasy", year: 2019, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 105, title: "Severance", studio: "Apple TV+", rank: 5, rating: 4.9, genre: "Thriller", year: 2022, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 106, title: "The Boys", studio: "Amazon Studios", rank: 6, rating: 4.8, genre: "Action", year: 2019, posterUrl: "/images/poster-placeholder.jpg" },
];

// ---------------------------------------------------------------------------
// New Releases
// ---------------------------------------------------------------------------


export const newReleasesHeading = {
  title: "New Releases",
  subtitle: "Fresh to your screens",
} as const;

// ---------------------------------------------------------------------------
// In Cinema
// ---------------------------------------------------------------------------


export const newReleasesThisWeek: MovieCard[] = [
  { id: 201, title: "Galactic Wars", studio: "Fox", badge: "NEW", releaseDate: "Oct 12", rating: 4.5, genre: "Sci-Fi", year: 2024, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 202, title: "Mystery Island", studio: "Netflix", badge: "NEW", releaseDate: "Oct 14", rating: 4.2, genre: "Adventure", year: 2024, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 203, title: "Comedy Central", studio: "Hulu", badge: "NEW", releaseDate: "Oct 15", rating: 4.7, genre: "Comedy", year: 2024, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 204, title: "Cyberpunk City", studio: "HBO", badge: "NEW", releaseDate: "Oct 16", rating: 4.8, genre: "Sci-Fi", year: 2024, posterUrl: "/images/poster-placeholder.jpg" },
];


export const newReleasesThisMonth: MovieCard[] = [
  { id: 301, title: "October Fall", studio: "Paramount", badge: "NEW", releaseDate: "Oct 01", rating: 4.4, genre: "Drama", year: 2024, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 302, title: "The Haunted", studio: "Universal", badge: "NEW", releaseDate: "Oct 05", rating: 4.1, genre: "Horror", year: 2024, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 303, title: "Autumn Leaves", studio: "Sony Pictures", badge: "NEW", releaseDate: "Oct 08", rating: 4.6, genre: "Romance", year: 2024, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 304, title: "Harvest Moon", studio: "Disney", badge: "NEW", releaseDate: "Oct 10", rating: 4.3, genre: "Drama", year: 2024, posterUrl: "/images/poster-placeholder.jpg" },
];

// ---------------------------------------------------------------------------
// Asian Spotlight
// ---------------------------------------------------------------------------


export const inCinemaHeading = {
  title: "In Cinema",
  subtitle: "Experience them on the big screen",
} as const;


export const asianSpotlightHeading = {
  title: "Asian Spotlight",
  subtitle: "Curated hits from across the globe",
} as const;


export const asianSpotlightCountries = [
  { code: "KR", label: "Korean" },
  { code: "JP", label: "Japanese" },
  { code: "CN", label: "Chinese" },
  { code: "TH", label: "Thai" },
] as const;


export const asianSpotlightKorean: MovieCard[] = [
  { id: 401, title: "Squid Game", studio: "Netflix", rating: 4.8, genre: "Thriller", year: 2021, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 402, title: "Parasite", studio: "CJ ENM", rating: 4.9, genre: "Thriller", year: 2019, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 403, title: "Train to Busan", studio: "Next Entertainment", rating: 4.7, genre: "Horror", year: 2016, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 404, title: "Reply 1988", studio: "tvN", rating: 4.9, genre: "Romance", year: 2015, posterUrl: "/images/poster-placeholder.jpg" },
];


export const asianSpotlightJapanese: MovieCard[] = [
  { id: 501, title: "Spirited Away", studio: "Studio Ghibli", rating: 4.9, genre: "Animation", year: 2001, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 502, title: "Your Name", studio: "CoMix Wave", rating: 4.8, genre: "Animation", year: 2016, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 503, title: "Alice in Borderland", studio: "Netflix", rating: 4.6, genre: "Thriller", year: 2020, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 504, title: "Godzilla Minus One", studio: "Toho", rating: 4.8, genre: "Sci-Fi", year: 2023, posterUrl: "/images/poster-placeholder.jpg" },
];

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------


export const comingSoonHeading = {
  title: "Coming Soon",
  subtitle: "Mark your calendars for these upcoming premieres",
} as const;


export const comingSoonData: MovieCard[] = [
  { id: 901, title: "Gladiator II", studio: "Paramount", badge: "NOV 22", releaseDate: "Nov 22", rating: 4.9, genre: "Action • Drama", year: 2024, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 902, title: "Wicked", studio: "Universal", badge: "NOV 27", releaseDate: "Nov 27", rating: 4.8, genre: "Fantasy • Musical", year: 2024, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 903, title: "Moana 2", studio: "Disney", badge: "NOV 27", releaseDate: "Nov 27", rating: 4.7, genre: "Animation/Adventure", year: 2024, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 904, title: "Nosferatu", studio: "Focus Features", badge: "DEC 25", releaseDate: "Dec 25", rating: 4.9, genre: "Horror • Gothic", year: 2024, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 905, title: "Sonic the Hedgehog 3", studio: "Paramount", badge: "DEC 20", releaseDate: "Dec 20", rating: 4.5, genre: "Action • Comedy", year: 2024, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 906, title: "Mufasa: The Lion King", studio: "Disney", badge: "DEC 20", releaseDate: "Dec 20", rating: 4.6, genre: "Adventure • Drama", year: 2024, posterUrl: "/images/poster-placeholder.jpg" },
];

/**
 * FEATURED NEWS SECTION
 */

