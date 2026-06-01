import api from "./axiosConfig";

export async function getTownBySlug(slug) {
  const response = await api.get(`/towns/${slug}`);
  return response.data;
}