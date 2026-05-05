const collectionsHeading = {
  title: "Collections",
  subtitle: "Epic franchises and legendary trilogies",
} as const;

const collectionsData = [
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
    genre: "Action • Sci-Fi",
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
    genre: "Action • Crime",
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
    genre: "Sci-Fi • Action",
    year: "1999-2021",
    totalRuntime: "9h 14m",
    backgroundImage: "/images/poster-placeholder.jpg",
  }
];

export const collectionsContent = {
  heading: collectionsHeading,
  items: collectionsData,
} as const;

