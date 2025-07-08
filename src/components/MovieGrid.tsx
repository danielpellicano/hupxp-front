import { Movie } from "@/types/movie";
import MovieCard from "./MovieCard";

interface Props {
  movies: Movie[];
}

export default function MovieGrid({ movies }: Props) {
  return (
    <div className="container mx-auto px-4">
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
