// import type { AppRole } from "@/lib/types/auth";
// import  { RoleCode } from '@/lib/enums/role-code.enum';

// export const PERMISSIONS = {
//   viewAdminDashboard: "admin:dashboard:view",
//   manageUsers: "admin:users:manage",
//   managePosts: "admin:posts:manage",
//   manageReels: "admin:reels:manage",
//   moderateReports: "admin:reports:moderate",
//   manageTaxonomy: "admin:taxonomy:manage",
//   viewAnalytics: "admin:analytics:view",
//   manageRoles: "admin:roles:manage",
//   manageSecurity: "admin:security:manage",
//   viewAuditLogs: "admin:audit-logs:view",
// } as const;

// export type AppPermission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// const ROLE_PERMISSIONS: Record<AppRole, readonly AppPermission[]> = {
//   user: [],
//   moderator: [PERMISSIONS.viewAdminDashboard, PERMISSIONS.moderateReports, PERMISSIONS.managePosts, PERMISSIONS.manageReels, PERMISSIONS.viewAuditLogs],
//   admin: [PERMISSIONS.viewAdminDashboard, PERMISSIONS.manageUsers, PERMISSIONS.managePosts, PERMISSIONS.manageReels, PERMISSIONS.moderateReports, PERMISSIONS.manageTaxonomy, PERMISSIONS.viewAnalytics, PERMISSIONS.viewAuditLogs],
//   super_admin: Object.values(PERMISSIONS),
// };

// export function hasPermission(role: AppRole | undefined, permission: AppPermission): boolean {
//   return role ? ROLE_PERMISSIONS[role].includes(permission) : false;
// }

// export function getRolePermissions(role: AppRole): readonly AppPermission[] {
//   return ROLE_PERMISSIONS[role];
// }

// export function isAdminRole(role: string | undefined): role is Exclude<AppRole, "user"> {
//   return role === "moderator" || role === RoleCode.ADMIN || role === RoleCode.SUPERADMIN;
// }


import type { AppRole } from "@/lib/types/auth";
import { RoleCode } from "@/lib/enums/role-code.enum";

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

export type AppPermission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

function normalizeRoleCode(code: string | undefined): string {
  return (code ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
    .replace(/^role_/, "");
}

export function toAppRole(
  roleCode: string | undefined,
): AppRole | undefined {
  const code = normalizeRoleCode(roleCode);

  const adminCode = normalizeRoleCode(String(RoleCode.ADMIN));
  const superAdminCode = normalizeRoleCode(
    String(RoleCode.SUPERADMIN),
  );

  if (
    code === "SUPER_ADMIN" ||
    code === "superadmin" ||
    code === superAdminCode
  ) {
    return "super_admin";
  }

  if (code === "ADMIN" || code === adminCode) {
    return "ADMIN";
  }

  if (code === "moderator") {
    return "moderator";
  }

  if (code === "USER") {
    return "USER";
  }

  return undefined;
}

const ROLE_PERMISSIONS: Record<
  AppRole,
  readonly AppPermission[]
> = {
  USER: [],

  moderator: [
    PERMISSIONS.viewAdminDashboard,
    PERMISSIONS.moderateReports,
    PERMISSIONS.managePosts,
    PERMISSIONS.manageReels,
    PERMISSIONS.viewAuditLogs,
  ],

  ADMIN: [
    PERMISSIONS.viewAdminDashboard,
    PERMISSIONS.manageUsers,
    PERMISSIONS.managePosts,
    PERMISSIONS.manageReels,
    PERMISSIONS.moderateReports,
    PERMISSIONS.manageTaxonomy,
    PERMISSIONS.viewAnalytics,
    PERMISSIONS.viewAuditLogs,
  ],

  super_admin: Object.values(PERMISSIONS),
};

export function hasPermission(
  role: AppRole | undefined,
  permission: AppPermission,
): boolean {
  if (!role) return false;

  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasPermissionByCode(
  roleCode: string | undefined,
  permission: AppPermission,
): boolean {
  return hasPermission(toAppRole(roleCode), permission);
}

export function hasAnyRole(
  roleCodes: readonly string[] | undefined,
  allowedRoles: readonly AppRole[],
): boolean {
  return (
    roleCodes?.some((code) => {
      const role = toAppRole(code);
      return !!role && allowedRoles.includes(role);
    }) ?? false
  );
}

export function hasPermissionForRoles(
  roleCodes: readonly string[] | undefined,
  permission: AppPermission,
): boolean {
  return (
    roleCodes?.some((code) =>
      hasPermissionByCode(code, permission),
    ) ?? false
  );
}

export function isAdminRole(
  roleCodes: readonly string[] | undefined,
): boolean {
  return hasAnyRole(roleCodes, [
    "moderator",
    "ADMIN",
    "super_admin",
  ]);
}