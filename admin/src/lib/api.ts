export const BACKEND_URL = import.meta.env.VITE_API_URL || "http://194.164.72.181:5000";

export const getBaseUrl = () => {
  if (typeof window !== "undefined" && window.location.protocol === "https:" && BACKEND_URL.startsWith("http://")) {
    return "/api";
  }
  return `${BACKEND_URL}/api`;
};

export const getImageUrl = (src?: string | null) => {
  if (!src) {
    return "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&q=80";
  }
  const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
  if (src.startsWith("http") || src.startsWith("blob:") || src.startsWith("data:")) {
    if (isHttps && src.startsWith("http://194.164.72.181:5000/uploads/")) {
      return src.replace("http://194.164.72.181:5000/uploads/", "/uploads/");
    }
    return src;
  }
  if (src.startsWith("/image/") || src.startsWith("image/")) {
    return src.startsWith("/") ? src : `/${src}`;
  }
  if (src.startsWith("/uploads/") || src.startsWith("uploads/")) {
    const cleanPath = src.startsWith("/") ? src : `/${src}`;
    if (isHttps) {
      return cleanPath;
    }
    return `${BACKEND_URL}${cleanPath}`;
  }
  const cleanSrc = src.startsWith("/") ? src : `/${src}`;
  if (isHttps) {
    return `/uploads${cleanSrc}`;
  }
  return `${BACKEND_URL}${cleanSrc}`;
};

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("admin_token");
  
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Only set Content-Type to JSON if body is NOT FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    window.location.href = "/login";
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    let errorMessage = errorData.message || `Request failed with status ${response.status}`;
    if (errorData.errors && Array.isArray(errorData.errors)) {
      errorMessage += ": " + errorData.errors.join(", ");
    }
    throw new Error(errorMessage);
  }

  // Handle 204 No Content for deletes
  if (response.status === 204) {
    return null;
  }

  return response.json();
};
