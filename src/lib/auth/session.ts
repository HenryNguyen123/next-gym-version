export const SESSION_COOKIES = {
  session: "pulse-session",
  role: "pulse-role",
} as const;

export function isDevelopmentMockMode(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_ENABLE_MOCKS !== "false";
}
