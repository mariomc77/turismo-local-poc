import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import SearchBar from "../SearchBar";

describe("SearchBar", () => {
  test("renderiza el placeholder correctamente", () => {
    render(
      <SearchBar
        value=""
        onChange={() => {}}
        placeholder="Buscar lugar..."
      />
    );

    expect(screen.getByPlaceholderText("Buscar lugar...")).toBeInTheDocument();
  });

  test("ejecuta onChange cuando el usuario escribe", () => {
    const handleChange = vi.fn();

    render(
      <SearchBar
        value=""
        onChange={handleChange}
        placeholder="Buscar lugar..."
      />
    );

    const input = screen.getByPlaceholderText("Buscar lugar...");

    fireEvent.change(input, {
      target: {
        value: "playa"
      }
    });

    expect(handleChange).toHaveBeenCalledWith("playa");
  });
});