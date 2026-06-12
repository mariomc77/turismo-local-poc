import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import Navbar from "../components/Navbar";

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn()
}));

const mockReload = vi.fn();

Object.defineProperty(window, "location", {
  value: {
    reload: mockReload
  },
  writable: true
});

import { useAuth } from "../context/AuthContext";

describe("Navbar", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("muestra enlaces principales cuando no hay usuario", () => {
    useAuth.mockReturnValue({
      user: null
    });

    render(
      <MemoryRouter>
        <Navbar townSlug="playas-del-coco" />
      </MemoryRouter>
    );

    expect(screen.getByText(/Turismo Local POC/i)).toBeInTheDocument();
    expect(screen.getByText(/Lugares/i)).toBeInTheDocument();
    expect(screen.getByText(/Mapa/i)).toBeInTheDocument();
    expect(screen.getByText(/Mi QR/i)).toBeInTheDocument();
    expect(screen.getByText(/Empezar/i)).toBeInTheDocument();
  });

  test("muestra usuario y permite cerrar sesión", () => {
    localStorage.setItem("token", "jwt-token");
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "Mario",
        email: "mario@gmail.com"
      })
    );

    useAuth.mockReturnValue({
      user: {
        name: "Mario",
        email: "mario@gmail.com",
        role: "CLIENT"
      }
    });

    render(
      <MemoryRouter>
        <Navbar townSlug="playas-del-coco" />
      </MemoryRouter>
    );

    expect(screen.getByText(/Hola, Mario/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Salir/i));

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(mockReload).toHaveBeenCalled();
  });
});