import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import SearchBar from "../components/SearchBar";

describe("SearchBar", () => {
  test("muestra el valor inicial", () => {
    render(<SearchBar value="playa" onChange={() => {}} />);

    expect(screen.getByDisplayValue("playa")).toBeInTheDocument();
  });

  test("ejecuta onChange cuando el usuario escribe", () => {
    const onChange = vi.fn();

    render(
      <SearchBar
        value=""
        onChange={onChange}
        placeholder="Buscar lugar"
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Buscar lugar"), {
      target: { value: "mirador" }
    });

    expect(onChange).toHaveBeenCalledWith("mirador");
  });
});