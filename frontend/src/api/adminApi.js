import api from "./axiosConfig";

export async function getAdminTowns() {
  const response = await api.get("/admin/towns");
  return response.data;
}

export async function createAdminTown(town) {
  const response = await api.post("/admin/towns", town);
  return response.data;
}

export async function updateAdminTown(id, town) {
  const response = await api.put(`/admin/towns/${id}`, town);
  return response.data;
}

export async function toggleAdminTownActive(id) {
  const response = await api.patch(`/admin/towns/${id}/toggle-active`);
  return response.data;
}

export async function deleteAdminTown(id) {
  await api.delete(`/admin/towns/${id}`);
}

export async function getAdminPlaces() {
  const response = await api.get("/admin/places");
  return response.data;
}

export async function createAdminPlace(place) {
  const response = await api.post("/admin/places", place);
  return response.data;
}

export async function updateAdminPlace(id, place) {
  const response = await api.put(`/admin/places/${id}`, place);
  return response.data;
}

export async function toggleAdminPlaceActive(id) {
  const response = await api.patch(`/admin/places/${id}/toggle-active`);
  return response.data;
}

export async function deleteAdminPlace(id) {
  await api.delete(`/admin/places/${id}`);
}