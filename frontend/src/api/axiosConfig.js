import axios from "axios";
import { clearAuth, getToken } from "../utils/authStorage";

const api = axios.create({
 baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
 headers: {
   "Content-Type": "application/json",
 },
});

api.interceptors.request.use((config) => {
 const token = getToken();

 if (token) {
   config.headers.Authorization = `Bearer ${token}`;
 }

 return config;
});

api.interceptors.response.use(
 (response) => response,
 (error) => {
   if (!error.response) {
     window.location.href = "/error?reason=backend-offline";
     return Promise.reject(error);
   }

   if (error.response.status === 401) {
     clearAuth();
     window.location.href = "/error?reason=session-expired";
     return Promise.reject(error);
   }

   if (error.response.status === 403) {
     window.location.href = "/error?reason=unauthorized";
     return Promise.reject(error);
   }

   if (error.response.status === 404) {
     window.location.href = "/error?reason=not-found";
     return Promise.reject(error);
   }

   return Promise.reject(error);
 }
);

export default api;
