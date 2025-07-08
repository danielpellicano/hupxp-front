import { apiFetch } from "@/utils/fetch";
import { Movie, MovieDetails } from "@/types/movie";

const API = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export async function getPopularMovies(page = 1): Promise<Movie[]> {
  const url = `${API}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=${page}`;
  const data = await apiFetch<{ results: Movie[] }>(url);
  return data.results;
}

export async function getMovieDetails(id: number): Promise<MovieDetails> {
  const url = `${API}/movie/${id}?api_key=${API_KEY}&append_to_response=videos,credits&language=pt-BR`;
  const data = await apiFetch<MovieDetails>(url);
  return data;
}