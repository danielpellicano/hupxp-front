// src/__tests__/Header.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "@/components/Header";

// Ignora os ícones de forma segura para ambiente de teste
jest.mock("@heroicons/react/24/outline", () => ({
  MagnifyingGlassIcon: () => <div data-testid="icon" />,
}));

describe("Header", () => {
  const mockOnSearchChange = jest.fn();
  const mockOnGenreSelect = jest.fn();

  beforeEach(() => {
    render(
      <Header
        search="matrix"
        onSearchChange={mockOnSearchChange}
        onGenreSelect={mockOnGenreSelect}
      />
    );
  });

  it("exibe o título do app", () => {
    expect(screen.getByText("🎬 Explorer de Filmes")).toBeInTheDocument();
  });

  it("renderiza os botões de gênero", () => {
    expect(screen.getByText("Ação")).toBeInTheDocument();
    expect(screen.getByText("Comédia")).toBeInTheDocument();
    expect(screen.getByText("Drama")).toBeInTheDocument();
    expect(screen.getByText("Terror")).toBeInTheDocument();
  });

  it("chama onGenreSelect ao clicar em um gênero", () => {
    fireEvent.click(screen.getByText("Ação"));
    expect(mockOnGenreSelect).toHaveBeenCalledWith(28, "Ação");
  });

  it("mostra o valor do input de busca", () => {
    expect(screen.getByDisplayValue("matrix")).toBeInTheDocument();
  });

  it("chama onSearchChange ao digitar no input", () => {
    const input = screen.getByPlaceholderText("Buscar filme...");
    fireEvent.change(input, { target: { value: "Inception" } });
    expect(mockOnSearchChange).toHaveBeenCalledWith("Inception");
  });
});
