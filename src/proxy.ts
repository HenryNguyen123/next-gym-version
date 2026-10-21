import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminRole } from "@/lib/auth/permissions";
import { APP_ROUTES, isAdminPath, isPrivateClientPath } from "@/lib/auth/routes";
import { SESSION_COOKIES } from "@/lib/auth/session";

/**
 * Optimistic route gate for the UI only. The mock cookies are forgeable and are NOT
 * authorization. A production backend must verify a real session and permissions for
 * every protected data read and mutation.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === APP_ROUTES.adminLogin || pathname.startsWith(`${APP_ROUTES.adminLogin}/`)) {
    return NextResponse.next();
  }

  const session = request.cookies.get(SESSION_COOKIES.session)?.value;
  const role = request.cookies.get(SESSION_COOKIES.role)?.value;

  if (isAdminPath(pathname)) {
    if (!session) {
      const url = new URL(APP_ROUTES.adminLogin, request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (!isAdminRole(role)) {
      return NextResponse.redirect(new URL(APP_ROUTES.forbidden, request.url));
    }
    return NextResponse.next();
  }

  if (isPrivateClientPath(pathname) && !session) {
    const url = new URL(APP_ROUTES.login, request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: ["/admin", "/admin/:path*", "/messages/:path*", "/notifications/:path*", "/saved/:path*", "/settings/:path*"],
// };
