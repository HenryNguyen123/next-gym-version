import type { UserData } from "@/lib/types/account";

const ACCOUNT_KEY = "pulse-account";

function isValidAccount(value: unknown): value is UserData {
  if (!value || typeof value !== "object") return false;

  const account = value as Partial<UserData>;

  return (
    typeof account.id === "number" &&
    typeof account.userName === "string" &&
    typeof account.email === "string" &&
    !!account.profile &&
    typeof account.profile === "object" &&
    Array.isArray(account.roles) &&
    account.roles.every(
      (role) =>
        role !== null &&
        typeof role === "object" &&
        typeof role.code === "string",
    )
  );
}

export function saveAccount(account: UserData): void {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
}

export function readAccount(): UserData | null {
  if (typeof window === "undefined") return null;

  try {
    const value = sessionStorage.getItem(ACCOUNT_KEY);

    if (!value) return null;

    const parsed: unknown = JSON.parse(value);

    if (!isValidAccount(parsed)) {
      sessionStorage.removeItem(ACCOUNT_KEY);
      return null;
    }

    return parsed;
  } catch {
    sessionStorage.removeItem(ACCOUNT_KEY);
    return null;
  }
}

export function clearAccount(): void {
  if (typeof window === "undefined") return;

  sessionStorage.removeItem(ACCOUNT_KEY);

  // Xóa cookie USER cũ của kiến trúc trước.
  document.cookie =
    "USER=; Path=/; Max-Age=0; SameSite=Lax";
}