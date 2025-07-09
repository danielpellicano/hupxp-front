// components/MovieGrid.tsx
"use client";
import { useState } from "react";
import { Movie } from "@/types/movie";
import MovieCard from "./MovieCard";
import MovieModal from "./MovieModal";

interface Props {
  movies: Movie[];
}

export default function MovieGrid({ movies }: Props) {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  return (
    <div className="container mx-auto px-4">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {movies.map((movie) => (
          <div key={movie.id} onClick={() => setSelectedMovie(movie)}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
