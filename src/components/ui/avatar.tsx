import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & { name: string; src?: string; size?: "xs" | "sm" | "md" | "lg" | "xl"; tone?: number; online?: boolean };

const tones = ["avatar-coral", "avatar-lilac", "avatar-mint", "avatar-sky", "avatar-amber", "avatar-rose"];

export function Avatar({ name, src, size = "md", tone = 0, online = false, className = "", ...props }: Props) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return (
    <div className={`avatar avatar-${size} ${tones[Math.abs(tone) % tones.length]} ${className}`.trim()} aria-label={name} {...props}>
      {src ? <img src={src} alt="" /> : <span>{initials}</span>}
      {online && <i className="avatar-online" aria-label="Online" />}
    </div>
  );
}
