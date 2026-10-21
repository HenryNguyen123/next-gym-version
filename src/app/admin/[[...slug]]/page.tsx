"use client";

import { usePathname } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminWorkspace } from "@/components/admin/admin-workspace";

export default function AdminRouterPage() {
  const pathname = usePathname();
  return pathname === "/admin" ? <AdminDashboard /> : <AdminWorkspace />;
}
