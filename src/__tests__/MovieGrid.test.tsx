import { render, screen, fireEvent } from "@testing-library/react";
import MovieGrid from "@/components/MovieGrid";
import { Movie } from "@/types/movie";
import { useState } from "react";
import { within } from "@testing-library/react";

// Mock do MovieModal para evitar dependência externa
jest.mock("@/components/MovieModal", () => ({ movie, onClose }: any) => (
  <div data-testid="modal">
    <h1>{movie.title}</h1>
    <button onClick={onClose}>Fechar</button>
  </div>
));

const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Matrix",
    poster_path: "/matrix.jpg",
    overview: "Um hacker descobre a verdade sobre a realidade.",
    release_date: "1999-03-31",
    vote_average: 8.7,
    genre_ids: [28],
  },
  {
    id: 2,
    title: "Inception",
    poster_path: "/inception.jpg",
    overview: "Um ladrão invade sonhos para roubar segredos.",
    release_date: "2010-07-16",
    vote_average: 8.8,
    genre_ids: [878],
  },
];

describe("MovieGrid", () => {
  it("renderiza os cards de filme corretamente", () => {
    render(<MovieGrid movies={mockMovies} />);
    expect(screen.getByText("Matrix")).toBeInTheDocument();
    expect(screen.getByText("Inception")).toBeInTheDocument();
  });

  it("abre o modal ao clicar em um filme", () => {
    render(<MovieGrid movies={mockMovies} />);
    fireEvent.click(screen.getByText("Matrix"));

    const modal = screen.getByTestId("modal");
    expect(modal).toBeInTheDocument();

    // Valida o conteúdo dentro do modal
    const utils = within(modal);
    expect(utils.getByText("Matrix")).toBeInTheDocument();
  });

  it("fecha o modal ao clicar em 'Fechar'", () => {
    render(<MovieGrid movies={mockMovies} />);
    fireEvent.click(screen.getByText("Matrix"));

    const closeButton = screen.getByText("Fechar");
    fireEvent.click(closeButton);

    // Modal deve desaparecer
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });
});
