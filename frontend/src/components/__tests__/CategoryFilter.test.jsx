import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import CategoryFilter from "../CategoryFilter";

describe("CategoryFilter", () => {
  test("renderiza todas las categorías", () => {
    render(
      <CategoryFilter
        categories={["Todos", "Playa", "Restaurante"]}
        selectedCategory="Todos"
        onSelect={() => {}}
      />
    );

    expect(screen.getByRole("button", { name: "Todos" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Playa" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Restaurante" })).toBeInTheDocument();
  });

  test("marca como activa la categoría seleccionada", () => {
    render(
      <CategoryFilter
        categories={["Todos", "Playa", "Restaurante"]}
        selectedCategory="Playa"
        onSelect={() => {}}
      />
    );

    expect(screen.getByRole("button", { name: "Playa" })).toHaveClass("active");
  });

  test("ejecuta onSelect al hacer click en una categoría", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <CategoryFilter
        categories={["Todos", "Playa", "Restaurante"]}
        selectedCategory="Todos"
        onSelect={handleSelect}
      />
    );

    await user.click(screen.getByRole("button", { name: "Restaurante" }));

    expect(handleSelect).toHaveBeenCalledWith("Restaurante");
  });
});