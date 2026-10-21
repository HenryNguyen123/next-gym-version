export type AppRole = "user" | "moderator" | "admin" | "super_admin";

export type LoginInput = { email: string; password: string; role?: "user" | "admin" };
export type AuthResult = { ok: true; role: AppRole; displayName: string };
export type RegisterInput = { displayName: string; email: string; password: string };
