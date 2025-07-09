import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MovieModal from "@/components/MovieModal";
import { Movie } from "@/types/movie";
import { getMovieDetails } from "@/services/tmdb";

// 🧪 Mock da função getMovieDetails
jest.mock("@/services/tmdb", () => ({
  getMovieDetails: jest.fn(),
}));

const mockMovie: Movie = {
  id: 1,
  title: "Matrix",
  poster_path: "/matrix.jpg",
  overview: "Filme de ação",
  release_date: "1999-03-31",
  vote_average: 8.7,
  genre_ids: [28],
};

const mockDetails = {
  ...mockMovie,
  tagline: "Welcome to the Real World",
  runtime: 136,
  genres: [
    { id: 1, name: "Ação" },
    { id: 2, name: "Ficção Científica" },
  ],
  vote_average: 8.7,
  release_date: "1999-03-31",
  videos: {
    results: [
      {
        key: "abc123",
        site: "YouTube",
        type: "Trailer",
      },
    ],
  },
  credits: {
    cast: [
      {
        id: 1,
        name: "Keanu Reeves",
        character: "Neo",
        profile_path: "/keanu.jpg",
      },
    ],
  },
};

describe("MovieModal", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    (getMovieDetails as jest.Mock).mockResolvedValue(mockDetails);
  });

  it("renderiza corretamente os detalhes do filme", async () => {
    render(<MovieModal movie={mockMovie} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText("Matrix")).toBeInTheDocument();
    });

    expect(screen.getByText("Welcome to the Real World")).toBeInTheDocument();
    expect(
      screen.getByText(
        (content) =>
          content.includes("Ação") && content.includes("Ficção Científica")
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((text) => text.includes("136") && text.includes("min"))
    ).toBeInTheDocument();
    expect(screen.getByText("Keanu Reeves")).toBeInTheDocument();
    expect(screen.getByTitle("Trailer")).toBeInTheDocument();
  });

  it("fecha o modal ao clicar no botão ×", async () => {
    render(<MovieModal movie={mockMovie} onClose={mockOnClose} />);

    await waitFor(() => screen.getByText("Matrix"));

    fireEvent.click(screen.getByText("×"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("fecha o modal ao pressionar ESC", async () => {
    render(<MovieModal movie={mockMovie} onClose={mockOnClose} />);

    await waitFor(() => screen.getByText("Matrix"));

    fireEvent.keyDown(window, { key: "Escape" });
    expect(mockOnClose).toHaveBeenCalled();
  });
});
