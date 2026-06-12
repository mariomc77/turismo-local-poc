import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import MapPage from "../pages/MapPage";

vi.mock("@vis.gl/react-google-maps", () => ({
  APIProvider: ({ children }) => <div data-testid="api-provider">{children}</div>,
  Map: ({ children }) => <div data-testid="map">{children}</div>,
  Marker: () => <div data-testid="marker">Marker</div>,
  InfoWindow: ({ children }) => <div data-testid="info-window">{children}</div>
}));

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

describe("MapPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renderiza mapa y nombre del pueblo", async () => {
    getTownBySlug.mockResolvedValue({
      id: 1,
      name: "Playas del Coco",
      slug: "playas-del-coco"
    });

    getPlacesByTownSlug.mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={["/map/playas-del-coco"]}>
        <Routes>
          <Route path="/map/:townSlug" element={<MapPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Explorar/i)).toBeInTheDocument();
    });

    expect(screen.getAllByText(/Playas del Coco/i).length).toBeGreaterThan(0);
    expect(screen.getByTestId("api-provider")).toBeInTheDocument();
    expect(screen.getByTestId("map")).toBeInTheDocument();
  });

  test("carga lugares del pueblo", async () => {
    getTownBySlug.mockResolvedValue({
      id: 1,
      name: "Playas del Coco",
      slug: "playas-del-coco"
    });

    getPlacesByTownSlug.mockResolvedValue([
      {
        id: 1,
        name: "Mirador",
        description: "Vista bonita",
        category: "MIRADOR",
        address: "Centro",
        latitude: 10.5,
        longitude: -85.6
      }
    ]);

    render(
      <MemoryRouter initialEntries={["/map/playas-del-coco"]}>
        <Routes>
          <Route path="/map/:townSlug" element={<MapPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getTownBySlug).toHaveBeenCalledWith("playas-del-coco");
      expect(getPlacesByTownSlug).toHaveBeenCalledWith("playas-del-coco");
    });
  });
});