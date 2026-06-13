import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdminTownsPage from "../pages/AdminTownsPage";
import {
  createAdminTown,
  getAdminTowns,
  toggleAdminTownActive,
  updateAdminTown
} from "../api/adminApi";

vi.mock("../api/adminApi", () => ({
  createAdminTown: vi.fn(),
  getAdminTowns: vi.fn(),
  toggleAdminTownActive: vi.fn(),
  updateAdminTown: vi.fn()
}));

vi.mock("../components/AdminLayout", () => ({
  default: ({ children }) => <div data-testid="admin-layout">{children}</div>
}));

vi.mock("../components/LoadingSpinner", () => ({
  default: () => <div>Cargando...</div>
}));

vi.mock("../components/SearchBar", () => ({
  default: ({ value, onChange, placeholder }) => (
    <input
      aria-label="search"
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}));

vi.mock("../components/AdminTable", () => ({
  default: ({ columns, data, renderActions }) => (
    <div>
      {data.map((row) => (
        <div data-testid="admin-row" key={row.id}>
          {columns.map((column) => (
            <div key={column.key}>
              {column.render ? column.render(row) : row[column.key]}
            </div>
          ))}
          {renderActions && renderActions(row)}
        </div>
      ))}
    </div>
  )
}));

describe("AdminTownsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.spyOn(window, "open").mockImplementation(() => {});
  });

  it("muestra pueblos cargados desde la API", async () => {
    getAdminTowns.mockResolvedValueOnce([
      {
        id: 1,
        name: "Playas del Coco",
        slug: "playas-del-coco",
        description: "Destino turístico",
        province: "Guanacaste",
        country: "Costa Rica",
        active: true
      },
      {
        id: 2,
        name: "Tamarindo",
        slug: "tamarindo",
        province: "Guanacaste",
        country: "Costa Rica",
        active: false
      }
    ]);

    render(<AdminTownsPage />);

    expect(screen.getByText(/Cargando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Gestión de pueblos/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Playas del Coco/i)).toBeInTheDocument();
    expect(screen.getByText(/Tamarindo/i)).toBeInTheDocument();
    expect(screen.getByText(/Total de pueblos/i)).toBeInTheDocument();
  });

  it("filtra pueblos por búsqueda", async () => {
    getAdminTowns.mockResolvedValueOnce([
      {
        id: 1,
        name: "Playas del Coco",
        slug: "playas-del-coco",
        active: true
      },
      {
        id: 2,
        name: "Tamarindo",
        slug: "tamarindo",
        active: true
      }
    ]);

    render(<AdminTownsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Playas del Coco/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("search"), {
      target: { value: "tamarindo" }
    });

    expect(screen.queryByText(/Playas del Coco/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Tamarindo/i)).toBeInTheDocument();
  });

  it("filtra pueblos activos", async () => {
    getAdminTowns.mockResolvedValueOnce([
      {
        id: 1,
        name: "Playas del Coco",
        slug: "playas-del-coco",
        active: true
      },
      {
        id: 2,
        name: "Tamarindo",
        slug: "tamarindo",
        active: false
      }
    ]);

    render(<AdminTownsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Tamarindo/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Activo" }
    });

    expect(screen.getByText(/Playas del Coco/i)).toBeInTheDocument();
    expect(screen.queryByText(/Tamarindo/i)).not.toBeInTheDocument();
  });

  it("crea un pueblo nuevo desde el formulario", async () => {
    getAdminTowns.mockResolvedValueOnce([]);

    createAdminTown.mockResolvedValueOnce({
      id: 3,
      name: "Sámara",
      slug: "samara",
      description: "Destino familiar",
      province: "Guanacaste",
      country: "Costa Rica",
      active: true
    });

    render(<AdminTownsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Gestión de pueblos/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/\+ Agregar pueblo/i));

    fireEvent.change(screen.getByDisplayValue(""), {
      target: { value: "Sámara" }
    });

    fireEvent.change(screen.getByPlaceholderText("playas-del-coco"), {
      target: { value: "Sámara Centro" }
    });

    fireEvent.click(screen.getByText(/Guardar/i));

    await waitFor(() => {
      expect(createAdminTown).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Sámara",
          slug: "samara-centro",
          province: "Guanacaste",
          country: "Costa Rica",
          active: true
        })
      );
    });

    expect(window.alert).toHaveBeenCalledWith("Pueblo creado correctamente");
  });

  it("valida que el nombre del pueblo sea obligatorio", async () => {
    getAdminTowns.mockResolvedValueOnce([]);

    render(<AdminTownsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Gestión de pueblos/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/\+ Agregar pueblo/i));
    fireEvent.click(screen.getByText(/Guardar/i));

    expect(window.alert).toHaveBeenCalledWith(
      "El nombre del pueblo es obligatorio"
    );
    expect(createAdminTown).not.toHaveBeenCalled();
  });

  it("actualiza un pueblo existente", async () => {
    getAdminTowns.mockResolvedValueOnce([
      {
        id: 1,
        name: "Playas del Coco",
        slug: "playas-del-coco",
        description: "Destino turístico",
        province: "Guanacaste",
        country: "Costa Rica",
        active: true
      }
    ]);

    updateAdminTown.mockResolvedValueOnce({
      id: 1,
      name: "Coco Centro",
      slug: "coco-centro",
      description: "Actualizado",
      province: "Guanacaste",
      country: "Costa Rica",
      active: true
    });

    render(<AdminTownsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Playas del Coco/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Editar/i));

    const nameInput = screen.getByDisplayValue("Playas del Coco");
    fireEvent.change(nameInput, { target: { value: "Coco Centro" } });

    fireEvent.click(screen.getByText(/Guardar/i));

    await waitFor(() => {
      expect(updateAdminTown).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          name: "Coco Centro"
        })
      );
    });

    expect(window.alert).toHaveBeenCalledWith("Pueblo actualizado correctamente");
  });

  it("cambia el estado de un pueblo", async () => {
    getAdminTowns.mockResolvedValueOnce([
      {
        id: 1,
        name: "Playas del Coco",
        slug: "playas-del-coco",
        active: true
      }
    ]);

    toggleAdminTownActive.mockResolvedValueOnce({
      id: 1,
      name: "Playas del Coco",
      slug: "playas-del-coco",
      active: false
    });

    render(<AdminTownsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Playas del Coco/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Desactivar/i));

    await waitFor(() => {
      expect(toggleAdminTownActive).toHaveBeenCalledWith(1);
    });
  });

  it("abre la vista pública del pueblo", async () => {
    getAdminTowns.mockResolvedValueOnce([
      {
        id: 1,
        name: "Playas del Coco",
        slug: "playas-del-coco",
        active: true
      }
    ]);

    render(<AdminTownsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Playas del Coco/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Ver/i));

    expect(window.open).toHaveBeenCalledWith("/p/playas-del-coco", "_blank");
  });
});