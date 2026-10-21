"use client";

import { Laptop2, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  // next-themes resolves the saved value after hydration; system is a safe fallback.
  const current = theme ?? "system";
  const next = current === "light" ? "dark" : current === "dark" ? "system" : "light";
  const Icon = current === "system" ? Laptop2 : current === "dark" ? Moon : Sun;

  return (
    <button
      className={`icon-button theme-toggle ${compact ? "compact" : ""}`}
      aria-label={`Current theme ${current}. Switch to ${next}`}
      title={`Theme: ${current}`}
      onClick={() => setTheme(next)}
    >
      <Icon size={18} />
      {!compact && (
        <span>{current === "system" ? "System" : current === "dark" ? "Dark mode" : "Light mode"}</span>
      )}
    </button>
  );
}
