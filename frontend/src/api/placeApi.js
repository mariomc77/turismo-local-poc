import api from "./axiosConfig";

export async function getPlacesByTownSlug(slug) {
  const response = await api.get(`/towns/${slug}/places`);
  return response.data;
}