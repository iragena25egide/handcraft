import axios from "axios";
import Cookies from "js-cookie";

export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://194.164.72.181:5000";

// When deployed on an HTTPS domain (e.g. Netlify), use the relative path "/api"
// so requests are proxied over HTTPS without browser Mixed-Content blocks.
const getBaseUrl = () => {
  if (typeof window !== "undefined" && window.location.protocol === "https:" && BACKEND_URL.startsWith("http://")) {
    return "/api";
  }
  return `${BACKEND_URL}/api`;
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  // Dynamically update baseURL if protocol changes or in client environment
  if (typeof window !== "undefined" && window.location.protocol === "https:" && BACKEND_URL.startsWith("http://")) {
    config.baseURL = "/api";
  }
  if (typeof window !== "undefined") {
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
    // If loaded over HTTPS but backend returns raw HTTP URL, rewrite through proxy
    if (typeof window !== "undefined" && window.location.protocol === "https:" && src.startsWith("http://194.164.72.181:5000/uploads/")) {
      return src.replace("http://194.164.72.181:5000/uploads/", "/uploads/");
    }
    return src;
  }
  if (src.startsWith("/image/") || src.startsWith("image/")) {
    return src.startsWith("/") ? src : `/${src}`;
  }
  if (src.startsWith("/uploads/") || src.startsWith("uploads/")) {
    const cleanPath = src.startsWith("/") ? src : `/${src}`;
    if (typeof window !== "undefined" && window.location.protocol === "https:") {
      return cleanPath;
    }
    return `${BACKEND_URL}${cleanPath}`;
  }
  return `${BACKEND_URL}${src.startsWith("/") ? "" : "/"}${src}`;
};
