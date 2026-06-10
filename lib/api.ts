import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: typeof window !== "undefined" ? "/api" : "http://127.0.0.1:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // Read the token directly from the secure js-cookie instead of localStorage
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
