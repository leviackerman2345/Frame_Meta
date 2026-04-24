import type { Partner, FeaturedMovie, MovieCard, NewsItem, FAQItem } from "@/types/types";

// ---------------------------------------------------------------------------
// Hero Section
// ---------------------------------------------------------------------------

export const companyHero = {
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
  ]
};


// ---------------------------------------------------------------------------
// Featured Spotlight (Below Platform Controls)
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
];


// ---------------------------------------------------------------------------
// Trending Section (Legacy/Placeholder)
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

export const inCinemaHeading = {
  title: "In Cinema",
  subtitle: "Experience them on the big screen",
} as const;

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

export const asianSpotlightHeading = {
  title: "Asian Spotlight",
  subtitle: "Curated hits from across the globe",
} as const;

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

export const collectionsHeading = {
  title: "Collections",
  subtitle: "Epic franchises and legendary trilogies",
} as const;

export const collectionsData = [
  {
    id: 601,
    title: "The Lord of the Rings Cinematic Universe",
    description: "Journey through Middle-earth with the award-winning saga. Experience the epic battles, deep lore, and triumphant spirit of the fellowship.",
    badge: "6 Movies",
    rating: 4.9,
    genre: "High Fantasy",
    year: "2001-2014",
    totalRuntime: "17h 12m",
    backgroundImage: "/images/poster-placeholder.jpg",
  },
  {
    id: 602,
    title: "The Marvel Infinity Saga",
    description: "The groundbreaking 23-film intertwining narrative that redefined superhero cinema. Witness the rise of the Avengers against the Mad Titan Thanos.",
    badge: "23 Movies",
    rating: 4.8,
    genre: "Action/Sci-Fi",
    year: "2008-2019",
    totalRuntime: "49h 59m",
    backgroundImage: "/images/poster-placeholder.jpg",
  },
  {
    id: 603,
    title: "The Dark Knight Trilogy",
    description: "Christopher Nolan's gritty, grounded take on the Caped Crusader that elevated the comic book genre to new cinematic heights.",
    badge: "3 Movies",
    rating: 4.9,
    genre: "Action/Crime",
    year: "2005-2012",
    totalRuntime: "7h 36m",
    backgroundImage: "/images/poster-placeholder.jpg",
  },
  {
    id: 604,
    title: "The Matrix Franchise",
    description: "Plug into the groundbreaking cyberpunk saga that challenged reality and redefined action cinema with revolutionary visual effects.",
    badge: "4 Movies",
    rating: 4.6,
    genre: "Sci-Fi/Action",
    year: "1999-2021",
    totalRuntime: "9h 14m",
    backgroundImage: "/images/poster-placeholder.jpg",
  }
];

// ---------------------------------------------------------------------------
// Coming Soon
// ---------------------------------------------------------------------------

export const comingSoonHeading = {
  title: "Coming Soon",
  subtitle: "Mark your calendars for these upcoming premieres",
} as const;

export const comingSoonData: MovieCard[] = [
  { id: 901, title: "Gladiator II", studio: "Paramount", badge: "NOV 22", releaseDate: "Nov 22", rating: 4.9, genre: "Action/Drama", year: 2024, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 902, title: "Wicked", studio: "Universal", badge: "NOV 27", releaseDate: "Nov 27", rating: 4.8, genre: "Fantasy/Musical", year: 2024, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 903, title: "Moana 2", studio: "Disney", badge: "NOV 27", releaseDate: "Nov 27", rating: 4.7, genre: "Animation/Adventure", year: 2024, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 904, title: "Nosferatu", studio: "Focus Features", badge: "DEC 25", releaseDate: "Dec 25", rating: 4.9, genre: "Horror/Gothic", year: 2024, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 905, title: "Sonic the Hedgehog 3", studio: "Paramount", badge: "DEC 20", releaseDate: "Dec 20", rating: 4.5, genre: "Action/Comedy", year: 2024, posterUrl: "/images/poster-placeholder.jpg" },
  { id: 906, title: "Mufasa: The Lion King", studio: "Disney", badge: "DEC 20", releaseDate: "Dec 20", rating: 4.6, genre: "Adventure/Drama", year: 2024, posterUrl: "/images/poster-placeholder.jpg" },
];

/**
 * FEATURED NEWS SECTION
 */
export const featuredNewsHeading = {
  title: "Featured News",
  subtitle: "The latest headlines from the world of cinema",
} as const;

