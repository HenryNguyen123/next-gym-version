import type { ReactNode } from "react";
import { ClientShell } from "@/components/social/client-shell";

export default function ClientLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <ClientShell>{children}</ClientShell>;
}
