import {
  Bookmark, Compass, Film, House, Mail, MessageCircle, Search, Settings2, Users, Bell, ShieldCheck,
} from "lucide-react";

export const clientNavigation = [
  { label: "Home feed", href: "/", icon: House },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Search", href: "/search", icon: Search },
  { label: "Reels", href: "/reels", icon: Film },
  { label: "Messages", href: "/messages", icon: Mail, count: "3" },
  { label: "Notifications", href: "/notifications", icon: Bell, count: "5" },
  { label: "Saved", href: "/saved", icon: Bookmark },
  { label: "Groups", href: "/groups", icon: Users },
];

export const adminNavigation = [
  { label: "Overview", href: "/admin", icon: House },
  { label: "User management", href: "/admin/users", icon: Users },
  { label: "Posts", href: "/admin/content/posts", icon: MessageCircle },
  { label: "Reels & media", href: "/admin/content/reels", icon: Film },
  { label: "Reports", href: "/admin/reports", icon: ShieldCheck, count: "12" },
  { label: "Categories & tags", href: "/admin/categories", icon: Compass },
  { label: "Analytics", href: "/admin/analytics", icon: Settings2 },
  { label: "Roles & permissions", href: "/admin/roles", icon: ShieldCheck },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
];
