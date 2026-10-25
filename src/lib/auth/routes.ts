// export const APP_ROUTES = {
//   home: "/",
//   login: "/login",
//   register: "/register",
//   forgotPassword: "/forgot-password",
//   resetPassword: "/reset-password",
//   verifyEmail: "/verify-email",
//   admin: "/admin",
//   adminLogin: "/admin/login",
//   forbidden: "/forbidden",
// } as const;

// export const PRIVATE_CLIENT_PREFIXES = ["/messages", "/notifications", "/saved", "/settings"] as const;

// export function isPrivateClientPath(pathname: string): boolean {
//   return PRIVATE_CLIENT_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
// }

// export function isAdminPath(pathname: string): boolean {
//   return pathname === APP_ROUTES.admin || pathname.startsWith(`${APP_ROUTES.admin}/`);
// }


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

export const PRIVATE_CLIENT_PREFIXES = [
  "/messages",
  "/notifications",
  "/saved",
  "/settings",
] as const;

export const GUEST_ONLY_PREFIXES = [
  APP_ROUTES.login,
  APP_ROUTES.register,
] as const;

export function matchesPath(
  pathname: string,
  prefix: string,
): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isAdminPath(pathname: string): boolean {
  return matchesPath(pathname, APP_ROUTES.admin);
}

export function isAdminLoginPath(pathname: string): boolean {
  return matchesPath(pathname, APP_ROUTES.adminLogin);
}

export function isPrivateClientPath(pathname: string): boolean {
  return PRIVATE_CLIENT_PREFIXES.some((prefix) =>
    matchesPath(pathname, prefix),
  );
}

export function isGuestOnlyPath(pathname: string): boolean {
  return GUEST_ONLY_PREFIXES.some((prefix) =>
    matchesPath(pathname, prefix),
  );
}

/**
 * Chỉ cho phép next là đường dẫn nội bộ.
 * Không nhận URL ngoài hoặc đường dẫn bắt đầu bằng //.
 */
export function getSafeNextPath(
  next: string | null,
  fallback: string,
): string {
  if (
    !next ||
    !next.startsWith("/") ||
    next.startsWith("//") ||
    next.includes("\\")
  ) {
    return fallback;
  }

  return next;
}