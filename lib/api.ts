import axios from "axios";
import Cookies from "js-cookie";

export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://handcraft-backend-0znu.onrender.com";

export const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
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

export const getImageUrl = (src?: string | null) => {
  if (!src) {
    return "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&q=80";
  }
  if (src.startsWith("http") || src.startsWith("blob:") || src.startsWith("data:")) {
    return src;
  }
  if (src.startsWith("/image/") || src.startsWith("image/")) {
    return src.startsWith("/") ? src : `/${src}`;
  }
  return `${BACKEND_URL}${src.startsWith("/") ? "" : "/"}${src}`;
};
