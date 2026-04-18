import type { Partner, FeaturedMovie } from "@/types/types";

// ---------------------------------------------------------------------------
// Hero Section
// ---------------------------------------------------------------------------

export const featuredMovie: FeaturedMovie = {
  title: "The Lost Crystal",
  description:
    "A breathtaking journey into a hidden realm where magic still thrives. Follow the path of the ancients to discover the truth behind the glowing forest and save a world on the brink of eternal darkness.",
  badge: "New Release",
  rating: 4.8,
  backgroundImage: "/images/hero.png",
  backgroundAlt: "Magical Forest Cinematic Movie",
};

export const heroButtons = {
  watchNow: "Watch Now",
  addToWishlist: "Add to Wishlist",
} as const;

// ---------------------------------------------------------------------------
// Partners / Streaming Hub Section
// ---------------------------------------------------------------------------

export const partnersHeading = {
  title: "Watch Everywhere",
  subtitle:
    "Stream your favorite movies independently through our integrated world-class production and streaming partners.",
} as const;

export const partners: Partner[] = [
  {
    name: "Netflix",
    description:
      "The global standard for original series and a massive library of international films.",
    logo: "https://svgl.app/library/netflix-icon.svg",
    href: "https://www.netflix.com",
    customImgClass: "brightness-150 group-hover:brightness-100",
  },
  {
    name: "Disney+",
    description:
      "The exclusive home for the Marvel Cinematic Universe, Star Wars, Pixar, and Disney classics.",
    logo: "https://svgl.app/library/disneyplus.svg",
    href: "https://www.disneyplus.com",
    customImgClass: "brightness-150 group-hover:brightness-100",
  },
  {
    name: "Apple TV+",
    description:
      "A premium, minimalist service focusing on high-budget, award-winning original productions.",
    logo: "https://svgl.app/library/apple_dark.svg",
    href: "https://tv.apple.com",
  },
  {
    name: "Max",
    description:
      "The destination for prestige HBO titles, DC Universe films, and the Warner Bros. catalog.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Max_logo.svg",
    href: "https://www.max.com",
  },
  {
    name: "Amazon Prime Video",
    description:
      "A global powerhouse featuring a vast mix of original content and Hollywood blockbusters.",
    logo: "https://svgl.app/library/prime-video.svg",
    href: "https://www.primevideo.com",
    customImgClass: "brightness-150 group-hover:brightness-100",
  },
  {
    name: "Viu",
    description:
      "The leading platform in the Philippines for premium K-Dramas and localized Asian series.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Viu_logo.svg",
    href: "https://www.viu.com",
  },
  {
    name: "HBO Go",
    description:
      "The primary streaming access point for HBO's flagship shows and movies in the Southeast Asian market.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/22/HBO_Go_logo.svg",
    href: "https://www.hbogoasia.com",
  },
  {
    name: "Paramount+",
    description:
      "Home to the Star Trek universe, Mission Impossible franchise, and the full library of CBS and Nickelodeon.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Paramount_Plus_logo.svg",
    href: "https://www.paramountplus.com",
  },
  {
    name: "Hulu",
    description:
      "A major hub for next-day network television episodes and adult-oriented original dramas.",
    logo: "https://svgl.app/library/hulu-dark.svg",
    href: "https://www.hulu.com",
  },
  {
    name: "Crunchyroll",
    description:
      "The world's largest dedicated platform for professional anime series and Japanese cinematic releases.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Crunchyroll_Logo.svg",
    href: "https://www.crunchyroll.com",
  },
];

// ---------------------------------------------------------------------------
// Trending Section
// ---------------------------------------------------------------------------

export const trendingHeading = {
  title: "Trending Movies",
} as const;
