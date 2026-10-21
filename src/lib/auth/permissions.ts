import type { AppRole } from "@/lib/types/auth";

export const PERMISSIONS = {
  viewAdminDashboard: "admin:dashboard:view",
  manageUsers: "admin:users:manage",
  managePosts: "admin:posts:manage",
  manageReels: "admin:reels:manage",
  moderateReports: "admin:reports:moderate",
  manageTaxonomy: "admin:taxonomy:manage",
  viewAnalytics: "admin:analytics:view",
  manageRoles: "admin:roles:manage",
  manageSecurity: "admin:security:manage",
  viewAuditLogs: "admin:audit-logs:view",
} as const;

export type AppPermission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const ROLE_PERMISSIONS: Record<AppRole, readonly AppPermission[]> = {
  user: [],
  moderator: [PERMISSIONS.viewAdminDashboard, PERMISSIONS.moderateReports, PERMISSIONS.managePosts, PERMISSIONS.manageReels, PERMISSIONS.viewAuditLogs],
  admin: [PERMISSIONS.viewAdminDashboard, PERMISSIONS.manageUsers, PERMISSIONS.managePosts, PERMISSIONS.manageReels, PERMISSIONS.moderateReports, PERMISSIONS.manageTaxonomy, PERMISSIONS.viewAnalytics, PERMISSIONS.viewAuditLogs],
  super_admin: Object.values(PERMISSIONS),
};

export function hasPermission(role: AppRole | undefined, permission: AppPermission): boolean {
  return role ? ROLE_PERMISSIONS[role].includes(permission) : false;
}

export function getRolePermissions(role: AppRole): readonly AppPermission[] {
  return ROLE_PERMISSIONS[role];
}

export function isAdminRole(role: string | undefined): role is Exclude<AppRole, "user"> {
  return role === "moderator" || role === "admin" || role === "super_admin";
}
