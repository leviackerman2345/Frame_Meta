export interface CuratedCollaborator {
  id: number;
  name: string;
  role: string;
  profilePath?: string;
}

export interface CuratedPerson {
  id: number;
  name: string;
  role: 'Director' | 'Cinematographer' | 'Actor' | 'Screenwriter';
  profilePath: string;
  signatureAesthetics: string[];
  awardsBadge: string;
  bio: string;
  birthdate: string;
  location: string;
  youtubeLoopId: string;
  frequentCollaborators: CuratedCollaborator[];
  isSpotlight?: boolean;
  isAcademyWinner?: boolean;
}

export const curatedPeople: CuratedPerson[] = [
  {
    id: 137427,
    name: "Denis Villeneuve",
    role: "Director",
    profilePath: "/zdDx9Xs93UIrJFWYApYR28J8M6b.jpg",
    signatureAesthetics: ["Brutalist Scale", "Sensory Realism", "Scale & Silence", "Dynamic Desert Gradients"],
    awardsBadge: "3 Oscar Noms • Cannes Nominee • BAFTA Winner",
    bio: "Renowned Canadian filmmaker who has revitalized high-concept science fiction. Villeneuve is celebrated for his vast visual scale, atmospheric sound design, and masterfully controlled pacing, as seen in Dune, Arrival, and Blade Runner 2049.",
    birthdate: "October 3, 1967",
    location: "Gentilly, Quebec, Canada",
    youtubeLoopId: "4C3Y7Gj309M",
    isSpotlight: true,
    isAcademyWinner: false,
    frequentCollaborators: [
      { id: 1190668, name: "Timothée Chalamet", role: "Actor", profilePath: "/dFxpwRpmzpVfP1zjluH68DeQhyj.jpg" },
      { id: 151, name: "Roger Deakins", role: "Cinematographer", profilePath: "/y6tSqoDvl705BnLELyCuUqQujfv.jpg" },
      { id: 67113, name: "Greig Fraser", role: "Cinematographer", profilePath: "/cwj0aValmr7TGQ2OOQk5CAy1PWf.jpg" },
      { id: 2037, name: "Cillian Murphy", role: "Actor", profilePath: "/ycZpLjHxsNPvsB6ndu2D9qsx94X.jpg" }
    ]
  },
  {
    id: 525,
    name: "Christopher Nolan",
    role: "Director",
    profilePath: "/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg",
    signatureAesthetics: ["Practical Effects", "Non-Linear Timelines", "IMAX Grandeur", "Shepard Tone Soundscapes"],
    awardsBadge: "2 Academy Awards • 5 Noms • Golden Globe Winner",
    bio: "One of the most successful and influential directors of the 21st century. Nolan crafts cerebral, blockbuster epics like Interstellar, Inception, and Oppenheimer, utilizing native IMAX film and prioritizing physical effects over digital animation.",
    birthdate: "July 30, 1970",
    location: "London, England",
    youtubeLoopId: "F-eMt3SrfFU",
    isAcademyWinner: true,
    frequentCollaborators: [
      { id: 2037, name: "Cillian Murphy", role: "Actor", profilePath: "/ycZpLjHxsNPvsB6ndu2D9qsx94X.jpg" },
      { id: 74401, name: "Hoyte van Hoytema", role: "Cinematographer", profilePath: "/y2HXvac1oPzciwxfdyWc5syThRk.jpg" }
    ]
  },
  {
    id: 151,
    name: "Roger Deakins",
    role: "Cinematographer",
    profilePath: "/y6tSqoDvl705BnLELyCuUqQujfv.jpg",
    signatureAesthetics: ["Perfect Symmetry", "Silhouetted Figures", "Warm Amber Lighting", "Muted Shadow Separation"],
    awardsBadge: "2 Academy Awards • 16 Nominations • ASC Lifetime Achievement",
    bio: "Widely regarded as one of the most influential cinematographers of all time. Deakins is legendary for his work with the Coen brothers, Sam Mendes, and Denis Villeneuve, bringing breathtaking visual clarity and painterly silhouettes to life.",
    birthdate: "May 24, 1949",
    location: "Torquay, Devon, England",
    youtubeLoopId: "jNlC77rGZ4Y",
    isAcademyWinner: true,
    frequentCollaborators: [
      { id: 137427, name: "Denis Villeneuve", role: "Director", profilePath: "/zdDx9Xs93UIrJFWYApYR28J8M6b.jpg" }
    ]
  },
  {
    id: 67113,
    name: "Greig Fraser",
    role: "Cinematographer",
    profilePath: "/cwj0aValmr7TGQ2OOQk5CAy1PWf.jpg",
    signatureAesthetics: ["Low-Key Ambient Light", "Tactile Textures", "Anamorphic Distortion", "Industrial Moodiness"],
    awardsBadge: "1 Academy Award • 2 Nominations • BAFTA Winner",
    bio: "Australian cinematographer renowned for his stunning lighting techniques. Fraser brought a visual revolution to Dune: Part One and Part Two, Rogue One: A Star Wars Story, and Matt Reeves' The Batman, blending digital and film elements seamlessly.",
    birthdate: "October 3, 1975",
    location: "Melbourne, Victoria, Australia",
    youtubeLoopId: "u0vS-mHjW4Q",
    isAcademyWinner: true,
    frequentCollaborators: [
      { id: 137427, name: "Denis Villeneuve", role: "Director", profilePath: "/zdDx9Xs93UIrJFWYApYR28J8M6b.jpg" },
      { id: 1190668, name: "Timothée Chalamet", role: "Actor", profilePath: "/dFxpwRpmzpVfP1zjluH68DeQhyj.jpg" }
    ]
  },
  {
    id: 74401,
    name: "Hoyte van Hoytema",
    role: "Cinematographer",
    profilePath: "/y2HXvac1oPzciwxfdyWc5syThRk.jpg",
    signatureAesthetics: ["IMAX Immersion", "Natural Light Sourcing", "Physical Camera Rigging", "Rich Monochromatic Tones"],
    awardsBadge: "1 Academy Award • 2 Nominations • ASC Award Winner",
    bio: "Swiss-Dutch cinematographer who has pushed the boundaries of large-format filmmaking. Working closely with Christopher Nolan on Interstellar, Dunkirk, and Oppenheimer, he pioneered vertical and macro IMAX cinematography.",
    birthdate: "October 4, 1971",
    location: "Horgen, Zürich, Switzerland",
    youtubeLoopId: "xRkU3R-4hZ0",
    isAcademyWinner: true,
    frequentCollaborators: [
      { id: 525, name: "Christopher Nolan", role: "Director", profilePath: "/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg" },
      { id: 2037, name: "Cillian Murphy", role: "Actor", profilePath: "/ycZpLjHxsNPvsB6ndu2D9qsx94X.jpg" }
    ]
  },
  {
    id: 1190668,
    name: "Timothée Chalamet",
    role: "Actor",
    profilePath: "/dFxpwRpmzpVfP1zjluH68DeQhyj.jpg",
    signatureAesthetics: ["Melancholic Depth", "Classical Poise", "Expressive Vulnerability", "Lyrical Line Delivery"],
    awardsBadge: "1 Oscar Nomination • 3 BAFTA Nominations",
    bio: "One of the defining actors of his generation. Leading giant franchises like Dune and Wonka while retaining his indie credentials in Call Me By Your Name and Lady Bird, Chalamet combines delicate charm with high physical commitment.",
    birthdate: "December 27, 1995",
    location: "Hell's Kitchen, Manhattan, New York, USA",
    youtubeLoopId: "j-7x0jPzQeA",
    isAcademyWinner: false,
    frequentCollaborators: [
      { id: 137427, name: "Denis Villeneuve", role: "Director", profilePath: "/zdDx9Xs93UIrJFWYApYR28J8M6b.jpg" },
      { id: 67113, name: "Greig Fraser", role: "Cinematographer", profilePath: "/cwj0aValmr7TGQ2OOQk5CAy1PWf.jpg" }
    ]
  },
  {
    id: 2037,
    name: "Cillian Murphy",
    role: "Actor",
    profilePath: "/ycZpLjHxsNPvsB6ndu2D9qsx94X.jpg",
    signatureAesthetics: ["Piercing Blue Eyes", "Steely Stoicism", "Physical Underplay", "Gothic Intensity"],
    awardsBadge: "1 Academy Award • 1 BAFTA Winner • 1 SAG Award",
    bio: "Irish actor celebrated for his intense gaze and chameleon-like physical transformations. From his decades-long creative partnership with Christopher Nolan culminating in Oppenheimer, to Peaky Blinders, Murphy is a master of internal drama.",
    birthdate: "May 25, 1976",
    location: "Douglas, Cork, Ireland",
    youtubeLoopId: "wN3y2yX2K8k",
    isAcademyWinner: true,
    frequentCollaborators: [
      { id: 525, name: "Christopher Nolan", role: "Director", profilePath: "/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg" },
      { id: 74401, name: "Hoyte van Hoytema", role: "Cinematographer", profilePath: "/y2HXvac1oPzciwxfdyWc5syThRk.jpg" }
    ]
  },
  {
    id: 291263,
    name: "Jordan Peele",
    role: "Director",
    profilePath: "/kFUKn5g3ebpyZ3CSZZZo2HFWRNQ.jpg",
    signatureAesthetics: ["Social Satire", "Neo-Realist Horror", "Saturated Suburbia", "Spence Sound Design"],
    awardsBadge: "1 Academy Award (Screenplay) • 4 Nominations",
    bio: "American writer, director, and producer who has redefined modern horror with Get Out, Us, and Nope. Peele masterfully infuses genre films with sharp cultural critique and exquisite cinematic styling.",
    birthdate: "February 21, 1979",
    location: "New York City, New York, USA",
    youtubeLoopId: "f0QG90538aQ",
    isAcademyWinner: true,
    frequentCollaborators: [
      { id: 74401, name: "Hoyte van Hoytema", role: "Cinematographer", profilePath: "/y2HXvac1oPzciwxfdyWc5syThRk.jpg" }
    ]
  },
  {
    id: 138,
    name: "Quentin Tarantino",
    role: "Director",
    profilePath: "/1gjcpAa99FAOWGnrUvHEXXsRs7o.jpg",
    signatureAesthetics: ["Sharp Dialogue", "Vibrant Saturation", "Spaghetti Western Riffs", "Trunk Shots & Feet Focus"],
    awardsBadge: "2 Academy Awards (Screenplay) • 8 Nominations",
    bio: "One of the most stylistically distinct and recognized screenwriters and directors of all time. Tarantino is legendary for his high-energy stories, vintage music soundtracks, and graphic genre subversions.",
    birthdate: "March 27, 1963",
    location: "Knoxville, Tennessee, USA",
    youtubeLoopId: "Fk3gHq0QZxE",
    isAcademyWinner: true,
    frequentCollaborators: []
  },
  {
    id: 1032,
    name: "Martin Scorsese",
    role: "Director",
    profilePath: "/9U9Y5GQuWX3EZy39B8nkk4NY01S.jpg",
    signatureAesthetics: ["Rapid Editing Cuts", "Tracking Shots", "Guilt & Redemption Themes", "Classic Rock Needle drops"],
    awardsBadge: "1 Academy Award • 14 Nominations • Cannes Palme d'Or",
    bio: "A titan of cinema history. For over five decades, Scorsese has shaped American filmmaking with masterpieces of crime, history, and character exploration, such as Taxi Driver, Goodfellas, and The Departed.",
    birthdate: "November 17, 1942",
    location: "Queens, New York City, New York, USA",
    youtubeLoopId: "6p605387z2Q",
    isAcademyWinner: true,
    frequentCollaborators: []
  }
];

export function getCuratedPersonById(id: number | string): CuratedPerson | undefined {
  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  return curatedPeople.find(p => p.id === numId);
}
