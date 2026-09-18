// src/api/tmdbConfig.js
export const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// TMDB's genre IDs are fixed/stable — mapping the ones matching your app's categories
export const GENRE_MAP = {
  Action: 28,
  Drama: 18,
  Comedy: 35,
  Horror: 27,
  "Sci-Fi": 878,
  Romance: 10749,
  Thriller: 53,
  Animation: 16,
};
export const GENRE_ID_TO_NAME = Object.fromEntries(
  Object.entries(GENRE_MAP).map(([name, id]) => [id, name])
);