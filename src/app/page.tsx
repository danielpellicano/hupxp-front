"use client";
import { useEffect, useRef, useState } from "react";
import { getPopularMovies } from "@/services/tmdb";
import { Movie } from "@/types/movie";
import MovieGrid from "@/components/MovieGrid";

export default function Home() {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [visibleMovies, setVisibleMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loader = useRef<HTMLDivElement | null>(null);

  const CHUNK_SIZE = 18;

  // busca novos filmes da API (20 por página)
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const newMovies = await getPopularMovies(page);
      setAllMovies((prev) => {
        const merged = [...prev, ...newMovies];
        const unique = merged.filter(
          (movie, index, self) =>
            index === self.findIndex((m) => m.id === movie.id)
        );
        return unique;
      });
      setLoading(false);
    };
    fetchMovies();
  }, [page]);

  // mostra 18 a mais da lista acumulada
  useEffect(() => {
    if (allMovies.length === 0) return;
    setVisibleMovies((prev) => {
      const next = allMovies.slice(prev.length, prev.length + CHUNK_SIZE);
      return [...prev, ...next];
    });
  }, [allMovies]);

  // ativa quando chega no fim da tela
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loading) {
          const hasMoreLocal = allMovies.length > visibleMovies.length;
          if (hasMoreLocal) {
            // já temos filmes, só mostrar mais
            setVisibleMovies((prev) => {
              const next = allMovies.slice(
                prev.length,
                prev.length + CHUNK_SIZE
              );
              return [...prev, ...next];
            });
          } else {
            // precisamos buscar mais da API
            setPage((prev) => prev + 1);
          }
        }
      },
      { threshold: 1 }
    );

    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [loading, allMovies, visibleMovies]);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Filmes Populares</h1>
      <MovieGrid movies={visibleMovies} />
      <div ref={loader} className="h-12 flex justify-center items-center mt-4">
        {loading && (
          <span className="text-sm text-gray-500">Carregando...</span>
        )}
      </div>
    </main>
  );
}
