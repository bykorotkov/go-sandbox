const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

interface ApiErrorResponse {
  error?: string;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const payload = (await response.json()) as ApiErrorResponse;
      if (payload?.error) {
        message = payload.error;
      }
    } catch {
      // ignore parsing errors
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const apiClient = {
  get: <T>(path: string): Promise<T> => request<T>(path),
  post: <T, B>(path: string, body: B): Promise<T> =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string): Promise<T> => request<T>(path, { method: "PATCH" }),
  delete: (path: string): Promise<void> =>
    request<void>(path, { method: "DELETE" }),
};
