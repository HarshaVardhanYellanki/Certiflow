const API_URL = "http://localhost:5000/api";

interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const api = async <T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
};