import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "../api/axiosConfig";
import { loginWithGoogle, getMe } from "../api/authApi";
import { getTownBySlug } from "../api/townApi";
import { getPlacesByTownSlug } from "../api/placeApi";
import { getQrByTownSlug } from "../api/qrApi";

vi.mock("../api/axiosConfig", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

describe("public and auth API modules", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loginWithGoogle envía el idToken al backend", async () => {
    const response = {
      token: "jwt-token",
      user: {
        email: "admin@gmail.com"
      }
    };

    api.post.mockResolvedValueOnce({ data: response });

    const result = await loginWithGoogle("google-id-token");

    expect(api.post).toHaveBeenCalledWith("/auth/google", {
      idToken: "google-id-token"
    });
    expect(result).toEqual(response);
  });

  it("getMe obtiene el usuario autenticado", async () => {
    const user = {
      id: 1,
      email: "admin@gmail.com",
      role: "ADMIN"
    };

    api.get.mockResolvedValueOnce({ data: user });

    const result = await getMe();

    expect(api.get).toHaveBeenCalledWith("/users/me");
    expect(result).toEqual(user);
  });

  it("getTownBySlug obtiene un pueblo por slug", async () => {
    const town = {
      slug: "playas-del-coco",
      name: "Playas del Coco"
    };

    api.get.mockResolvedValueOnce({ data: town });

    const result = await getTownBySlug("playas-del-coco");

    expect(api.get).toHaveBeenCalledWith("/towns/playas-del-coco");
    expect(result).toEqual(town);
  });

  it("getPlacesByTownSlug obtiene lugares por pueblo", async () => {
    const places = [
      {
        id: 1,
        name: "Playa del Coco"
      }
    ];

    api.get.mockResolvedValueOnce({ data: places });

    const result = await getPlacesByTownSlug("playas-del-coco");

    expect(api.get).toHaveBeenCalledWith("/towns/playas-del-coco/places");
    expect(result).toEqual(places);
  });

  it("getQrByTownSlug obtiene el QR de un pueblo", async () => {
    const qr = {
      townSlug: "playas-del-coco",
      qrUrl: "https://example.com/qr.png"
    };

    api.get.mockResolvedValueOnce({ data: qr });

    const result = await getQrByTownSlug("playas-del-coco");

    expect(api.get).toHaveBeenCalledWith("/towns/playas-del-coco/qr");
    expect(result).toEqual(qr);
  });
});