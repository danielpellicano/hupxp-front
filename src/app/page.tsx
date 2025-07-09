"use client";
import { useEffect, useRef, useState } from "react";
import {
  getMoviesByGenre,
  getPopularMovies,
  searchMovies,
} from "@/services/tmdb";
import { Movie } from "@/types/movie";
import MovieGrid from "@/components/MovieGrid";
import { useDebounce } from "@/hooks/useDebounce";
import Header from "@/components/Header";
import Loader from "@/components/Loader";

export default function Home() {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [visibleMovies, setVisibleMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loader = useRef<HTMLDivElement | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [genreFilter, setGenreFilter] = useState<{
    id: number;
    label: string;
  } | null>(null);

  const isSearching = debouncedQuery.trim().length > 0;
  const isFiltering = !!genreFilter;
  const CHUNK_SIZE = 18;

  const moviesToShow = isSearching || isFiltering ? movies : visibleMovies;

  // Busca filmes populares com paginação
  useEffect(() => {
    if (isSearching || isFiltering) return;

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
  }, [page, isSearching, isFiltering]);

  // Mostra mais da lista acumulada
  useEffect(() => {
    if (allMovies.length === 0 || isSearching || isFiltering) return;
    setVisibleMovies((prev) => {
      const next = allMovies.slice(prev.length, prev.length + CHUNK_SIZE);
      return [...prev, ...next];
    });
  }, [allMovies, isSearching, isFiltering]);

  // Busca por texto
  useEffect(() => {
    if (!isSearching) return;

    setGenreFilter(null); // limpa filtro ao buscar
    setLoading(true);

    searchMovies(debouncedQuery)
      .then(setMovies)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [debouncedQuery, isSearching]);

  // Busca por gênero
  useEffect(() => {
    if (!genreFilter) return;

    setLoading(true);
    setMovies([]); // limpa resultados anteriores

    getMoviesByGenre(genreFilter.id)
      .then(setMovies)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [genreFilter]);

  // Infinite scroll (somente em popular)
  useEffect(() => {
    if (isSearching || isFiltering) return;

    const currentLoader = loader.current; // 🔐 copia local
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loading) {
          const hasMoreLocal = allMovies.length > visibleMovies.length;
          if (hasMoreLocal) {
            setVisibleMovies((prev) => {
              const next = allMovies.slice(
                prev.length,
                prev.length + CHUNK_SIZE
              );
              return [...prev, ...next];
            });
          } else {
            setPage((prev) => prev + 1);
          }
        }
      },
      { threshold: 1 }
    );

    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [loading, allMovies, visibleMovies, isSearching, isFiltering]);

  return (
    <>
      <Header
        search={query}
        onSearchChange={(text) => {
          setQuery(text);
          if (genreFilter) setGenreFilter(null); // limpa filtro se buscar
        }}
        onGenreSelect={(id, label) => {
          setQuery(""); // limpa busca se filtrar
          setGenreFilter({ id, label });
        }}
      />
      <main className="p-4 flex-col flex items-center justify-center min-h-[80vh]">
        <h1 className="text-2xl font-bold mb-4 text-center text-white">
          {isSearching ? (
            <>
              Resultado da busca para:{" "}
              <span className="underline text-rose-400">
                &quot;{debouncedQuery}&quot;
              </span>
            </>
          ) : genreFilter ? (
            <>
              Filmes de{" "}
              <span className="underline text-rose-400">
                {genreFilter.label}
              </span>
            </>
          ) : (
            "Filmes Populares"
          )}
        </h1>

        {moviesToShow.length > 0 ? (
          <MovieGrid movies={moviesToShow} />
        ) : isSearching || genreFilter ? (
          <div className="flex flex-col justify-center items-center h-full text-center mt-0">
            <p className="text-gray-400 text-lg">
              Nenhum filme encontrado para essa busca.
            </p>
          </div>
        ) : null}

        {loading && <Loader />}
        {!isSearching && !isFiltering && <div ref={loader} />}
      </main>
    </>
  );
}
