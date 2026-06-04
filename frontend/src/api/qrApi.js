import api from "./axiosConfig";

export async function getQrByTownSlug(slug) {
  const response = await api.get(`/towns/${slug}/qr`);
  return response.data;
}