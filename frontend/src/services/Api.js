const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function getToken() {
  return localStorage.getItem("token");
}

async function request(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
    return;
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Error ${response.status}`);
  }

  return response.json();
}

export const api = {
  loginWithGoogle: (idToken) =>
    request("/api/auth/google", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    }),

  getMe: () => request("/api/users/me"),

  getTown: (id) => request(`/api/towns/${id}`),

  getPlaces: (townId) => request(`/api/towns/${townId}/places`),
};