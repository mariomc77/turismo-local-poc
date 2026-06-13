import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "../api/axiosConfig";
import {
  createAdminPlace,
  createAdminTown,
  deleteAdminPlace,
  deleteAdminTown,
  getAdminPlaceById,
  getAdminPlaces,
  getAdminTownById,
  getAdminTowns,
  getAdminUsers,
  toggleAdminPlaceActive,
  toggleAdminTownActive,
  toggleAdminUserActive,
  updateAdminPlace,
  updateAdminTown,
  updateAdminUserRole
} from "../api/adminApi";

vi.mock("../api/axiosConfig", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}));

describe("adminApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAdminTowns obtiene todos los pueblos administrativos", async () => {
    const towns = [{ id: 1, name: "Playas del Coco" }];
    api.get.mockResolvedValueOnce({ data: towns });

    const result = await getAdminTowns();

    expect(api.get).toHaveBeenCalledWith("/admin/towns");
    expect(result).toEqual(towns);
  });

  it("getAdminTownById obtiene un pueblo por id", async () => {
    const town = { id: 1, name: "Tamarindo" };
    api.get.mockResolvedValueOnce({ data: town });

    const result = await getAdminTownById(1);

    expect(api.get).toHaveBeenCalledWith("/admin/towns/1");
    expect(result).toEqual(town);
  });

  it("createAdminTown crea un pueblo", async () => {
    const payload = { name: "Sámara", slug: "samara" };
    const response = { id: 3, ...payload };
    api.post.mockResolvedValueOnce({ data: response });

    const result = await createAdminTown(payload);

    expect(api.post).toHaveBeenCalledWith("/admin/towns", payload);
    expect(result).toEqual(response);
  });

  it("updateAdminTown actualiza un pueblo", async () => {
    const payload = { name: "Sámara Centro", slug: "samara-centro" };
    const response = { id: 3, ...payload };
    api.put.mockResolvedValueOnce({ data: response });

    const result = await updateAdminTown(3, payload);

    expect(api.put).toHaveBeenCalledWith("/admin/towns/3", payload);
    expect(result).toEqual(response);
  });

  it("toggleAdminTownActive cambia el estado activo de un pueblo", async () => {
    const response = { id: 2, active: false };
    api.patch.mockResolvedValueOnce({ data: response });

    const result = await toggleAdminTownActive(2);

    expect(api.patch).toHaveBeenCalledWith("/admin/towns/2/toggle-active");
    expect(result).toEqual(response);
  });

  it("deleteAdminTown elimina un pueblo", async () => {
    api.delete.mockResolvedValueOnce({});

    await deleteAdminTown(4);

    expect(api.delete).toHaveBeenCalledWith("/admin/towns/4");
  });

  it("getAdminPlaces obtiene todos los lugares administrativos", async () => {
    const places = [{ id: 10, name: "Playa del Coco" }];
    api.get.mockResolvedValueOnce({ data: places });

    const result = await getAdminPlaces();

    expect(api.get).toHaveBeenCalledWith("/admin/places");
    expect(result).toEqual(places);
  });

  it("getAdminPlaceById obtiene un lugar por id", async () => {
    const place = { id: 10, name: "Mirador" };
    api.get.mockResolvedValueOnce({ data: place });

    const result = await getAdminPlaceById(10);

    expect(api.get).toHaveBeenCalledWith("/admin/places/10");
    expect(result).toEqual(place);
  });

  it("createAdminPlace crea un lugar", async () => {
    const payload = {
      townId: 1,
      name: "Playa Ocotal",
      category: "PLAYA"
    };
    const response = { id: 20, ...payload };
    api.post.mockResolvedValueOnce({ data: response });

    const result = await createAdminPlace(payload);

    expect(api.post).toHaveBeenCalledWith("/admin/places", payload);
    expect(result).toEqual(response);
  });

  it("updateAdminPlace actualiza un lugar", async () => {
    const payload = {
      townId: 1,
      name: "Playa Ocotal Actualizada",
      category: "PLAYA"
    };
    const response = { id: 20, ...payload };
    api.put.mockResolvedValueOnce({ data: response });

    const result = await updateAdminPlace(20, payload);

    expect(api.put).toHaveBeenCalledWith("/admin/places/20", payload);
    expect(result).toEqual(response);
  });

  it("toggleAdminPlaceActive cambia el estado activo de un lugar", async () => {
    const response = { id: 20, active: false };
    api.patch.mockResolvedValueOnce({ data: response });

    const result = await toggleAdminPlaceActive(20);

    expect(api.patch).toHaveBeenCalledWith("/admin/places/20/toggle-active");
    expect(result).toEqual(response);
  });

  it("deleteAdminPlace elimina un lugar", async () => {
    api.delete.mockResolvedValueOnce({});

    await deleteAdminPlace(20);

    expect(api.delete).toHaveBeenCalledWith("/admin/places/20");
  });

  it("getAdminUsers obtiene todos los usuarios administrativos", async () => {
    const users = [{ id: 1, email: "admin@gmail.com", role: "ADMIN" }];
    api.get.mockResolvedValueOnce({ data: users });

    const result = await getAdminUsers();

    expect(api.get).toHaveBeenCalledWith("/admin/users");
    expect(result).toEqual(users);
  });

  it("updateAdminUserRole actualiza el rol de un usuario", async () => {
    const response = { id: 8, role: "ADMIN" };
    api.patch.mockResolvedValueOnce({ data: response });

    const result = await updateAdminUserRole(8, "ADMIN");

    expect(api.patch).toHaveBeenCalledWith("/admin/users/8/role", {
      role: "ADMIN"
    });
    expect(result).toEqual(response);
  });

  it("toggleAdminUserActive cambia el estado activo de un usuario", async () => {
    const response = { id: 8, active: false };
    api.patch.mockResolvedValueOnce({ data: response });

    const result = await toggleAdminUserActive(8);

    expect(api.patch).toHaveBeenCalledWith("/admin/users/8/toggle-active");
    expect(result).toEqual(response);
  });

    it("getAdminTownById lanza error con id inválido", async () => {
    await expect(getAdminTownById("abc")).rejects.toThrow("townId inválido");
    expect(api.get).not.toHaveBeenCalled();
  });

  it("updateAdminTown lanza error con id negativo", async () => {
    await expect(updateAdminTown(-1, { name: "Error" })).rejects.toThrow("townId inválido");
    expect(api.put).not.toHaveBeenCalled();
  });

  it("deleteAdminPlace lanza error con id cero", async () => {
    await expect(deleteAdminPlace(0)).rejects.toThrow("placeId inválido");
    expect(api.delete).not.toHaveBeenCalled();
  });

  it("updateAdminUserRole lanza error con id decimal", async () => {
    await expect(updateAdminUserRole(1.5, "ADMIN")).rejects.toThrow("userId inválido");
    expect(api.patch).not.toHaveBeenCalled();
  });

  it("toggleAdminUserActive lanza error con id vacío", async () => {
    await expect(toggleAdminUserActive("")).rejects.toThrow("userId inválido");
    expect(api.patch).not.toHaveBeenCalled();
  });
});