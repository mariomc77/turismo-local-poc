import api from "./axiosConfig";

function safePositiveId(value, fieldName = "id") {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error(`${fieldName} inválido`);
  }

  return encodeURIComponent(String(id));
}

export async function getAdminTowns() {
  const response = await api.get("/admin/towns");
  return response.data;
}

export async function getAdminTownById(id) {
  const safeId = safePositiveId(id, "townId");
  const response = await api.get(`/admin/towns/${safeId}`);
  return response.data;
}

export async function createAdminTown(town) {
  const response = await api.post("/admin/towns", town);
  return response.data;
}

export async function updateAdminTown(id, town) {
  const safeId = safePositiveId(id, "townId");
  const response = await api.put(`/admin/towns/${safeId}`, town);
  return response.data;
}

export async function toggleAdminTownActive(id) {
  const safeId = safePositiveId(id, "townId");
  const response = await api.patch(`/admin/towns/${safeId}/toggle-active`);
  return response.data;
}

export async function deleteAdminTown(id) {
  const safeId = safePositiveId(id, "townId");
  await api.delete(`/admin/towns/${safeId}`);
}

export async function getAdminPlaces() {
  const response = await api.get("/admin/places");
  return response.data;
}

export async function getAdminPlaceById(id) {
  const safeId = safePositiveId(id, "placeId");
  const response = await api.get(`/admin/places/${safeId}`);
  return response.data;
}

export async function createAdminPlace(place) {
  const response = await api.post("/admin/places", place);
  return response.data;
}

export async function updateAdminPlace(id, place) {
  const safeId = safePositiveId(id, "placeId");
  const response = await api.put(`/admin/places/${safeId}`, place);
  return response.data;
}

export async function toggleAdminPlaceActive(id) {
  const safeId = safePositiveId(id, "placeId");
  const response = await api.patch(`/admin/places/${safeId}/toggle-active`);
  return response.data;
}

export async function deleteAdminPlace(id) {
  const safeId = safePositiveId(id, "placeId");
  await api.delete(`/admin/places/${safeId}`);
}

export async function getAdminUsers() {
  const response = await api.get("/admin/users");
  return response.data;
}

export async function updateAdminUserRole(id, role) {
  const safeId = safePositiveId(id, "userId");
  const response = await api.patch(`/admin/users/${safeId}/role`, { role });
  return response.data;
}

export async function toggleAdminUserActive(id) {
  const safeId = safePositiveId(id, "userId");
  const response = await api.patch(`/admin/users/${safeId}/toggle-active`);
  return response.data;
}