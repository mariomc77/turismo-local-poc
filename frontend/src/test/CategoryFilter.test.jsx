import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import CategoryFilter from "../components/CategoryFilter";

describe("CategoryFilter", () => {
  test("renderiza las categorías recibidas", () => {
    render(
      <CategoryFilter
        categories={["Todos", "Playa", "Mirador"]}
        selectedCategory="Todos"
        onSelect={() => {}}
      />
    );

    expect(screen.getByText("Todos")).toBeInTheDocument();
    expect(screen.getByText("Playa")).toBeInTheDocument();
    expect(screen.getByText("Mirador")).toBeInTheDocument();
  });

  test("ejecuta onSelect al presionar una categoría", () => {
    const onSelect = vi.fn();

    render(
      <CategoryFilter
        categories={["Todos", "Playa", "Mirador"]}
        selectedCategory="Todos"
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByText("Playa"));

    expect(onSelect).toHaveBeenCalledWith("Playa");
  });
});