import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
  return <main className="forbidden-page"><section className="card forbidden-card"><div className="forbidden-icon"><ShieldAlert size={28} /></div><span className="eyebrow">Access boundary</span><h1>This space is restricted</h1><p>Your current demo session does not have the admin role required to enter this area. In production, the backend must make this decision using a verified identity and trusted permissions.</p><div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}><Link href="/" className="button button-secondary">Return home</Link><Link href="/admin/login" className="button button-primary">Admin sign in</Link></div></section></main>;
}
