import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MapPage from "../pages/MapPage";

vi.mock("../components/Navbar", () => ({
  default: () => <nav>Navbar Mock</nav>
}));

vi.mock("../components/LoadingSpinner", () => ({
  default: () => <div>Cargando...</div>
}));

vi.mock("../api/townApi", () => ({
  getTownBySlug: vi.fn(() =>
    Promise.resolve({
      id: 1,
      slug: "playas-del-coco",
      name: "Playas del Coco",
      description: "Pueblo turístico",
      province: "Guanacaste",
      country: "Costa Rica",
      active: true
    })
  )
}));

vi.mock("../api/placeApi", () => ({
  getPlacesByTownSlug: vi.fn(() =>
    Promise.resolve([
      {
        id: 1,
        name: "Playa del Coco",
        description: "Playa principal",
        category: "PLAYA",
        address: "Guanacaste",
        imageUrl: "https://example.com/playa.jpg",
        latitude: 10.55,
        longitude: -85.69,
        active: true
      }
    ])
  )
}));

vi.mock("@vis.gl/react-google-maps", () => ({
  APIProvider: ({ children }) => <div data-testid="api-provider">{children}</div>,
  Map: ({ children }) => <div data-testid="map">{children}</div>,
  Marker: ({ children }) => <div data-testid="marker">{children}</div>,
  AdvancedMarker: ({ children }) => <div data-testid="advanced-marker">{children}</div>,
  Pin: () => <div data-testid="pin">Pin</div>,
  InfoWindow: ({ children }) => <div data-testid="info-window">{children}</div>
}));

function renderMapPage() {
  return render(
    <MemoryRouter initialEntries={["/map/playas-del-coco"]}>
      <Routes>
        <Route path="/map/:townSlug" element={<MapPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("MapPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza la página del mapa", async () => {
    renderMapPage();

    await waitFor(() => {
      expect(screen.getByText(/Navbar Mock/i)).toBeInTheDocument();
    });
  });

  it("carga lugares del pueblo", async () => {
    renderMapPage();

    await waitFor(() => {
      expect(screen.getByText(/Playa del Coco/i)).toBeInTheDocument();
    });
  });
});