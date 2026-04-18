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

/** A movie card in the trending section */
export interface MovieCard {
  id: number;
  title?: string;
  genre?: string;
  posterUrl?: string;
}
