import { describe, expect, it } from "vitest";
import { getRolePermissions, hasPermission, isAdminRole, PERMISSIONS } from "@/lib/auth/permissions";

describe("role permissions", () => {
  it("does not grant admin access to members", () => {
    expect(isAdminRole("user")).toBe(false);
    expect(hasPermission("user", PERMISSIONS.viewAdminDashboard)).toBe(false);
  });

  it("limits moderators to scoped moderation capabilities", () => {
    expect(hasPermission("moderator", PERMISSIONS.moderateReports)).toBe(true);
    expect(hasPermission("moderator", PERMISSIONS.manageUsers)).toBe(false);
    expect(hasPermission("moderator", PERMISSIONS.manageRoles)).toBe(false);
  });

  it("keeps role and security administration super-admin-only", () => {
    expect(hasPermission("admin", PERMISSIONS.manageRoles)).toBe(false);
    expect(hasPermission("admin", PERMISSIONS.manageSecurity)).toBe(false);
    expect(hasPermission("super_admin", PERMISSIONS.manageRoles)).toBe(true);
    expect(hasPermission("super_admin", PERMISSIONS.manageSecurity)).toBe(true);
  });

  it("returns a stable, empty permission set for guests represented as users", () => {
    expect(getRolePermissions("user")).toEqual([]);
  });
});
