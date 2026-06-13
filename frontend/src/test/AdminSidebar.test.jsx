import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import AdminSidebar from "../components/AdminSidebar";

function renderSidebar(initialRoute = "/admin/dashboard") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="*" element={<AdminSidebar />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("AdminSidebar", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("muestra el título del sistema", () => {
    renderSidebar();

    expect(screen.getByText(/Turismo Local POC/i)).toBeInTheDocument();
  });

  it("muestra las opciones principales del panel admin", () => {
    renderSidebar();

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Pueblos/i)).toBeInTheDocument();
    expect(screen.getByText(/Lugares/i)).toBeInTheDocument();
    expect(screen.getByText(/Usuarios/i)).toBeInTheDocument();
    expect(screen.getByText(/Reportes/i)).toBeInTheDocument();
  });

  it("muestra el enlace de ajustes", () => {
    renderSidebar();

    expect(screen.getByText(/Ajustes/i)).toBeInTheDocument();
  });

  it("marca la ruta actual como activa", () => {
    renderSidebar("/admin/places");

    const lugaresLink = screen.getByText(/Lugares/i).closest("a");

    expect(lugaresLink).toHaveAttribute("href", "/admin/places");
    expect(lugaresLink?.className).toContain("active");
  });

  it("cierra sesión limpiando localStorage", () => {
    localStorage.setItem("token", "jwt-test");
    localStorage.setItem("user", JSON.stringify({ name: "Mario" }));

    renderSidebar();

    fireEvent.click(screen.getByText(/Cerrar Sesión/i));

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });
});