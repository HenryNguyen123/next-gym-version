"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, Bell, ChevronDown, LogOut, Menu, Search, Activity, Settings2, Sparkles, X } from "lucide-react";
import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { adminNavigation } from "@/lib/config/navigation";
import { Avatar } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useToast } from "@/components/providers/toast-provider";
import { logout } from "@/lib/services/auth.service";

function readableLabel(segment: string) {
  const map: Record<string, string> = {
    admin: "Overview", users: "Users", content: "Content", posts: "Posts", reels: "Reels", comments: "Comments",
    reports: "Reports", categories: "Categories", tags: "Tags", media: "Media library", analytics: "Analytics",
    roles: "Roles", permissions: "Permissions", notifications: "Notifications", "audit-logs": "Audit logs",
    settings: "Settings", general: "General", security: "Security",
  };
  return map[segment] ?? segment.replace(/[-_]/g, " ").replace(/^\w/, (letter) => letter.toUpperCase());
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  if (pathname === "/admin/login") return <>{children}</>;

  const parts = pathname.split("/").filter(Boolean).slice(1);
  const heading = parts.length ? readableLabel(parts[parts.length - 1]) : "Overview";
  const breadcrumb = parts.length ? parts.map(readableLabel) : ["Overview"];

  async function onLogout() {
    try {
      setLoggingOut(true);
      await logout();
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast("Could not end the admin session.", "error");
    } finally {
      setLoggingOut(false);
    }
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!searchText.trim()) return;
    toast(`Global admin search for “${searchText.trim()}” needs the search API.`, "info");
  }

  return <div className="admin-shell">
    {mobileOpen && <button className="admin-mobile-backdrop" aria-label="Close admin navigation" onClick={() => setMobileOpen(false)} />}
    <aside className={`admin-sidebar ${mobileOpen ? "mobile-open" : ""}`} aria-label="Admin navigation">
      <Link className="brand-lockup admin-brand" href="/admin"><span className="brand-symbol"><Sparkles size={18} /></span><span><span className="brand-word">pulse</span><span className="brand-caption">community console</span></span><span className="admin-tag">Admin</span></Link>
      <p className="sidebar-label">Workspace</p>
      <nav className="admin-sidebar-section">{adminNavigation.map(({ href, label, icon: Icon, count }) => {
        const active = href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`) || (href === "/admin/categories" && pathname.startsWith("/admin/tags"));
        return <Link href={href} key={href} className={`admin-side-link ${active ? "active" : ""}`} onClick={() => setMobileOpen(false)}><Icon size={17} /><span style={{ flex: 1 }}>{label}</span>{count && <span className="side-count">{count}</span>}</Link>;
      })}</nav>
      <p className="sidebar-label">Governance</p>
      <nav className="admin-sidebar-section">{[{ href: "/admin/audit-logs", label: "Audit logs", icon: Activity }, { href: "/admin/settings/general", label: "Settings", icon: Settings2 }].map(({ href, label, icon: Icon }) => <Link href={href} key={href} className={`admin-side-link ${pathname.startsWith(href) ? "active" : ""}`} onClick={() => setMobileOpen(false)}><Icon size={17} /><span>{label}</span></Link>)}</nav>
      <div className="admin-sidebar-footer"><div style={{ display: "flex", alignItems: "center", gap: 7 }}><span className="pill pill-success"><i className="status-pulse-dot" /> All systems nominal</span></div><strong style={{ marginTop: 9 }}>Keep the space thoughtful.</strong><p>Review reports, support members, and make careful decisions.</p><Link href="/admin/reports" className="button button-secondary button-sm" style={{ width: "100%" }}>Open moderation <ArrowUpRight size={13} /></Link></div>
      <div className="admin-profile-row"><Avatar name="Demo Administrator" tone={1} size="md" /><div className="admin-profile-copy"><strong>Demo Administrator</strong><span>Community admin · mock</span></div><button className="icon-button" aria-label="Sign out" disabled={loggingOut} onClick={onLogout}><LogOut size={15} /></button></div>
    </aside>
    <div className="admin-main">
      <header className="admin-topbar">
        <div className="admin-breadcrumb-wrap"><button className="icon-button admin-mobile-toggle" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} onClick={() => setMobileOpen((value) => !value)}>{mobileOpen ? <X size={18} /> : <Menu size={18} />}</button><div className="breadcrumbs"><Link href="/admin">Workspace</Link>{breadcrumb.map((item, index) => <span key={`${item}-${index}`} className="breadcrumb-part"><span>/</span><strong>{index === breadcrumb.length - 1 ? item : item}</strong></span>)}</div></div>
        <div className="admin-topbar-actions"><form className="search-box admin-global-search" onSubmit={submitSearch}><Search size={15} /><input className="input" aria-label="Search admin" placeholder="Search anything…" value={searchText} onChange={(event) => setSearchText(event.target.value)} /><kbd>⌘ K</kbd></form><button className="icon-button" aria-label="Notifications" title="Notifications" onClick={() => router.push("/admin/notifications")}><Bell size={17} /><i className="topbar-dot" /></button><ThemeToggle compact /><span className="admin-topbar-divider" /><button className="admin-topbar-user" onClick={() => toast("Signed in as a local demo admin.", "info")}><Avatar name="Demo Administrator" tone={1} size="sm" /><span>Admin</span><ChevronDown size={13} /></button></div>
      </header>
      <div className="admin-content admin-galaxy">{children}</div>
    </div>
  </div>;
}
