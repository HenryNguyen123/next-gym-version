"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Compass, Home, LogOut, Mail, Menu, Plus, Search, Sparkles, X } from "lucide-react";
import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Avatar } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { clientNavigation } from "@/lib/config/navigation";
import { logout } from "@/lib/services/auth.service";
import { useToast } from "@/components/providers/toast-provider";

function pageHeading(pathname: string) {
  if (pathname === "/") return ["Good evening, friend", "A calm corner of the internet, just for you."];
  if (pathname.startsWith("/explore")) return ["Explore", "Find ideas, communities, and people worth following."];
  if (pathname.startsWith("/search")) return ["Search", "A little curiosity goes a long way."];
  if (pathname.startsWith("/reels")) return ["Reels", "Short stories and creative sparks from the community."];
  if (pathname.startsWith("/messages")) return ["Messages", "Keep the conversation going."];
  if (pathname.startsWith("/notifications")) return ["Notifications", "The moments you might have missed."];
  if (pathname.startsWith("/saved")) return ["Saved collection", "Keep the posts you want to come back to."];
  if (pathname.startsWith("/groups")) return ["Communities", "Find your people around the things you love."];
  if (pathname.startsWith("/settings")) return ["Settings", "Make Pulse feel more like you."];
  if (pathname.startsWith("/u/")) return ["Profile", "A window into someone’s world."];
  if (pathname.startsWith("/post/")) return ["Post details", "A conversation from your community."];
  return ["Pulse", "A little space for you."];
}

export function ClientShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [heading, subheading] = pageHeading(pathname);

  async function onLogout() {
    try {
      setLoggingOut(true);
      await logout();
      router.push("/login");
      router.refresh();
    } catch {
      toast("Could not end the session. Please try again.", "error");
    } finally {
      setLoggingOut(false);
    }
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchText.trim();
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  }

  return <div className="client-shell">
    {mobileMenuOpen && <button className="mobile-drawer-backdrop" aria-label="Close navigation menu" onClick={() => setMobileMenuOpen(false)} />}
    <aside className={`client-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`} aria-label="Main navigation">
      <Link className="brand-lockup" href="/" onClick={() => setMobileMenuOpen(false)}>
        <span className="brand-symbol"><Sparkles size={20} /></span><span><span className="brand-word">pulse</span><span className="brand-caption">a little space for you</span></span>
      </Link>
      <p className="sidebar-label">Your space</p>
      <nav className="side-nav">
        {clientNavigation.map(({ label, href, icon: Icon, count }) => {
          const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
          return <Link key={href} href={href} className={`side-link ${active ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
            <Icon size={18} strokeWidth={active ? 2.4 : 1.9} /><span className="side-link-label">{label}</span>{count && <span className="side-count">{count}</span>}
          </Link>;
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-promo"><div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--brand)" }}><Sparkles size={15} /><span className="eyebrow">Make it yours</span></div><strong>Your corner, your rules.</strong><p>Set your vibe and keep your space feeling right.</p><Link className="button button-secondary button-sm" href="/settings/appearance" onClick={() => setMobileMenuOpen(false)}>Personalize <Plus size={13} /></Link></div>
        <div className="sidebar-profile"><Avatar name="Your Name" tone={3} size="md" online /><div className="sidebar-profile-info"><strong>Your Name</strong><span>@you · Personal space</span></div><button className="icon-button" aria-label="Log out" title="Log out" disabled={loggingOut} onClick={onLogout}><LogOut size={16} /></button></div>
      </div>
    </aside>

    <div className="client-main">
      <header className="client-topbar">
        <button className="icon-button mobile-menu-button" aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} onClick={() => setMobileMenuOpen((value) => !value)}>{mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}</button>
        <Link href="/" className="topbar-mobile-brand"><span className="brand-symbol"><Sparkles size={17} /></span><span>pulse</span></Link>
        <div className="topbar-heading"><h1>{heading}</h1><p>{subheading}</p></div>
        <div className="topbar-actions">
          <form className="search-box" role="search" onSubmit={submitSearch}><Search size={16} /><input className="input" aria-label="Search Pulse" placeholder="Search people, topics…" value={searchText} onChange={(event) => setSearchText(event.target.value)} /></form>
          <button className="icon-button" aria-label="Open messages" title="Messages" onClick={() => router.push("/messages")}><Mail size={17} /></button>
          <button className="icon-button notification-button" aria-label="Open notifications" title="Notifications" onClick={() => router.push("/notifications")}><Bell size={17} /><i /></button>
          <span className="topbar-separator" />
          <ThemeToggle compact />
          <button className="user-avatar-top" style={{ border: 0, padding: 0, borderRadius: "50%", background: "transparent" }} aria-label="Open your profile" onClick={() => router.push("/u/you")}><Avatar name="Your Name" tone={3} size="sm" /></button>
        </div>
      </header>
      <main className="client-content">{children}</main>
      <nav className="client-bottom-nav" aria-label="Mobile navigation">
        {[{ href: "/", label: "Home", icon: Home }, { href: "/explore", label: "Explore", icon: Compass }, { href: "/search", label: "Search", icon: Search }, { href: "/messages", label: "Inbox", icon: Mail }, { href: "/notifications", label: "Activity", icon: Bell }].map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return <Link key={href} className={active ? "active" : ""} href={href}><Icon size={19} /><span>{label}</span></Link>;
        })}
      </nav>
    </div>
  </div>;
}
