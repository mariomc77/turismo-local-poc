import api from "./axiosConfig";

export async function loginWithGoogle(idToken) {
  const response = await api.post("/auth/google", { idToken });
  return response.data;
}

export async function getMe() {
  const response = await api.get("/users/me");
  return response.data;
}