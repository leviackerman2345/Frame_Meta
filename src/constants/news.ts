import type { NewsItem } from "@/types/types";

const featuredNewsHeading = {
  title: "Featured News",
  subtitle: "The latest headlines from the world of cinema",
} as const;

const featuredNewsData = [
  {
    id: 1001,
    title: "Denis Villeneuve on the Visionary World of 'Dune: Messiah'",
    category: "Exclusive Interview",
    source: "FrameMeta Editorial",
    date: "Oct 20, 2024",
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop",
    author: "Elena Vance",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    sourceLogo: "https://svgl.app/library/apple_dark.svg",
    slug: "dune-messiah-interview",
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
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    sourceLogo: "https://www.variety.com/wp-content/themes/vip/pmc-variety-2020/assets/public/images/variety-logo.svg",
    slug: "the-bear-tv-drama",
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
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    sourceLogo: "https://www.hollywoodreporter.com/wp-content/themes/vip/pmc-hollywoodreporter-2021/assets/public/images/logo.svg",
    slug: "practical-effects-renaissance",
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
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    sourceLogo: "https://www.indiewire.com/wp-content/themes/vip/pmc-indiewire-2023/assets/public/images/logo.svg",
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
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    sourceLogo: "https://deadline.com/wp-content/themes/vip/pmc-deadline-2019/assets/public/images/logo.svg",
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
] satisfies NewsItem[];

export const newsContent = {
  featured: {
    heading: featuredNewsHeading,
    items: featuredNewsData,
  },
} as const;

