export const APP_ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  admin: "/admin",
  adminLogin: "/admin/login",
  forbidden: "/forbidden",
} as const;

export const PRIVATE_CLIENT_PREFIXES = ["/messages", "/notifications", "/saved", "/settings"] as const;

export function isPrivateClientPath(pathname: string): boolean {
  return PRIVATE_CLIENT_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function isAdminPath(pathname: string): boolean {
  return pathname === APP_ROUTES.admin || pathname.startsWith(`${APP_ROUTES.admin}/`);
}
