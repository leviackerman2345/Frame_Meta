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
  rating?: number;       // e.g., 4.5
  year?: number;         // e.g., 2026
  description?: string;  // e.g., "A long time ago..."
  backdropUrl?: string;  // e.g., "https://..."
  logoUrl?: string;      // e.g., "https://..."
  isAnticipated?: boolean; // e.g., true for collections with upcoming releases
  type?: 'movie' | 'series';
  popularity?: number;     // e.g., TMDB popularity score
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBVideo {
  site?: string;
  type?: string;
  key?: string;
  name?: string;
  published_at?: string;
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

