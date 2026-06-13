import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import AdminLayout from "../components/AdminLayout";

describe("AdminLayout", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("muestra el nombre del usuario guardado", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "Mario Admin",
        picture: "https://example.com/avatar.png"
      })
    );

    render(
      <MemoryRouter>
        <AdminLayout>
          <h1>Contenido Admin</h1>
        </AdminLayout>
      </MemoryRouter>
    );

    expect(screen.getByText(/Hola, Mario Admin/i)).toBeInTheDocument();
    expect(screen.getByText(/Contenido Admin/i)).toBeInTheDocument();
  });

  it("muestra Admin Local cuando no hay usuario guardado", () => {
    render(
      <MemoryRouter>
        <AdminLayout>
          <p>Panel administrativo</p>
        </AdminLayout>
      </MemoryRouter>
    );

    expect(screen.getByText(/Hola, Admin Local/i)).toBeInTheDocument();
    expect(screen.getByText(/Panel administrativo/i)).toBeInTheDocument();
  });

  it("muestra la inicial A cuando el usuario no tiene foto", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "Admin Sin Foto"
      })
    );

    render(
      <MemoryRouter>
        <AdminLayout>
          <span>Contenido principal admin</span>
        </AdminLayout>
      </MemoryRouter>
    );

    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText(/Contenido principal admin/i)).toBeInTheDocument();
  });

  it("muestra el footer del panel administrativo", () => {
    render(
      <MemoryRouter>
        <AdminLayout>
          <span>Vista de reportes</span>
        </AdminLayout>
      </MemoryRouter>
    );

    expect(screen.getByText(/2026 Turismo Local POC/i)).toBeInTheDocument();
    expect(screen.getByText(/Costa Rica/i)).toBeInTheDocument();
  });
});