export const featuredNewsData: NewsItem[] = [
  {
    id: 1001,
    title: "Denis Villeneuve on the Visionary World of 'Dune: Messiah'",
    category: "Exclusive Interview",
    source: "FrameMeta Editorial",
    date: "Oct 20, 2024",
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop",
    author: "Elena Vance",
    description: "The visionary director discusses the challenges of adapting the complex themes of the third book and what fans can expect from the final chapter of Paul Atreides' journey through Arrakis."
  },
  {
    id: 1002,
    title: "How 'The Bear' Redefined Modern Television Drama",
    category: "Analysis",
    source: "Variety",
    date: "Oct 19, 2024",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop",
    author: "Michael Berzatto",
    description: "A deep dive into why FX's culinary masterpiece resonates so deeply, from its high-octane kitchen sequences to its tender exploration of grief and family."
  },
  {
    id: 1003,
    title: "The Renaissance of Practical Effects in Blockbuster Cinema",
    category: "Feature Story",
    source: "The Hollywood Reporter",
    date: "Oct 18, 2024",
    readTime: "12 min read",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop",
    author: "Stan Winston Jr.",
    description: "As audiences show 'CGI fatigue,' major studios are returning to animatronics and miniature work. We talk to the SFX veterans leading the charge in Hollywood's tactile revival."
  },
  {
    id: 1004,
    title: "Upcoming Indie Gems to Watch This Award Season",
    category: "Must Read",
    source: "IndieWire",
    date: "Oct 17, 2024",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=2070&auto=format&fit=crop",
    author: "Sarah Gerwig",
    description: "Beyond the big-budget contenders, these smaller productions are making waves at festivals and are poised to become the breakout hits of the year."
  },
  {
    id: 1005,
    title: "Box Office: 'Gladiator II' Eyes a Monumental Global Opening",
    category: "Box Office",
    source: "Deadline",
    date: "Oct 16, 2024",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2070&auto=format&fit=crop",
    author: "Marcus Aurelius",
    description: "Tracking data suggests Ridley Scott's highly anticipated sequel could break November records as it prepares to charge into thousands of theaters worldwide."
  },
  {
    id: 1006,
    title: "Marvel Studios Confirms X-Men Integration Strategy",
    category: "Casting Update",
    source: "FrameMeta Exclusive",
    date: "Oct 15, 2024",
    readTime: "10 min read",
    imageUrl: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?q=80&w=2070&auto=format&fit=crop",
    author: "Charles Xavier",
    description: "Insiders reveal how the mutants will slowly enter the MCU over the next three phases, starting with a surprise character debut in the upcoming Avengers saga."
  },
  {
    id: 1007,
    title: "The Art of Cinematic Lighting in Modern Film Noir",
    category: "Technical",
    source: "American Cinematographer",
    date: "Oct 14, 2024",
    readTime: "15 min read",
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop",
    author: "Roger Deakins Jr.",
    description: "Mastering shadows and neon: current DPs explain how they're using digital sensors to achieve the high-contrast looks traditionally reserved for 35mm film."
  },
  {
    id: 1008,
    title: "HBO Max Expands Global Original Programming in Asia",
    category: "Industry News",
    source: "The Hollywood Reporter",
    date: "Oct 13, 2024",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=2070&auto=format&fit=crop",
    author: "Kim Seo-joon",
    description: "With massive growth in Southeast Asian markets, the streamer is greenlighting six new high-budget series across the Philippines, Korea, and Japan."
  },
  {
    id: 1009,
    title: "Retrospective: 25 Years of Studio Ghibli's Masterpieces",
    category: "Retrospective",
    source: "Criterion",
    date: "Oct 12, 2024",
    readTime: "9 min read",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop",
    author: "Joe Hisaishi",
    description: "A look back at how Miyazaki's unique vision transformed animation from a 'children's medium' into a globally respected form of high art."
  },
  {
    id: 1010,
    title: "The Rise of A24: How a Mini-Major Conquered the Oscars",
    category: "Analysis",
    source: "The Guardian",
    date: "Oct 11, 2024",
    readTime: "11 min read",
    imageUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop",
    author: "Florence Pugh",
    description: "Tracing the meteoric rise of the indie darling studio and its unconventional marketing strategies that made 'weird cinema' cool again."
  }
];

/**
 * FAQ SECTION
 */
export const faqHeading = {
  label: "",
  title: "Frequently Asked\nQuestions.",
  description: "Everything you need to know about navigating the global streaming landscape with FrameMeta. From real-time tracking to local trends, we've got you covered.",
};

export const faqData: FAQItem[] = [
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
];

/**
 * NEWSLETTER SECTION
 */
export const newsletterContent = {
  title: "Stay Ahead of the\nCinematic Curve.",
  subtitle: "Join 50,000+ cinephiles receiving weekly curated deep-dives, industry news, and early access to FrameMeta features.",
  placeholder: "Enter your email address",
  buttonText: "Subscribe",
  disclaimer: "By subscribing, you agree to our Privacy Policy and consent to receive updates.",
};
