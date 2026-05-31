/** A streaming partner / hub logo card */
export interface Partner {
  name: string;
  description: string;
  logo: string;
  href: string;
  customImgClass?: string;
}

/** A navigation link item */
export interface NavLink {
  name: string;
  href: string;
}

/** Hero section featured movie data */
export interface FeaturedMovie {
  title: string;
  description: string;
  badge: string;
  rating: number;
  backgroundImage: string;
  backgroundAlt: string;
}

/** A movie or series card used across various sections */
export interface MovieCard {
  id: number;
  title?: string;
  genre?: string;
  posterUrl?: string;
  originalPosterUrl?: string; // Fallback: the original TMDB poster (with text)
  studio?: string;       // e.g., "Disney Pixar"
  rank?: number;         // e.g., 1 for Top 10
  badge?: string;        // e.g., "NEW"
  releaseDate?: string;  // e.g., "12/24/2026"
  runtime?: number;      // runtime in minutes when available
  providerNames?: string[]; // normalized streaming providers for filtering
  rating?: number;       // e.g., 4.5
  year?: number;         // e.g., 2026
  description?: string;  // e.g., "A long time ago..."
  backdropUrl?: string;  // e.g., "https://..."
  logoUrl?: string;      // e.g., "https://..."
  isAnticipated?: boolean; // e.g., true for collections with upcoming releases
  type?: 'movie' | 'series';
  popularity?: number;     // e.g., TMDB popularity score
  numberOfSeasons?: number; // for TV series
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBCastMember {
  id: number;
  name?: string;
  character?: string;
  profile_path?: string;
}

export interface TMDBCrewMember {
  id: number;
  name?: string;
  job?: string;
  profile_path?: string;
}

export interface TMDBProvider {
  provider_id: number;
  provider_name?: string;
  logo_path?: string;
}

export interface TMDBSeason {
  id: number;
  name?: string;
  season_number: number;
  episode_count?: number;
  air_date?: string;
  poster_path?: string | null;
}

export interface TMDBEpisode {
  id: number;
  name?: string;
  overview?: string;
  still_path?: string | null;
  episode_number?: number;
  air_date?: string;
  runtime?: number;
  vote_average?: number;
}

export interface TMDBReview {
  id: string;
  author?: string;
  content?: string;
  created_at?: string;
  author_details?: {
    avatar_path?: string | null;
    rating?: number | null;
  };
}

export interface OMDbRating {
  Source: string;
  Value: string;
}

export interface TMDBTitleDetails {
  id: number;
  success?: boolean;
  title?: string;
  name?: string;
  overview?: string;
  tagline?: string;
  vote_average?: number;
  popularity?: number;
  release_date?: string;
  first_air_date?: string;
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  genres?: TMDBGenre[];
  backdrop_path?: string | null;
  poster_path?: string | null;
  imdb_id?: string | null;
  external_ids?: {
    imdb_id?: string | null;
  };
  release_dates?: {
    results?: Array<{
      iso_3166_1: string;
      release_dates?: Array<{
        certification?: string;
      }>;
    }>;
  };
  content_ratings?: {
    results?: Array<{
      iso_3166_1: string;
      rating?: string;
    }>;
  };
  "watch/providers"?: {
    results?: Record<
      string,
      {
        flatrate?: TMDBProvider[];
        rent?: TMDBProvider[];
        buy?: TMDBProvider[];
        link?: string;
      }
    >;
  };
  credits?: {
    cast?: TMDBCastMember[];
    crew?: TMDBCrewMember[];
  };
  videos?: {
    results?: TMDBVideo[];
  };
  seasons?: TMDBSeason[];
  spoken_languages?: Array<{
    english_name?: string;
    name?: string;
  }>;
  original_language?: string;
  production_companies?: Array<{
    id: number;
    name?: string;
  }>;
  networks?: Array<{
    id: number;
    name?: string;
  }>;
  budget?: number;
  revenue?: number;
  belongs_to_collection?: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
}

/** A news article or editorial piece */
export interface NewsItem {
  id: number;
  title: string;
  category: string;
  source: string;
  date: string;
  readTime: string;
  imageUrl?: string;   // Optional — not all articles have a thumbnail
  author: string;
  authorAvatar?: string;
  sourceLogo?: string;
  description?: string;
  content?: string;     // Full text content if available
  slug?: string;        // URL-friendly ID for internal routing
  url?: string;        // Link to the full article
  // FIX 3 (Phase 5) — Staleness guard: true when this article comes from the
  // hardcoded fallback list and that list is older than FALLBACK_MAX_AGE_DAYS.
  // The UI uses this flag to render a subtle "From our archive" banner so users
  // are never misled into thinking a 6-month-old article is breaking news.
  isArchived?: boolean;
}

/** A single FAQ item */
export interface FAQItem {
  question: string;
  answer: string;
}

/** Unified Collection/Universe Data */
export interface CollectionData {
  id: number;
  title: string;
  overview: string;
  backdropUrl: string | null;
  posterUrl: string | null;
  logoUrl?: string | null;
  parts: MovieCard[];
  rating: number;
  yearSpan: string;
  genres: string[];
  totalRuntime?: string;
  totalRevenue?: string;
  comingSoon?: MovieCard[];
  cast?: (TMDBCastMember & { 
    appearanceCount: number;
    allCharacters?: string[];
  })[];
  crew?: (TMDBCrewMember & {
    appearanceCount: number;
    displayRole: string;
  })[];
}

/** Standardized API response wrapper */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status?: number;
}

