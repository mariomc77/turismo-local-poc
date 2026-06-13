import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../services/Api";

describe("legacy Api service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    globalThis.fetch = vi.fn();
  });

  it("loginWithGoogle envía el token a la API legacy", async () => {
    const response = {
      token: "jwt-token",
      user: {
        email: "admin@test.com"
      }
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValueOnce(response)
    });

    const result = await api.loginWithGoogle("google-id-token");

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/auth/google"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ idToken: "google-id-token" }),
        headers: expect.objectContaining({
          "Content-Type": "application/json"
        })
      })
    );

    expect(result).toEqual(response);
  });

  it("getMe usa Authorization cuando hay token guardado", async () => {
    localStorage.setItem("token", "jwt-token");

    const user = {
      id: 1,
      email: "admin@test.com"
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValueOnce(user)
    });

    const result = await api.getMe();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/users/me"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer jwt-token"
        })
      })
    );

    expect(result).toEqual(user);
  });

  it("getTown consulta un pueblo por id o slug", async () => {
    const town = {
      slug: "playas-del-coco",
      name: "Playas del Coco"
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValueOnce(town)
    });

    const result = await api.getTown("playas-del-coco");

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/towns/playas-del-coco"),
      expect.any(Object)
    );

    expect(result).toEqual(town);
  });

  it("getPlaces consulta lugares por pueblo", async () => {
    const places = [
      {
        id: 1,
        name: "Playa del Coco"
      }
    ];

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValueOnce(places)
    });

    const result = await api.getPlaces("playas-del-coco");

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/towns/playas-del-coco/places"),
      expect.any(Object)
    );

    expect(result).toEqual(places);
  });

  it("lanza error con mensaje del backend cuando la respuesta no es ok", async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValueOnce({
        message: "Error controlado"
      })
    });

    await expect(api.getMe()).rejects.toThrow("Error controlado");
  });

  it("lanza error genérico cuando el backend no manda JSON válido", async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: vi.fn().mockRejectedValueOnce(new Error("bad json"))
    });

    await expect(api.getMe()).rejects.toThrow("Error 503");
  });
});