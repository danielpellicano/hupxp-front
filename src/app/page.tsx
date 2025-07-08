// app/page.tsx (App Router)
import { getPopularMovies } from "@/services/tmdb";
import MovieGrid from "@/components/MovieGrid";

export default async function Home() {
  const movies = await getPopularMovies();

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Filmes Populares</h1>
      <MovieGrid movies={movies} />
    </main>
  );
}
