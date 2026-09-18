import { tmdbApi } from "./tmdbApi";

export const movieApi = {
  getAllMovies: () => tmdbApi.getAllMovies(),
  getCategories: () => tmdbApi.getCategories(),
  getMoviesByCategory: (category) => tmdbApi.getMoviesByCategory(category),
  searchMovies: (query) => tmdbApi.searchMovies(query),
  getMovieById: (id) => tmdbApi.getMovieById(id),
};