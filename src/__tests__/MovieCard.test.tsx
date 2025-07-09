// src/__tests__/MovieCard.test.tsx
import { render, screen } from "@testing-library/react";
import MovieCard from "@/components/MovieCard";
import { Movie } from "@/types/movie";

describe("MovieCard", () => {
  const movie: Movie = {
    id: 123,
    title: "O Poderoso Chefão",
    poster_path: "/godfather.jpg",
    overview: "Um épico de máfia",
    release_date: "1972-03-24",
    vote_average: 9.2,
    genre_ids: [18],
  };

  it("exibe o título do filme", () => {
    render(<MovieCard movie={movie} />);
    expect(screen.getByText("O Poderoso Chefão")).toBeInTheDocument();
  });

  it("exibe o ano da data de lançamento", () => {
    render(<MovieCard movie={movie} />);
    expect(
      screen.getByText((text) => text.includes("1972"))
    ).toBeInTheDocument();
  });

  it("exibe a imagem com alt correto", () => {
    render(<MovieCard movie={movie} />);
    const image = screen.getByAltText("O Poderoso Chefão");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("alt", "O Poderoso Chefão");
  });
});
