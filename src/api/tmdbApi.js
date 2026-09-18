import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL, GENRE_MAP, GENRE_ID_TO_NAME } from "./tmdbConfig";

async function tmdbRequest(path) {
  const separator = path.includes("?") ? "&" : "?";
  const url = `${TMDB_BASE_URL}${path}${separator}api_key=${TMDB_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB error ${res.status}`);
  return res.json();
}

function mapCategory(movie) {
  if (movie.genres?.length) return movie.genres[0].name;
  if (movie.genre_ids?.length) return GENRE_ID_TO_NAME[movie.genre_ids[0]] || "Other";
  return "Other";
}

const RENTAL_PRICE = 3.99;

function normalizeMovie(m) {
  return {
    id: String(m.id),
    title: m.title,
    year: m.release_date ? m.release_date.slice(0, 4) : "N/A",
    category: mapCategory(m),
    rating: m.vote_average ? Math.round((m.vote_average / 2) * 10) / 10 : 0,
    price: RENTAL_PRICE,
    poster: m.poster_path ? `${TMDB_IMAGE_BASE_URL}${m.poster_path}` : null,
    poster_path: m.poster_path,
    synopsis: m.overview || "No synopsis available.",
  };
}

export const tmdbApi = {
  getAllMovies: async () => {
    const data = await tmdbRequest("/movie/popular");
    return data.results.map(normalizeMovie);
  },

  getCategories: async () => Object.keys(GENRE_MAP),

  getMoviesByCategory: async (category) => {
    const genreId = GENRE_MAP[category];
    if (!genreId) return [];
    const data = await tmdbRequest(`/discover/movie?with_genres=${genreId}`);
    return data.results.map(normalizeMovie);
  },

  searchMovies: async (query) => {
    if (!query.trim()) return [];
    const data = await tmdbRequest(`/search/movie?query=${encodeURIComponent(query)}`);
    return data.results.map(normalizeMovie);
  },

  getMovieById: async (id) => {
    const data = await tmdbRequest(`/movie/${id}`);
    return normalizeMovie(data);
  },
};