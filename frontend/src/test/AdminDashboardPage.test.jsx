import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import { getAdminPlaces, getAdminTowns } from "../api/adminApi";

vi.mock("../api/adminApi", () => ({
  getAdminPlaces: vi.fn(),
  getAdminTowns: vi.fn()
}));

vi.mock("../components/AdminLayout", () => ({
  default: ({ children }) => <div data-testid="admin-layout">{children}</div>
}));

vi.mock("../components/LoadingSpinner", () => ({
  default: () => <div>Cargando...</div>
}));

vi.mock("../components/AdminStatCard", () => ({
  default: ({ label, value, icon }) => (
    <div data-testid="stat-card">
      <span>{icon}</span>
      <strong>{value}</strong>
      <p>{label}</p>
    </div>
  )
}));

vi.mock("../components/AdminTable", () => ({
  default: ({ columns, data }) => (
    <div>
      {data.map((row) => (
        <div data-testid="dashboard-row" key={row.id}>
          {columns.map((column) => (
            <div key={column.key}>
              {column.render ? column.render(row) : row[column.key]}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}));

function renderDashboard() {
  return render(
    <MemoryRouter>
      <AdminDashboardPage />
    </MemoryRouter>
  );
}

describe("AdminDashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    global.URL.createObjectURL = vi.fn(() => "blob:report-url");
    global.URL.revokeObjectURL = vi.fn();

    vi.spyOn(document, "createElement").mockImplementation((tagName) => {
      const element = document.constructor.prototype.createElement.call(
        document,
        tagName
      );

      if (tagName === "a") {
        element.click = vi.fn();
      }

      return element;
    });
  });

  it("muestra el loading mientras carga datos", async () => {
    getAdminTowns.mockResolvedValueOnce([]);
    getAdminPlaces.mockResolvedValueOnce([]);

    renderDashboard();

    expect(screen.getByText(/Cargando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Panel de Administración/i)).toBeInTheDocument();
    });
  });

  it("muestra estadísticas del dashboard con datos activos", async () => {
    getAdminTowns.mockResolvedValueOnce([
      { id: 1, name: "Playas del Coco", active: true },
      { id: 2, name: "Tamarindo", active: false }
    ]);

    getAdminPlaces.mockResolvedValueOnce([
      {
        id: 10,
        name: "Playa del Coco",
        townName: "Playas del Coco",
        category: "PLAYA",
        active: true,
        createdAt: "2026-06-13T10:00:00"
      },
      {
        id: 11,
        name: "Mirador",
        townName: "Playas del Coco",
        category: "MIRADOR",
        active: false,
        createdAt: "2026-06-12T10:00:00"
      }
    ]);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/Panel de Administración/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Lugares por Categoría/i)).toBeInTheDocument();
    expect(screen.getByText(/Playa del Coco/i)).toBeInTheDocument();
    expect(screen.getByText(/Playas del Coco/i)).toBeInTheDocument();
    expect(screen.getByText(/Playa/i)).toBeInTheDocument();
    expect(screen.getAllByTestId("stat-card").length).toBeGreaterThan(0);
  });

  it("muestra mensaje cuando no hay categorías ni lugares", async () => {
    getAdminTowns.mockResolvedValueOnce([]);
    getAdminPlaces.mockResolvedValueOnce([]);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/Panel de Administración/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Sin datos todavía/i)).toBeInTheDocument();
    expect(screen.getByText(/No hay lugares registrados/i)).toBeInTheDocument();
  });

  it("ordena los últimos lugares por id descendente", async () => {
    getAdminTowns.mockResolvedValueOnce([{ id: 1, name: "Coco", active: true }]);

    getAdminPlaces.mockResolvedValueOnce([
      {
        id: 1,
        name: "Lugar Viejo",
        townName: "Coco",
        category: "PLAYA",
        active: true,
        createdAt: "2026-06-10T10:00:00"
      },
      {
        id: 3,
        name: "Lugar Nuevo",
        townName: "Coco",
        category: "MIRADOR",
        active: true,
        createdAt: "2026-06-13T10:00:00"
      }
    ]);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/Lugar Nuevo/i)).toBeInTheDocument();
    });

    const rows = screen.getAllByTestId("dashboard-row");
    expect(rows[0]).toHaveTextContent("Lugar Nuevo");
  });

  it("descarga el reporte mensual", async () => {
    getAdminTowns.mockResolvedValueOnce([
      { id: 1, name: "Playas del Coco", active: true }
    ]);

    getAdminPlaces.mockResolvedValueOnce([
      {
        id: 10,
        name: "Playa del Coco",
        townName: "Playas del Coco",
        category: "PLAYA",
        active: true,
        createdAt: "2026-06-13T10:00:00"
      }
    ]);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/Panel de Administración/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Reporte/i));

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:report-url");
  });

  it("usa listas vacías cuando la API no retorna arreglos", async () => {
    getAdminTowns.mockResolvedValueOnce(null);
    getAdminPlaces.mockResolvedValueOnce(null);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/Panel de Administración/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Sin datos todavía/i)).toBeInTheDocument();
  });
});