import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "../i18n";
import Navbar from "../components/Navbar";

const mockNavigate = vi.fn();
const mockLogout = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

vi.mock("../api/townApi", () => ({
  getAllTowns: vi.fn(() =>
    Promise.resolve([
      {
        id: 1,
        slug: "playas-del-coco",
        name: "Playas del Coco",
        active: true
      },
      {
        id: 2,
        slug: "tamarindo",
        name: "Tamarindo",
        active: true
      },
      {
        id: 3,
        slug: "samara",
        name: "Sámara",
        active: true
      }
    ])
  )
}));

let authMock = {
  user: null,
  logout: mockLogout
};

vi.mock("../context/AuthContext", () => ({
  useAuth: () => authMock
}));

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();

    authMock = {
      user: null,
      logout: mockLogout
    };
  });

  it("muestra enlaces principales cuando no hay usuario", async () => {
    render(
      <MemoryRouter>
        <Navbar townSlug="playas-del-coco" />
      </MemoryRouter>
    );

    expect(screen.getByText(/Lugares/i)).toBeInTheDocument();
    expect(screen.getByText(/Mapa/i)).toBeInTheDocument();
    expect(screen.getByText(/^QR$/i)).toBeInTheDocument();
    expect(screen.getByText(/Iniciar sesión/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("combobox", { name: /pueblo/i })).toHaveValue(
        "playas-del-coco"
      );
    });

    expect(screen.getByText(/Playas del Coco/i)).toBeInTheDocument();
  });

  it("muestra usuario y permite cerrar sesión", async () => {
    authMock = {
      user: {
        name: "Mario",
        email: "mario@test.com",
        role: "CLIENT",
        picture: ""
      },
      logout: mockLogout
    };

    render(
      <MemoryRouter>
        <Navbar townSlug="playas-del-coco" />
      </MemoryRouter>
    );

    expect(screen.getByText(/Mario/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Cerrar sesión/i));

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/p/playas-del-coco");

    await waitFor(() => {
      expect(screen.getByRole("combobox", { name: /pueblo/i })).toHaveValue(
        "playas-del-coco"
      );
    });
  });
});