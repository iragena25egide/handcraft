export const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_BASE_URL = `${BACKEND_URL}/api`;

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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
