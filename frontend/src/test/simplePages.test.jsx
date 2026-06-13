import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import ErrorMessage from "../components/ErrorMessage";
import ErrorPage from "../pages/ErrorPage";
import Login from "../pages/Login";
import { ADMIN_EMAILS } from "../config/adminEmails";

vi.mock("../components/Navbar", () => ({
  default: () => <nav>Navbar Mock</nav>
}));

describe("simple frontend components and pages", () => {
  it("ErrorMessage renderiza el mensaje recibido", () => {
    render(<ErrorMessage message="Algo salió mal" />);

    expect(screen.getByText(/Algo salió mal/i)).toBeInTheDocument();
  });

  it("adminEmails contiene correos administradores", () => {
    expect(Array.isArray(ADMIN_EMAILS)).toBe(true);
    expect(ADMIN_EMAILS.length).toBeGreaterThan(0);
  });

  it("ErrorPage muestra error default cuando no hay reason", () => {
    render(
      <MemoryRouter initialEntries={["/error"]}>
        <ErrorPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /Algo salió mal/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Volver al inicio/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Explorar lugares/i })).toBeInTheDocument();
  });

  it("ErrorPage muestra error de pueblo no encontrado", () => {
    render(
      <MemoryRouter initialEntries={["/error?reason=not-found"]}>
        <ErrorPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /Pueblo no encontrado/i })).toBeInTheDocument();
  });

  it("ErrorPage muestra error de sesión expirada", () => {
    render(
      <MemoryRouter initialEntries={["/error?reason=session-expired"]}>
        <ErrorPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /Sesión expirada/i })).toBeInTheDocument();
  });

  it("ErrorPage muestra error de backend offline", () => {
    render(
      <MemoryRouter initialEntries={["/error?reason=backend-offline"]}>
        <ErrorPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /Servidor no disponible/i })).toBeInTheDocument();
  });

  it("ErrorPage muestra error no autorizado", () => {
    render(
      <MemoryRouter initialEntries={["/error?reason=unauthorized"]}>
        <ErrorPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /Acceso no autorizado/i })).toBeInTheDocument();
  });

  it("Login renderiza la pantalla básica de inicio", () => {
    render(<Login />);

    expect(screen.getByText(/Turismo Local UNA/i)).toBeInTheDocument();
    expect(screen.getByText(/Bienvenido a Turismo Local/i)).toBeInTheDocument();
    expect(screen.getByText(/Continuar con Google/i)).toBeInTheDocument();
  });
});