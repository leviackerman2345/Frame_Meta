import type { Partner, FAQItem } from "@/types/types";

const hero = {
  title: "Discover the Ultimate Streaming Experience with",
  brandName: "FrameMeta",
  description:
    "Explore a curated library of world-class movies and series. From global blockbusters to indie gems, experience cinema like never before.",
  buttons: {
    getStarted: "Get Started",
    explore: "Explore Library",
  },
  // Sample Unsplash IDs for movie-like posters
  posters: [
    "photo-1626814026160-2237a95fc5a0", // Action/Cyberpunk
    "photo-1485846234645-a62644f84728", // Cinema/Classic
    "photo-1536440136628-849c177e76a1", // Modern Cinema
    "photo-1616530940355-351fabd9524b", // Dark Movie Posterish
    "photo-1598899134739-24c46f58b8c0", // Vibrant/Abstract
    "photo-1518709268805-4e9042af9f23", // Moody cinematic 2
  ],
};

const partnersHeading = {
  title: "Watch Everywhere",
  subtitle:
    "Stream your favorite movies independently through our integrated world-class production and streaming partners.",
} as const;

const partners = [
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
    logo: "https://www.vectorlogo.zone/logos/hbo_max/hbo_max-official.svg",
    href: "https://www.max.com",
    customImgClass: "brightness-200 group-hover:brightness-100 invert group-hover:invert-0",
  },
  {
    name: "Amazon Prime Video",
    description:
      "A global powerhouse featuring a vast mix of original content and Hollywood blockbusters.",
    logo: "https://www.vectorlogo.zone/logos/amazon_prime/amazon_prime-ar21.svg",
    href: "https://www.primevideo.com",
    customImgClass: "brightness-150 group-hover:brightness-100",
  },
  {
    name: "Viu",
    description:
      "The leading platform in the Philippines for premium K-Dramas and localized Asian series.",
    logo: "https://www.vectorlogo.zone/logos/viu/viu-ar21.svg",
    href: "https://www.viu.com",
    customImgClass: "brightness-200 group-hover:brightness-100",
  },
  {
    name: "HBO Go",
    description:
      "The primary streaming access point for HBO's flagship shows and movies in the Southeast Asian market.",
    logo: "https://www.vectorlogo.zone/logos/hbogo/hbogo-ar21.svg",
    href: "https://www.hbogoasia.com",
    customImgClass: "brightness-150 group-hover:brightness-100",
  },
  {
    name: "Paramount+",
    description:
      "Home to the Star Trek universe, Mission Impossible franchise, and the full library of CBS and Nickelodeon.",
    logo: "https://www.vectorlogo.zone/logos/paramountplus/paramountplus-ar21.svg",
    href: "https://www.paramountplus.com",
    customImgClass: "brightness-150 group-hover:brightness-100",
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
    logo: "https://www.vectorlogo.zone/logos/crunchyroll/crunchyroll-ar21.svg",
    href: "https://www.crunchyroll.com",
    customImgClass: "brightness-150 group-hover:brightness-100",
  },
] satisfies Partner[];

const platformOptions = [
  "All",
  "Netflix",
  "Disney+",
  "Prime",
  "Apple TV+",
] as const;

const faqHeading = {
  label: "",
  title: "Frequently Asked\nQuestions.",
  description: "Everything you need to know about navigating the global streaming landscape with FrameMeta. From real-time tracking to local trends, we've got you covered.",
};

const faqData = [
  {
    question: "Is FrameMeta a streaming service?",
    answer: "No. We are the central hub for your cinematic life. FrameMeta is a discovery platform that aggregates metadata—trailers, ratings, and plot details—so you can decide what to watch in one place, then jump directly to the platform hosting it.",
  },
  {
    question: "How do I know where a movie is streaming?",
    answer: "Every movie page on FrameMeta features a \"Watch Now\" section. We track real-time availability across global and local platforms like Netflix, Disney+, and Viu (PH), so you never have to search multiple apps again.",
  },
  {
    question: "What makes FrameMeta different from IMDb or Google?",
    answer: "We prioritize discovery over data. While other sites are just lists, FrameMeta uses a \"Bold UI\" philosophy and curated sections like The Vault to help you find hidden gems and trending titles through a premium, high-performance interface.",
  },
  {
    question: "Does FrameMeta show what’s trending in my area?",
    answer: "Yes. Our \"Top Near You\" row is specifically tuned to show what’s trending locally in the Philippines. We combine global data with local streaming habits to keep your feed relevant.",
  },
  {
    question: "Do I need an account to browse?",
    answer: "Never. You can access our full library, watch trailers, and check streaming availability without ever signing in. Your browsing experience is fast, private, and entirely ad-lite.",
  },
] satisfies FAQItem[];

const newsletterContent = {
  title: "Stay Ahead of the\nCinematic Curve.",
  subtitle: "Join 50,000+ cinephiles receiving weekly curated deep-dives, industry news, and early access to FrameMeta features.",
  placeholder: "Enter your email address",
  buttonText: "Subscribe",
  disclaimer: "By subscribing, you agree to our Privacy Policy and consent to receive updates.",
};

export const homeContent = {
  hero,
  partners: {
    heading: partnersHeading,
    items: partners,
  },
  platforms: {
    options: platformOptions,
  },
  faq: {
    heading: faqHeading,
    items: faqData,
  },
  newsletter: newsletterContent,
} as const;

