// export const SESSION_COOKIES = {
//   session: "pulse-session",
//   role: "pulse-role",
// } as const;

// export function isDevelopmentMockMode(): boolean {
//   return process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_ENABLE_MOCKS !== "false";
// }


export const SESSION_COOKIES = {
  user: "USER",
} as const;

export interface SessionUserData {
  age?: number;
  email?: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  roleId?: number;
  roleCode: string;
  loginBy?: string;
}

export interface SessionAccount {
  data: SessionUserData;
}

/**
 * Đọc cookie USER được tạo từ Redux AccountSlice.
 * Đây chỉ là dữ liệu phục vụ điều hướng UI,
 * không phải bằng chứng xác thực đáng tin cậy.
 */
export function parseUserCookie(
  cookieValue: string | undefined,
): SessionAccount | null {
  if (!cookieValue) return null;

  const candidates = [cookieValue];

  // Thử decode nếu cookie đang được URL-encode.
  try {
    const decoded = decodeURIComponent(cookieValue);

    if (decoded !== cookieValue) {
      candidates.push(decoded);
    }
  } catch {
    // Tiếp tục thử parse giá trị ban đầu.
  }

  for (const candidate of candidates) {
    try {
      const parsed: unknown = JSON.parse(candidate);

      if (!parsed || typeof parsed !== "object") {
        continue;
      }

      const data = (parsed as { data?: unknown }).data;

      if (!data || typeof data !== "object") {
        continue;
      }

      const roleCode = (data as { roleCode?: unknown }).roleCode;

      if (typeof roleCode !== "string" || !roleCode.trim()) {
        continue;
      }

      return parsed as SessionAccount;
    } catch {
      // Thử candidate tiếp theo.
    }
  }

  return null;
}

export function isDevelopmentMockMode(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_ENABLE_MOCKS !== "false"
  );
}

// **********************
export const AUTH_COOKIES = {
  accessToken: "pulse-access",
  refreshToken: "pulse-refresh",
} as const;

