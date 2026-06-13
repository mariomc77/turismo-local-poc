import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import QrPage from "../pages/QrPage";
import { getQrByTownSlug } from "../api/qrApi";

vi.mock("../api/qrApi", () => ({
  getQrByTownSlug: vi.fn()
}));

vi.mock("../components/Navbar", () => ({
  default: () => <nav>Navbar Mock</nav>
}));

vi.mock("../components/LoadingSpinner", () => ({
  default: () => <div>Cargando QR...</div>
}));

vi.mock("../components/QRCodeCard", () => ({
  default: (props) => (
    <div data-testid="qr-card">
      <p>{props.url || props.value || props.qrUrl}</p>
      <p>{props.townName || props.title}</p>
    </div>
  )
}));

function renderQrPage(path = "/qr/playas-del-coco") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/qr/:townSlug" element={<QrPage />} />
        <Route path="/qr" element={<QrPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("QrPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra loading mientras carga el QR", async () => {
    getQrByTownSlug.mockResolvedValueOnce({
      townName: "Playas del Coco",
      qrUrl: "https://example.com/p/playas-del-coco"
    });

    renderQrPage();

    expect(screen.getByText(/Cargando QR/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/QR turístico de/i)).toBeInTheDocument();
    });

    expect(screen.getAllByText(/Playas del Coco/i).length).toBeGreaterThan(0);
    expect(screen.getByTestId("qr-card")).toBeInTheDocument();
  });

  it("renderiza QR usando datos de la API", async () => {
    getQrByTownSlug.mockResolvedValueOnce({
      townName: "Tamarindo",
      qrUrl: "https://example.com/p/tamarindo"
    });

    renderQrPage("/qr/tamarindo");

    await waitFor(() => {
      expect(screen.getByText(/QR turístico de/i)).toBeInTheDocument();
    });

    expect(getQrByTownSlug).toHaveBeenCalledWith("tamarindo");
    expect(screen.getAllByText(/Tamarindo/i).length).toBeGreaterThan(0);
    expect(screen.getByTestId("qr-card")).toBeInTheDocument();
    expect(
      screen.getAllByText("https://example.com/p/tamarindo").length
    ).toBeGreaterThan(0);
    expect(screen.getByText(/Listo para imprimir/i)).toBeInTheDocument();
    expect(screen.getByText(/Flujo completo/i)).toBeInTheDocument();
  });

  it("usa valores por defecto si la API no devuelve townName ni qrUrl", async () => {
    getQrByTownSlug.mockResolvedValueOnce({});

    renderQrPage();

    await waitFor(() => {
      expect(screen.getByText(/QR turístico de/i)).toBeInTheDocument();
    });

    expect(screen.getAllByText(/Playas del Coco/i).length).toBeGreaterThan(0);
    expect(screen.getByTestId("qr-card")).toBeInTheDocument();
    expect(screen.getAllByText(/\/p\/playas-del-coco/i).length).toBeGreaterThan(
      0
    );
  });
});