export interface Credit {
  id: number;
  title?: string;
  name?: string;
  character?: string;
  job?: string;
  poster_path?: string;
  release_date?: string;
  first_air_date?: string;
  media_type?: "movie" | "tv";
  vote_average?: number;
  popularity?: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  source: string;
  publishedAt: string;
  thumbnailUrl: string;
  author?: string;
  authorAvatar?: string;
}

// --- TMDB Data Layer & Algorithm Interfaces ---
// These interfaces define the pipeline for fetching, scoring, and normalizing clips.

// 1. TMDBVideo: The raw video object returned by TMDB's /videos endpoint.
// It contains the YouTube key and metadata like size (resolution) and type (Trailer, Clip, etc.).
export interface TMDBVideo {
  id: string;
  key: string;            // YouTube video ID
  name: string;           // e.g. "Official Trailer", "Clip: Opening Scene"
  type: 'Trailer' | 'Clip' | 'Teaser' | 'Featurette' | 'Behind the Scenes' | 'Bloopers';
  site: 'YouTube' | 'Vimeo';
  size: number;           // quality: 360, 480, 720, 1080
  official: boolean;
  published_at: string;
}

// 2. ClipSource: The parent media (movie/series) that owns the clip.
// We use its popularity, release year, and genres to calculate the clip's final engagement score.
export interface ClipSource {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  popularity: number;
  year: number;
  posterPath: string | null;
  backdropPath: string | null;
  genreIds: number[];
  sourceKind?: 'trending' | 'popular';
  sourceRank?: number;
  sourceScore?: number;
}

// 3. Clip: The fully normalized object sent to the frontend.
// It merges the raw video data (TMDBVideo) with its parent context (ClipSource)
// and computes a final 'popularity' score used for sorting the infinite scroll feed.
export interface Clip {
  id: string;
  tmdbId: number;  // TMDB title ID — used to open the title modal on click
  title: string;
  description: string;
  youtubeId: string;
  thumbnailUrl: string;
  category: 'action' | 'drama' | 'comedy' | 'horror' | 'thriller' | 'animation' | 'scifi';
  mediaType: 'movie' | 'tv';
  year: number;
  popularity: number;
  tags: string[];
  duration: number;
  posterPath: string | null;
  certification: string | null;  // e.g. 'PG-13', 'R', 'TV-MA' — null if unavailable
}
