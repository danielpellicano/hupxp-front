import { render, screen } from "@testing-library/react";
import Loader from "@/components/Loader";

describe("Loader", () => {
  it("exibe a mensagem de carregando com emoji", () => {
    render(<Loader />);
    expect(screen.getByText("🔄 Carregando...")).toBeInTheDocument();
  });

  it("possui a classe de animação `animate-pulse`", () => {
    render(<Loader />);
    const span = screen.getByText("🔄 Carregando...");
    expect(span).toHaveClass("animate-pulse");
  });
});
