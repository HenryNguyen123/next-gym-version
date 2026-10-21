import type { AuthResult, LoginInput, RegisterInput } from "@/lib/types/auth";
import { apiRequest } from "@/lib/api/client";
import { isDevelopmentMockMode, SESSION_COOKIES } from "@/lib/auth/session";

// The marker-cookie mode is development-only; it is not a real authentication session.

function setMockCookies(role: "user" | "admin") {
  if (typeof document === "undefined") return;
  const common = "Path=/; SameSite=Lax";
  document.cookie = `${SESSION_COOKIES.session}=mock; ${common}`;
  document.cookie = `${SESSION_COOKIES.role}=${role}; ${common}`;
}

export async function login(input: LoginInput): Promise<AuthResult> {
  if (isDevelopmentMockMode()) {
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    const role = input.role === "admin" ? "admin" : "user";
    setMockCookies(role);
    return { ok: true, role, displayName: role === "admin" ? "Demo Administrator" : input.email.split("@")[0] || "Pulse member" };
  }

  // Confirm the payload, path, response, and cookie contract against the real backend before use.
  const result = await apiRequest<AuthResult>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: input.email, password: input.password }),
  });
  return result;
}

export async function register(input: RegisterInput): Promise<{ ok: true }> {
  if (isDevelopmentMockMode()) {
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    return { ok: true };
  }
  return apiRequest<{ ok: true }>("/auth/register", { method: "POST", body: JSON.stringify(input) });
}

export async function requestPasswordReset(email: string): Promise<{ ok: true }> {
  if (isDevelopmentMockMode()) {
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    return { ok: true };
  }
  return apiRequest<{ ok: true }>("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
}

export async function resetPassword(token: string, password: string): Promise<{ ok: true }> {
  if (isDevelopmentMockMode()) {
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    return { ok: true };
  }
  return apiRequest<{ ok: true }>("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) });
}

export async function logout(): Promise<void> {
  if (typeof document !== "undefined" && isDevelopmentMockMode()) {
    document.cookie = `${SESSION_COOKIES.session}=; Path=/; Max-Age=0; SameSite=Lax`;
    document.cookie = `${SESSION_COOKIES.role}=; Path=/; Max-Age=0; SameSite=Lax`;
    return;
  }
  await apiRequest<void>("/auth/logout", { method: "POST" });
}
