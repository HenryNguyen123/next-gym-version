// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { isAdminRole } from "@/lib/auth/permissions";
// import { APP_ROUTES, isAdminPath, isPrivateClientPath } from "@/lib/auth/routes";
// import { SESSION_COOKIES } from "@/lib/auth/session";

// /**
//  * Optimistic route gate for the UI only. The mock cookies are forgeable and are NOT
//  * authorization. A production backend must verify a real session and permissions for
//  * every protected data read and mutation.
//  */
// export function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   if (pathname === APP_ROUTES.adminLogin || pathname.startsWith(`${APP_ROUTES.adminLogin}/`)) {
//     return NextResponse.next();
//   }

//   const session = request.cookies.get(SESSION_COOKIES.session)?.value;
//   const role = request.cookies.get(SESSION_COOKIES.role)?.value;

//   console.log("[Proxy]", {
//     pathname,
//     hasSession: Boolean(session),
//     role,
//   });

//   if (isAdminPath(pathname)) {
//     if (!session) {
//       const url = new URL(APP_ROUTES.adminLogin, request.url);
//       url.searchParams.set("next", pathname);
//       return NextResponse.redirect(url);
//     }
//     if (!isAdminRole(role)) {
//       return NextResponse.redirect(new URL(APP_ROUTES.forbidden, request.url));
//     }
//     return NextResponse.next();
//   }

//   if (isPrivateClientPath(pathname) && !session) {
//     const url = new URL(APP_ROUTES.login, request.url);
//     url.searchParams.set("next", pathname);
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin", "/admin/:path*", "/messages/:path*", "/notifications/:path*", "/saved/:path*", "/settings/:path*"],
// };


import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

import { isAdminRole } from "@/lib/auth/permissions";
import {
  APP_ROUTES,
  isAdminLoginPath,
  isAdminPath,
  isGuestOnlyPath,
  isPrivateClientPath,
} from "@/lib/auth/routes";
import { AUTH_COOKIES } from "@/lib/auth/session";

interface VerifiedSession {
  userId: string;
  roleCodes: string[];
}

function extractRoleCodes(roles: unknown): string[] {
  if (!Array.isArray(roles)) return [];

  return roles.flatMap((role): string[] => {
    if (typeof role === "string") {
      return [role];
    }

    if (
      role &&
      typeof role === "object" &&
      "code" in role &&
      typeof role.code === "string"
    ) {
      return [role.code];
    }

    return [];
  });
}

async function verifyAccessToken(
  token: string | undefined,
): Promise<VerifiedSession | null> {
  if (!token) return null;

  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    console.error("[Proxy] JWT_ACCESS_SECRET is missing");
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
      {
        algorithms: ["HS256"],
      },
    );

    if (
      typeof payload.sub !== "string" &&
      typeof payload.sub !== "number"
    ) {
      return null;
    }

    return {
      userId: String(payload.sub),
      roleCodes: extractRoleCodes(payload.roles),
    };
  } catch {
    // Token không hợp lệ hoặc đã hết hạn.
    return null;
  }
}

function redirectToLogin(
  request: NextRequest,
  loginPath: string,
): NextResponse {
  const url = new URL(loginPath, request.url);

  url.searchParams.set(
    "next",
    request.nextUrl.pathname + request.nextUrl.search,
  );

  return NextResponse.redirect(url);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(
    AUTH_COOKIES.accessToken,
  )?.value;

  const session = await verifyAccessToken(token);

  const isLoggedIn = session !== null;

  const hasAdminAccess = isAdminRole(
    session?.roleCodes,
  );
  console.log('session: ', session)
  console.log('hasAdminAccess: ', hasAdminAccess)
  console.log('pathname: ', pathname)
  console.log('token: ', token)
  if (process.env.NODE_ENV !== "production") {
    console.log("[Proxy]", {
      pathname,
      isLoggedIn,
      userId: session?.userId,
      roleCodes: session?.roleCodes,
      hasAdminAccess,
    });
  }

  // 1. Trang đăng nhập admin.
  if (isAdminLoginPath(pathname)) {
    if (isLoggedIn && hasAdminAccess) {
      return NextResponse.redirect(
        new URL(APP_ROUTES.admin, request.url),
      );
    }

    return NextResponse.next();
  }

  // 2. Khu vực admin.
  if (isAdminPath(pathname)) {
    if (!isLoggedIn) {
      return redirectToLogin(
        request,
        APP_ROUTES.adminLogin,
      );
    }

    if (!hasAdminAccess) {
      return NextResponse.redirect(
        new URL(APP_ROUTES.forbidden, request.url),
      );
    }

    return NextResponse.next();
  }

  // 3. Các trang cần đăng nhập.
  if (isPrivateClientPath(pathname) && !isLoggedIn) {
    return redirectToLogin(
      request,
      APP_ROUTES.login,
    );
  }

  // 4. Trang chỉ dành cho khách chưa đăng nhập.
  if (isGuestOnlyPath(pathname) && isLoggedIn) {
    return NextResponse.redirect(
      new URL(
        hasAdminAccess
          ? APP_ROUTES.admin
          : APP_ROUTES.home,
        request.url,
      ),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/login",
    "/register",
    "/messages/:path*",
    "/notifications/:path*",
    "/saved/:path*",
    "/settings/:path*",
  ],
};
