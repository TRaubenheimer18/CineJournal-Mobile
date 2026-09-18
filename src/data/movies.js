export const CATEGORIES = [
  "Action", "Drama", "Comedy", "Horror", "Sci-Fi", "Romance", "Thriller", "Animation",
];

export const MOVIES = [
  { id: "1", title: "Neon Skyline", year: 2023, category: "Sci-Fi", rating: 4.2, price: 3.99, poster: "https://picsum.photos/seed/movie1/300/450", synopsis: "In a city ruled by corporations, a hacker uncovers a conspiracy that threatens to unravel reality itself." },
  { id: "2", title: "Autumn Letters", year: 2022, category: "Drama", rating: 4.6, price: 2.99, poster: "https://picsum.photos/seed/movie2/300/450", synopsis: "Two estranged siblings reconnect over a summer spent cleaning out their late father's house." },
  { id: "3", title: "Last Laugh", year: 2021, category: "Comedy", rating: 3.8, price: 2.49, poster: "https://picsum.photos/seed/movie3/300/450", synopsis: "A washed-up comedian gets one final shot at redemption on live television." },
  { id: "4", title: "The Hollow House", year: 2024, category: "Horror", rating: 4.0, price: 4.49, poster: "https://picsum.photos/seed/movie4/300/450", synopsis: "A family moves into a house that remembers everyone who has ever lived there." },
  { id: "5", title: "Velocity", year: 2023, category: "Action", rating: 3.9, price: 3.49, poster: "https://picsum.photos/seed/movie5/300/450", synopsis: "An ex-driver is pulled back into the underground racing world for one last job." },
  { id: "6", title: "Paper Hearts", year: 2020, category: "Romance", rating: 4.3, price: 2.99, poster: "https://picsum.photos/seed/movie6/300/450", synopsis: "Two rival letter-writers fall for each other without knowing who's on the other end." },
  { id: "7", title: "Static", year: 2022, category: "Thriller", rating: 4.1, price: 3.99, poster: "https://picsum.photos/seed/movie7/300/450", synopsis: "A radio host receives a call that predicts a crime before it happens." },
  { id: "8", title: "Wildflower", year: 2019, category: "Animation", rating: 4.7, price: 2.99, poster: "https://picsum.photos/seed/movie8/300/450", synopsis: "A tiny seed's journey across a vast garden, told without a single word of dialogue." },
  { id: "9", title: "Midnight Freight", year: 2021, category: "Action", rating: 3.6, price: 3.49, poster: "https://picsum.photos/seed/movie9/300/450", synopsis: "A cargo pilot must outrun smugglers who've hidden something dangerous aboard her plane." },
  { id: "10", title: "The Quiet Room", year: 2023, category: "Drama", rating: 4.4, price: 3.99, poster: "https://picsum.photos/seed/movie10/300/450", synopsis: "A therapist's own life unravels as she counsels a patient who mirrors her past." },
];

export const getMovieById = (id) => MOVIES.find((m) => m.id === id);
export const getMoviesByCategory = (category) => MOVIES.filter((m) => m.category === category);
export const searchMovies = (query) =>
  MOVIES.filter((m) => m.title.toLowerCase().includes(query.toLowerCase()));