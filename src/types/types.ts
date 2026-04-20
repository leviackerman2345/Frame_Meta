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
  studio?: string;       // e.g., "Disney Pixar"
  rank?: number;         // e.g., 1 for Top 10
  badge?: string;        // e.g., "NEW"
  releaseDate?: string;  // e.g., "12/24/2026"
  rating?: number;       // e.g., 4.5
  year?: number;         // e.g., 2026
  description?: string;  // e.g., "A long time ago..."
  backdropUrl?: string;  // e.g., "https://..."
  isAnticipated?: boolean; // e.g., true for collections with upcoming releases
}

/** A news article or editorial piece */
export interface NewsItem {
  id: number;
  title: string;
  category: string;
  source: string;
  date: string;
  readTime: string;
  imageUrl: string;
  author: string;
  description?: string;
}


