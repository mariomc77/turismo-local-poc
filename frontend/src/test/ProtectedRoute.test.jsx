import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";
import ProtectedRoute from "../routes/ProtectedRoute";

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn()
}));

import { useAuth } from "../context/AuthContext";

describe("ProtectedRoute", () => {
  test("muestra el contenido cuando el usuario está autenticado", () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loadingAuth: false
    });

    render(
      <MemoryRouter initialEntries={["/places/playas-del-coco"]}>
        <Routes>
          <Route
            path="/places/:townSlug"
            element={
              <ProtectedRoute>
                <h1>Contenido protegido</h1>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Contenido protegido")).toBeInTheDocument();
  });

  test("redirige cuando el usuario no está autenticado", () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loadingAuth: false
    });

    render(
      <MemoryRouter initialEntries={["/places/playas-del-coco"]}>
        <Routes>
          <Route
            path="/places/:townSlug"
            element={
              <ProtectedRoute>
                <h1>Contenido protegido</h1>
              </ProtectedRoute>
            }
          />
          <Route path="/p/:townSlug" element={<h1>Página pública</h1>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Página pública")).toBeInTheDocument();
  });
});