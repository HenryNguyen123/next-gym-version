import { ApiError } from "@/lib/api/errors";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError("API base URL is not configured. Set NEXT_PUBLIC_API_BASE_URL.", 0, "API_NOT_CONFIGURED");
  }

  const response = await fetch(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      Accept: "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    let code: string | undefined;
    try {
      const body = (await response.json()) as { message?: string | string[]; code?: string };
      message = Array.isArray(body.message) ? body.message.join(" ") : body.message || message;
      code = body.code;
    } catch {
      // Keep the generic HTTP error when the backend doesn't return JSON.
    }
    throw new ApiError(message, response.status, code);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
