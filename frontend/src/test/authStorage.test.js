import { beforeEach, describe, expect, it } from "vitest";
import {
  clearAuth,
  getStoredUser,
  getToken,
  isAuthenticated,
  saveAuth
} from "../utils/authStorage";

describe("authStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saveAuth guarda token y usuario", () => {
    const user = {
      id: 1,
      email: "admin@gmail.com",
      role: "ADMIN"
    };

    saveAuth("jwt-token", user);

    expect(localStorage.getItem("token")).toBe("jwt-token");
    expect(JSON.parse(localStorage.getItem("user"))).toEqual(user);
  });

  it("getToken retorna el token guardado", () => {
    localStorage.setItem("token", "jwt-token");

    expect(getToken()).toBe("jwt-token");
  });

  it("getStoredUser retorna null cuando no hay usuario", () => {
    expect(getStoredUser()).toBeNull();
  });

  it("getStoredUser retorna el usuario parseado", () => {
    const user = {
      name: "Mario",
      role: "ADMIN"
    };

    localStorage.setItem("user", JSON.stringify(user));

    expect(getStoredUser()).toEqual(user);
  });

  it("getStoredUser retorna null si el JSON está dañado", () => {
    localStorage.setItem("user", "{mal-json");

    expect(getStoredUser()).toBeNull();
  });

  it("clearAuth elimina token y usuario", () => {
    localStorage.setItem("token", "jwt-token");
    localStorage.setItem("user", JSON.stringify({ name: "Mario" }));

    clearAuth();

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("isAuthenticated retorna true si existe token", () => {
    localStorage.setItem("token", "jwt-token");

    expect(isAuthenticated()).toBe(true);
  });

  it("isAuthenticated retorna false si no existe token", () => {
    expect(isAuthenticated()).toBe(false);
  });
});