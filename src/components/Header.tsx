"use client";

import { ChangeEvent } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onGenreSelect: (id: number, label: string) => void;
}

const genres = [
  { id: 28, label: "Ação" },
  { id: 35, label: "Comédia" },
  { id: 18, label: "Drama" },
  { id: 27, label: "Terror" },
];

export default function Header({
  search,
  onSearchChange,
  onGenreSelect,
}: HeaderProps) {
  return (
    <header className="bg-gray-900 text-white px-4 py-5 shadow-md sticky top-0 z-40">
      <div className="container mx-auto flex flex-col items-center md:flex-row md:items-center md:justify-between gap-4 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-rose-400">
          🎬 Explorer de Filmes
        </h1>

        <div className="flex flex-wrap gap-2 justify-center md:justify-start text-sm mt-2">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => onGenreSelect(genre.id, genre.label)}
              className="bg-gray-800 px-3 py-1 rounded-full hover:bg-rose-500 transition text-white"
            >
              {genre.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-auto">
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar filme..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onSearchChange(e.target.value)
            }
            className="w-full md:w-80 pl-10 pr-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>
      </div>
    </header>
  );
}
