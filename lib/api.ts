import axios from "axios";
import Cookies from "js-cookie";

export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

export const api = axios.create({
  baseURL: typeof window !== "undefined" ? "/api" : `${BACKEND_URL}/api`,
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
