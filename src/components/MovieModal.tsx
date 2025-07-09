"use client";
import { useEffect, useState } from "react";
import { Movie, MovieDetails } from "@/types/movie";
import { getMovieDetails } from "@/services/tmdb";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  movie: Movie;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: Props) {
  const [details, setDetails] = useState<MovieDetails | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    getMovieDetails(movie.id).then(setDetails);
  }, [movie.id]);

  if (!details) return null;

  const trailer = details.videos?.results.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-900 text-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        >
          <button
            className="absolute top-3 right-4 text-white text-3xl hover:text-red-400 transition cursor-pointer"
            onClick={onClose}
          >
            &times;
          </button>

          <div className="flex flex-col md:flex-row">
            <img
              src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
              alt={details.title}
              className="w-full md:w-1/3 object-cover rounded-l-xl"
            />

            <div className="p-6 flex-1">
              <h2 className="text-3xl font-bold mb-1 text-rose-400">
                {details.title}
              </h2>
              <p className="text-sm italic text-gray-300">{details.tagline}</p>

              <p className="text-sm mt-4 text-gray-200">{details.overview}</p>

              <div className="text-sm text-gray-400 mt-4 space-y-1">
                <p>
                  🎭 <strong>Gêneros:</strong>{" "}
                  {details.genres.map((g) => g.name).join(", ")}
                </p>
                <p>
                  ⏱️ <strong>Duração:</strong> {details.runtime} min
                </p>
                <p>
                  📅 <strong>Lançamento:</strong>{" "}
                  {details.release_date?.split("-")[0]}
                </p>
                <p>
                  ⭐ <strong>Avaliação:</strong>{" "}
                  {details.vote_average.toFixed(1)}
                </p>
              </div>

              {trailer && (
                <div className="mt-6 border-2 border-rose-400 rounded-lg overflow-hidden">
                  <iframe
                    className="w-full h-56"
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title="Trailer"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          </div>

          {Array.isArray(details.credits?.cast) &&
            details.credits.cast.length > 0 && (
              <div className="p-6 bg-gray-800 border-t border-gray-700">
                <h3 className="text-lg font-semibold mb-3 text-white">
                  🎬 Elenco Principal
                </h3>
                <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-rose-400 pb-2">
                  {details.credits.cast.slice(0, 12).map((actor) => (
                    <div
                      key={actor.id}
                      className="min-w-[90px] text-center text-gray-200"
                    >
                      {actor.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                          alt={actor.name}
                          className="w-20 h-20 object-cover rounded-full mx-auto border-2 border-gray-600"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-600 mx-auto" />
                      )}
                      <p className="text-xs mt-1 font-medium">{actor.name}</p>
                      <p className="text-[11px] text-gray-400">
                        {actor.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
