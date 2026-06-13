import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdminUsersPage from "../pages/AdminUsersPage";
import {
  getAdminUsers,
  toggleAdminUserActive,
  updateAdminUserRole
} from "../api/adminApi";

vi.mock("../api/adminApi", () => ({
  getAdminUsers: vi.fn(),
  toggleAdminUserActive: vi.fn(),
  updateAdminUserRole: vi.fn()
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

describe("AdminUsersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("muestra usuarios cargados desde la API", async () => {
    getAdminUsers.mockResolvedValueOnce([
      {
        id: 1,
        name: "Mario Admin",
        email: "admin@test.com",
        role: "ADMIN",
        active: true,
        createdAt: "2026-06-13T10:00:00"
      },
      {
        id: 2,
        name: "Cliente Demo",
        email: "cliente@test.com",
        role: "CLIENT",
        active: false,
        createdAt: null
      }
    ]);

    render(<AdminUsersPage />);

    expect(screen.getByText(/Cargando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Gestión de usuarios/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Mario Admin/i)).toBeInTheDocument();
    expect(screen.getByText(/admin@test.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Cliente Demo/i)).toBeInTheDocument();
    expect(screen.getByText(/Total de usuarios/i)).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("filtra usuarios por texto de búsqueda", async () => {
    getAdminUsers.mockResolvedValueOnce([
      {
        id: 1,
        name: "Mario Admin",
        email: "admin@test.com",
        role: "ADMIN",
        active: true
      },
      {
        id: 2,
        name: "Cliente Demo",
        email: "cliente@test.com",
        role: "CLIENT",
        active: true
      }
    ]);

    render(<AdminUsersPage />);

    await waitFor(() => {
      expect(screen.getByText(/Mario Admin/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("search"), {
      target: { value: "cliente" }
    });

    expect(screen.queryByText(/Mario Admin/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Cliente Demo/i)).toBeInTheDocument();
  });

  it("filtra usuarios por rol ADMIN", async () => {
    getAdminUsers.mockResolvedValueOnce([
      {
        id: 1,
        name: "Mario Admin",
        email: "admin@test.com",
        role: "ADMIN",
        active: true
      },
      {
        id: 2,
        name: "Cliente Demo",
        email: "cliente@test.com",
        role: "CLIENT",
        active: true
      }
    ]);

    render(<AdminUsersPage />);

    await waitFor(() => {
      expect(screen.getByText(/Cliente Demo/i)).toBeInTheDocument();
    });

    const roleFilter = screen.getAllByRole("combobox")[0];
    fireEvent.change(roleFilter, { target: { value: "ADMIN" } });

    expect(screen.getByText(/Mario Admin/i)).toBeInTheDocument();
    expect(screen.queryByText(/Cliente Demo/i)).not.toBeInTheDocument();
  });

  it("actualiza el rol de un usuario si se confirma", async () => {
    getAdminUsers.mockResolvedValueOnce([
      {
        id: 1,
        name: "Cliente Demo",
        email: "cliente@test.com",
        role: "CLIENT",
        active: true
      }
    ]);

    updateAdminUserRole.mockResolvedValueOnce({
      id: 1,
      name: "Cliente Demo",
      email: "cliente@test.com",
      role: "ADMIN",
      active: true
    });

    render(<AdminUsersPage />);

    await waitFor(() => {
      expect(screen.getByText(/Cliente Demo/i)).toBeInTheDocument();
    });

    const userRoleSelect = screen.getAllByRole("combobox").find((select) =>
      Array.from(select.options).some((option) => option.value === "CLIENT")
    );

    fireEvent.change(userRoleSelect, { target: { value: "ADMIN" } });

    await waitFor(() => {
      expect(updateAdminUserRole).toHaveBeenCalledWith(1, "ADMIN");
    });

    expect(window.alert).toHaveBeenCalledWith("Rol actualizado correctamente");
  });

  it("activa o desactiva un usuario si se confirma", async () => {
    getAdminUsers.mockResolvedValueOnce([
      {
        id: 1,
        name: "Mario Admin",
        email: "admin@test.com",
        role: "ADMIN",
        active: true
      }
    ]);

    toggleAdminUserActive.mockResolvedValueOnce({
      id: 1,
      name: "Mario Admin",
      email: "admin@test.com",
      role: "ADMIN",
      active: false
    });

    render(<AdminUsersPage />);

    await waitFor(() => {
      expect(screen.getByText(/Mario Admin/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Desactivar/i));

    await waitFor(() => {
      expect(toggleAdminUserActive).toHaveBeenCalledWith(1);
    });

    expect(window.alert).toHaveBeenCalledWith(
      "Estado del usuario actualizado correctamente"
    );
  });

  it("muestra mensaje cuando no hay usuarios", async () => {
    getAdminUsers.mockResolvedValueOnce([]);

    render(<AdminUsersPage />);

    await waitFor(() => {
      expect(screen.getByText(/No hay usuarios registrados/i)).toBeInTheDocument();
    });

    expect(
      screen.getByText(/Los usuarios aparecerán cuando inicien sesión con Google/i)
    ).toBeInTheDocument();
  });
});