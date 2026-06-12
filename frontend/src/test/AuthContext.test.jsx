import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { AuthProvider, useAuth } from "../context/AuthContext";

vi.mock("../api/authApi", () => ({
  getMe: vi.fn(),
  loginWithGoogle: vi.fn()
}));

vi.mock("../utils/authStorage", () => ({
  clearAuth: vi.fn(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }),
  getStoredUser: vi.fn(() => {
    const user = localStorage.getItem("user");

    if (!user || user === "undefined") {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }),
  getToken: vi.fn(() => {
    const token = localStorage.getItem("token");
    return token && token !== "undefined" ? token : null;
  }),
  saveAuth: vi.fn((token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  })
}));

import { loginWithGoogle } from "../api/authApi";

function AuthConsumer() {
  const { user, token, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      <p>Token: {token || "sin-token"}</p>
      <p>Usuario: {user?.email || "sin-usuario"}</p>
      <p>Autenticado: {isAuthenticated ? "si" : "no"}</p>
      <button onClick={() => login("google-token")}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("inicia sin usuario cuando no hay token guardado", () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    expect(screen.getByText(/Token: sin-token/i)).toBeInTheDocument();
    expect(screen.getByText(/Usuario: sin-usuario/i)).toBeInTheDocument();
    expect(screen.getByText(/Autenticado: no/i)).toBeInTheDocument();
  });

  test("login guarda token y usuario", async () => {
    loginWithGoogle.mockResolvedValue({
      token: "jwt-token",
      user: {
        id: 1,
        email: "mario@gmail.com",
        name: "Mario"
      }
    });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByText(/Token: jwt-token/i)).toBeInTheDocument();
      expect(screen.getByText(/Usuario: mario@gmail.com/i)).toBeInTheDocument();
      expect(screen.getByText(/Autenticado: si/i)).toBeInTheDocument();
    });
  });

  test("logout limpia la sesión", async () => {
    localStorage.setItem("token", "jwt-token");
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: 1,
        email: "mario@gmail.com",
        name: "Mario"
      })
    );

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    expect(screen.getByText(/Usuario: mario@gmail.com/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText("Logout"));

    await waitFor(() => {
      expect(screen.getByText(/Token: sin-token/i)).toBeInTheDocument();
      expect(screen.getByText(/Usuario: sin-usuario/i)).toBeInTheDocument();
      expect(screen.getByText(/Autenticado: no/i)).toBeInTheDocument();
    });
  });
});