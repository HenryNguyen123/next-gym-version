import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg" | "icon";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

export function Button({ className = "", variant = "primary", size = "md", leadingIcon, trailingIcon, children, ...props }: Props) {
  return (
    <button className={`button button-${variant} button-${size} ${className}`.trim()} {...props}>
      {leadingIcon}{children}{trailingIcon}
    </button>
  );
}
