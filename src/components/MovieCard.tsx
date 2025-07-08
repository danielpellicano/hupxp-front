import { Movie } from "@/types/movie";
import Image from "next/image";

interface Props {
  movie: Movie;
}

export default function MovieCard({ movie }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:scale-[1.03] transition duration-300 group cursor-pointer">
      <div className="relative w-full h-72">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          fill
          className="object-cover group-hover:opacity-90 transition"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-3">
        <h2 className="text-sm font-semibold text-gray-800 line-clamp-2">
          {movie.title}
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          ⭐ {movie.vote_average.toFixed(1)} | 📅{" "}
          {movie.release_date?.split("-")[0]}
        </p>
      </div>
    </div>
  );
}
