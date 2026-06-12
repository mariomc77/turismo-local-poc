import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, test, vi, beforeEach } from "vitest";
import PlacesPage from "../pages/PlacesPage";

vi.mock("../api/townApi", () => ({
  getTownBySlug: vi.fn()
}));

vi.mock("../api/placeApi", () => ({
  getPlacesByTownSlug: vi.fn()
}));

vi.mock("../components/Navbar", () => ({
  default: () => <nav>Navbar Mock</nav>
}));

import { getTownBySlug } from "../api/townApi";
import { getPlacesByTownSlug } from "../api/placeApi";

describe("PlacesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("carga y muestra lugares turísticos", async () => {
    getTownBySlug.mockResolvedValue({
      id: 1,
      name: "Playas del Coco",
      slug: "playas-del-coco",
      province: "Guanacaste",
      country: "Costa Rica"
    });

    getPlacesByTownSlug.mockResolvedValue([
      {
        id: 1,
        name: "Playa Principal",
        description: "Una playa bonita",
        category: "PLAYA",
        address: "Centro",
        imageUrl: "https://example.com/playa.jpg"
      }
    ]);

    render(
      <MemoryRouter initialEntries={["/places/playas-del-coco"]}>
        <Routes>
          <Route path="/places/:townSlug" element={<PlacesPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Lugares turísticos en/i)).toBeInTheDocument();
      expect(screen.getByText(/Playas del Coco/i)).toBeInTheDocument();
    });

    expect(screen.getByText("Playa Principal")).toBeInTheDocument();
    expect(screen.getByText("Una playa bonita")).toBeInTheDocument();
    expect(screen.getByText(/Mostrando/i)).toBeInTheDocument();
    expect(screen.getByText(/lugares encontrados/i)).toBeInTheDocument();
  });

  test("muestra mensaje cuando no hay lugares", async () => {
    getTownBySlug.mockResolvedValue({
      id: 1,
      name: "Playas del Coco",
      slug: "playas-del-coco",
      province: "Guanacaste",
      country: "Costa Rica"
    });

    getPlacesByTownSlug.mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={["/places/playas-del-coco"]}>
        <Routes>
          <Route path="/places/:townSlug" element={<PlacesPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No encontramos lugares/i)).toBeInTheDocument();
    });
  });
});