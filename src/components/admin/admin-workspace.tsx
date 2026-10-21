"use client";

import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity, ArrowRight, ArrowUpRight, Ban, Check, ChevronLeft, ChevronRight,
  CircleAlert, Download, Eye, FileImage, FileText, Filter, LockKeyhole,
  Plus, RefreshCcw, Search, ShieldCheck, UploadCloud, UserCheck, Users, Video, X, Heart,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/toast-provider";

export type AdminRecord = {
  id: string;
  name: string;
  detail: string;
  type: string;
  status: string;
  date: string;
  metric: string;
  tone: number;
};

const users: AdminRecord[] = [
  { id: "usr-1048", name: "Ava Thompson", detail: "ava.thompson@mail.com", type: "Member", status: "Active", date: "Oct 21, 2026", metric: "1,248", tone: 1 },
  { id: "usr-1047", name: "Theo Martin", detail: "theo.martin@mail.com", type: "Member", status: "Active", date: "Oct 21, 2026", metric: "842", tone: 2 },
  { id: "usr-1046", name: "Lina Chen", detail: "lina.chen@mail.com", type: "Moderator", status: "Pending", date: "Oct 20, 2026", metric: "3,106", tone: 3 },
  { id: "usr-1045", name: "Mateo Silva", detail: "mateo.silva@mail.com", type: "Member", status: "Active", date: "Oct 20, 2026", metric: "624", tone: 4 },
  { id: "usr-1044", name: "Nora Williams", detail: "nora.williams@mail.com", type: "Member", status: "Suspended", date: "Oct 19, 2026", metric: "74", tone: 5 },
  { id: "usr-1043", name: "Kai Johnson", detail: "kai.johnson@mail.com", type: "Admin", status: "Active", date: "Oct 18, 2026", metric: "2,409", tone: 0 },
  { id: "usr-1042", name: "Priya Patel", detail: "priya.patel@mail.com", type: "Member", status: "Active", date: "Oct 18, 2026", metric: "985", tone: 1 },
];

const recordSets: Record<string, AdminRecord[]> = {
  "content/posts": [
    { id: "post-3002", name: "A little reminder to make things that feel like you", detail: "@mayacreates · text + image", type: "Post", status: "Published", date: "Oct 21, 2026", metric: "248 reactions", tone: 1 },
    { id: "post-3001", name: "Shipped my smallest version of a big idea", detail: "@oliverbuilds · text", type: "Post", status: "Published", date: "Oct 21, 2026", metric: "96 reactions", tone: 2 },
    { id: "post-3000", name: "Sunday color study from around the city", detail: "@aishab · image", type: "Post", status: "Under review", date: "Oct 20, 2026", metric: "6 reports", tone: 4 },
    { id: "post-2999", name: "A small desk setup refresh", detail: "@leopark · image gallery", type: "Post", status: "Hidden", date: "Oct 19, 2026", metric: "2 reports", tone: 0 },
    { id: "post-2998", name: "A question for the creative community", detail: "@sofiam · text", type: "Post", status: "Published", date: "Oct 19, 2026", metric: "174 reactions", tone: 5 },
  ],
  "content/reels": [
    { id: "reel-518", name: "A few seconds of calm from the weekend", detail: "@mayacreates · 0:18", type: "Reel", status: "Published", date: "Oct 21, 2026", metric: "10.4k views", tone: 1 },
    { id: "reel-517", name: "Tiny details that make a workspace", detail: "@leopark · 0:32", type: "Reel", status: "Published", date: "Oct 20, 2026", metric: "7.1k views", tone: 0 },
    { id: "reel-516", name: "What I learned shipping v1", detail: "@oliverbuilds · 0:42", type: "Reel", status: "Under review", date: "Oct 20, 2026", metric: "3 reports", tone: 2 },
    { id: "reel-515", name: "City walk color palette", detail: "@aishab · 0:21", type: "Reel", status: "Hidden", date: "Oct 18, 2026", metric: "1 report", tone: 4 },
  ],
  "content/comments": [
    { id: "c-8871", name: "Potentially abusive reply", detail: "@quietreader · on post-3004", type: "Comment", status: "Under review", date: "Oct 21, 2026", metric: "4 reports", tone: 5 },
    { id: "c-8870", name: "Helpful feedback on a design", detail: "@noahw · on post-3002", type: "Comment", status: "Published", date: "Oct 21, 2026", metric: "12 likes", tone: 3 },
    { id: "c-8869", name: "Repeated promotional links", detail: "@linkdropper · on post-3000", type: "Comment", status: "Hidden", date: "Oct 20, 2026", metric: "2 reports", tone: 4 },
  ],
  reports: [
    { id: "rep-0721", name: "Potential harassment", detail: "Comment · @quietreader", type: "Harassment", status: "Open", date: "Oct 21, 2026", metric: "High", tone: 5 },
    { id: "rep-0720", name: "Misleading content", detail: "Post · @dailybrief", type: "Misinformation", status: "Open", date: "Oct 21, 2026", metric: "Normal", tone: 1 },
    { id: "rep-0719", name: "Spam / repetitive posts", detail: "Profile · @linkdropper", type: "Spam", status: "In review", date: "Oct 20, 2026", metric: "Normal", tone: 4 },
    { id: "rep-0718", name: "Impersonation concern", detail: "Profile · @fauxbrand", type: "Impersonation", status: "Escalated", date: "Oct 20, 2026", metric: "High", tone: 2 },
    { id: "rep-0717", name: "Unwanted direct message", detail: "Message · reporter hidden", type: "Safety", status: "Resolved", date: "Oct 19, 2026", metric: "Normal", tone: 3 },
  ],
  categories: [
    { id: "cat-01", name: "Design & creativity", detail: "design, visual craft, inspiration", type: "Category", status: "Active", date: "Oct 1, 2026", metric: "2,841 posts", tone: 1 },
    { id: "cat-02", name: "Technology", detail: "engineering, tools, product", type: "Category", status: "Active", date: "Oct 1, 2026", metric: "2,190 posts", tone: 0 },
    { id: "cat-03", name: "Everyday life", detail: "moments, habits, reflection", type: "Category", status: "Active", date: "Oct 2, 2026", metric: "1,887 posts", tone: 3 },
    { id: "cat-04", name: "Wellbeing", detail: "rest, healthful routines, balance", type: "Category", status: "Draft", date: "Oct 10, 2026", metric: "0 posts", tone: 2 },
  ],
  tags: [
    { id: "tag-201", name: "BuildInPublic", detail: "#buildinpublic", type: "Tag", status: "Active", date: "Oct 2, 2026", metric: "2.4k uses", tone: 2 },
    { id: "tag-202", name: "DesignSystems", detail: "#designsystems", type: "Tag", status: "Active", date: "Oct 2, 2026", metric: "1.8k uses", tone: 1 },
    { id: "tag-203", name: "SlowLiving", detail: "#slowliving", type: "Tag", status: "Active", date: "Oct 3, 2026", metric: "986 uses", tone: 3 },
  ],
  media: [
    { id: "med-0981", name: "forest-walk.jpg", detail: "JPEG image · 1.8 MB · @mayacreates", type: "Image", status: "Available", date: "Oct 21, 2026", metric: "1200 × 800", tone: 1 },
    { id: "med-0980", name: "studio-details.mp4", detail: "MP4 video · 8.4 MB · @leopark", type: "Video", status: "Available", date: "Oct 20, 2026", metric: "00:32", tone: 0 },
    { id: "med-0979", name: "color-study.png", detail: "PNG image · 2.2 MB · @aishab", type: "Image", status: "Pending review", date: "Oct 20, 2026", metric: "1600 × 900", tone: 4 },
  ],
  notifications: [
    { id: "ntf-108", name: "New moderation digest", detail: "Sent to moderators · daily digest", type: "System", status: "Sent", date: "Oct 21, 2026", metric: "18 recipients", tone: 1 },
    { id: "ntf-107", name: "Community update", detail: "In-app announcement", type: "Announcement", status: "Draft", date: "Oct 21, 2026", metric: "—", tone: 3 },
    { id: "ntf-106", name: "Policy reminder", detail: "Sent to all members", type: "System", status: "Sent", date: "Oct 18, 2026", metric: "24k recipients", tone: 2 },
  ],
  "audit-logs": [
    { id: "log-7810", name: "Report moved to review", detail: "Actor: moderator.lchen · rep-0719", type: "Moderation", status: "Success", date: "Oct 21, 2026 · 18:40", metric: "Audit record", tone: 3 },
    { id: "log-7809", name: "User status updated", detail: "Actor: admin.kjohnson · usr-1044", type: "User management", status: "Success", date: "Oct 21, 2026 · 18:12", metric: "Audit record", tone: 0 },
    { id: "log-7808", name: "Post hidden", detail: "Actor: moderator.lchen · post-2999", type: "Content moderation", status: "Success", date: "Oct 21, 2026 · 17:55", metric: "Audit record", tone: 5 },
    { id: "log-7807", name: "Permission check blocked", detail: "Actor: member.ava · role assignment", type: "Security", status: "Blocked", date: "Oct 21, 2026 · 17:42", metric: "Audit record", tone: 1 },
  ],
};

const pageMeta: Record<string, { title: string; eyebrow: string; description: string; singular: string }> = {
  users: { title: "User management", eyebrow: "Community members", description: "Find members, review account states, and manage access with clear context.", singular: "member" },
  "content/posts": { title: "Post management", eyebrow: "Content studio", description: "Review posts, publication state, and reported content in one place.", singular: "post" },
  "content/reels": { title: "Reels & video", eyebrow: "Content studio", description: "Review short-form media, availability, and publication status.", singular: "reel" },
  "content/comments": { title: "Comment moderation", eyebrow: "Content studio", description: "Keep conversations respectful with clear review and restore actions.", singular: "comment" },
  reports: { title: "Reports & moderation", eyebrow: "Trust and safety", description: "Triage incoming reports, record decisions, and resolve community issues.", singular: "report" },
  categories: { title: "Categories", eyebrow: "Content taxonomy", description: "Organize content with clear categories and meaningful usage counts.", singular: "category" },
  tags: { title: "Tags", eyebrow: "Content taxonomy", description: "Manage discoverability labels and track their usage across the platform.", singular: "tag" },
  media: { title: "Media library", eyebrow: "Assets & uploads", description: "Review media metadata and prepare uploads for the connected storage service.", singular: "asset" },
  analytics: { title: "Analytics & insights", eyebrow: "Product intelligence", description: "Explore illustrative engagement and retention metrics while the analytics API is being connected.", singular: "metric" },
  roles: { title: "Roles & permissions", eyebrow: "Access governance", description: "Review role definitions and understand the capabilities each role should have.", singular: "role" },
  permissions: { title: "Permission matrix", eyebrow: "Access governance", description: "Audit capability assignments. Saving real permissions must be enforced server-side.", singular: "permission" },
  notifications: { title: "Admin notifications", eyebrow: "Keep informed", description: "Review system notices and prepare announcements for members and moderators.", singular: "notification" },
  "audit-logs": { title: "Audit logs", eyebrow: "Governance & accountability", description: "Read-only event history for administrative and security-relevant actions.", singular: "event" },
  "settings/general": { title: "General settings", eyebrow: "Platform configuration", description: "Manage branding, sign-up behavior, and community defaults.", singular: "setting" },
  "settings/security": { title: "Security settings", eyebrow: "Platform configuration", description: "Review session policies and security controls before connecting production services.", singular: "setting" },
};

function getRouteKey(segments: string[]) {
  if (segments[0] === "content" && segments[1]) return `content/${segments[1]}`;
  if (segments[0] === "settings" && segments[1]) return `settings/${segments[1]}`;
  return segments[0] ?? "users";
}

function StatusPill({ status }: { status: string }) {
  const lower = status.toLowerCase();
  let style = "";
  if (["active", "published", "available", "sent", "success", "resolved", "approved"].includes(lower)) style = "pill-success";
  else if (["open", "under review", "in review", "pending", "draft", "pending review", "escalated"].includes(lower)) style = "pill-warning";
  else if (["suspended", "hidden", "blocked", "rejected"].includes(lower)) style = "pill-danger";
  else if (["admin", "moderator"].includes(lower)) style = "pill-brand";
  return <span className={`pill ${style}`}>{status}</span>;
}

function WorkspaceHead({ title, eyebrow, description, action }: { title: string; eyebrow: string; description: string; action?: ReactNode }) {
  return <div className="admin-page-head"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action && <div className="admin-head-actions">{action}</div>}</div>;
}

function GenericTableWorkspace({ routeKey, meta }: { routeKey: string; meta: (typeof pageMeta)[string] }) {
  const { toast } = useToast();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<AdminRecord[]>(routeKey === "users" ? users : recordSets[routeKey] ?? []);
  const [selected, setSelected] = useState<AdminRecord | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDetail, setNewDetail] = useState("");
  const notify = toast;
  const pageSize = 5;
  const statuses = Array.from(new Set(rows.map((row) => row.status)));
  const filtered = useMemo(() => rows.filter((row) => {
    const matchesQuery = `${row.name} ${row.detail} ${row.id} ${row.type}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (statusFilter === "All statuses" || row.status === statusFilter);
  }), [rows, query, statusFilter]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  function updateStatus(record: AdminRecord, nextStatus?: string) {
    let next = nextStatus;
    if (!next && routeKey === "reports") {
      next = record.status === "Open" ? "In review" : record.status === "Resolved" ? "Open" : "Resolved";
    } else if (!next && routeKey === "users") {
      next = record.status === "Suspended" ? "Active" : "Suspended";
    } else if (!next && routeKey.startsWith("content/")) {
      next = record.status === "Hidden" ? "Published" : "Hidden";
    } else if (!next && ["categories", "tags"].includes(routeKey)) {
      next = record.status === "Active" ? "Archived" : "Active";
    } else if (!next && routeKey === "media") {
      next = record.status === "Available" ? "Pending review" : "Available";
    } else if (!next) {
      next = record.status === "Suspended" ? "Active" : "Suspended";
    }
    setRows((current) => current.map((row) => row.id === record.id ? { ...row, status: next ?? row.status } : row));
    toast(`${record.name}: local status changed to ${next}. Real permissions and persistence require the API.`, "info");
  }

  function createRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newName.trim()) return;
    const row: AdminRecord = { id: `${routeKey.replaceAll("/", "-")}-${Date.now()}`, name: newName.trim(), detail: newDetail.trim() || "Created in local demo", type: meta.singular, status: "Draft", date: "Oct 21, 2026", metric: "—", tone: rows.length % 6 };
    setRows((current) => [row, ...current]); setNewName(""); setNewDetail(""); setShowCreate(false); setQuery(""); setStatusFilter("All statuses"); setPage(1); notify(`${meta.singular} added to local demo data.`);
  }

  return <>
    <WorkspaceHead title={meta.title} eyebrow={meta.eyebrow} description={meta.description} action={<><Button variant="secondary" leadingIcon={<Download size={14} />} onClick={() => { const csv = ["id,name,detail,type,status,date,metric", ...rows.map((r) => [r.id, r.name, r.detail, r.type, r.status, r.date, r.metric].map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))].join("\n"); const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `pulse-${routeKey.replaceAll("/", "-")}-sample.csv`; anchor.click(); URL.revokeObjectURL(url); toast("Sample data CSV exported.", "info"); }}>Export</Button>{!routeKey.startsWith("audit-logs") && <Button leadingIcon={<Plus size={14} />} onClick={() => setShowCreate(true)}>{routeKey === "users" ? "Invite member" : `Add ${meta.singular}`}</Button>}</>} />
    <div className="admin-module-summary-grid"><div className="card admin-module-summary"><span className="module-summary-icon"><Users size={16} /></span><div><span>Total records</span><strong>{rows.length.toLocaleString()}</strong></div></div><div className="card admin-module-summary"><span className="module-summary-icon module-summary-mint"><Activity size={16} /></span><div><span>Filtered results</span><strong>{filtered.length.toLocaleString()}</strong></div></div><div className="card admin-module-summary"><span className="module-summary-icon module-summary-amber"><ShieldCheck size={16} /></span><div><span>Needs attention</span><strong>{rows.filter((row) => ["Open", "Under review", "In review", "Pending", "Escalated", "Pending review"].includes(row.status)).length}</strong></div></div></div>
    <section className="card admin-table-card"><div className="table-toolbar"><div><h3 className="section-title">{routeKey === "audit-logs" ? "Recent events" : `All ${meta.singular}s`}</h3><p className="section-subtitle">{routeKey === "audit-logs" ? "Audit history is read-only in this interface." : "Search, filter, inspect, and take appropriate action."}</p></div><div className="table-toolbar-actions"><label className="table-search"><Search size={14} /><input className="input" aria-label={`Search ${meta.singular}s`} placeholder="Search records…" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} /></label><label className="table-filter-select"><Filter size={13} /><select aria-label="Filter by status" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}><option>All statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label></div></div>
      <div className="table-wrap"><table className="data-table"><thead><tr><th>{routeKey === "users" ? "Member" : "Name / resource"}</th><th>Type / context</th><th>Status</th><th>Date</th><th>{routeKey === "users" ? "Activity" : "Metric"}</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead><tbody>{pageRows.map((row) => <tr key={row.id}><td><div className="table-person"><Avatar name={row.name} tone={row.tone} size="sm" /><div><strong>{row.name}</strong><span>{row.detail}</span></div></div></td><td><span className="table-type">{row.type}</span><small className="table-id">{row.id}</small></td><td><StatusPill status={row.status} /></td><td>{row.date}</td><td>{row.metric}</td><td><div className="table-actions"><button className="icon-button" aria-label={`Inspect ${row.name}`} title="Inspect" onClick={() => setSelected(row)}><Eye size={15} /></button>{routeKey !== "audit-logs" && <button className="icon-button" aria-label={`${row.status === "Suspended" || row.status === "Hidden" ? "Restore" : "Change status for"} ${row.name}`} title="Change status" onClick={() => updateStatus(row)}>{row.status === "Suspended" || row.status === "Hidden" ? <RefreshCcw size={15} /> : <Ban size={15} />}</button>}</div></td></tr>)}</tbody></table>
        {!pageRows.length && <div className="empty-state"><div className="empty-state-icon"><Search size={21} /></div><h3>No records found</h3><p>Try changing the search phrase or status filter.</p><Button variant="secondary" size="sm" onClick={() => { setQuery(""); setStatusFilter("All statuses"); }}>Clear filters</Button></div>}
      </div>
      <div className="pagination"><span>Showing {filtered.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} records</span><div className="pagination-actions"><button className="page-number" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><ChevronLeft size={14} /></button>{Array.from({ length: pageCount }, (_, index) => <button key={index + 1} className={`page-number ${page === index + 1 ? "active" : ""}`} aria-current={page === index + 1 ? "page" : undefined} onClick={() => setPage(index + 1)}>{index + 1}</button>)}<button className="page-number" aria-label="Next page" disabled={page >= pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}><ChevronRight size={14} /></button></div></div>
    </section>

    {selected && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="record-detail-title"><div className="modal-head"><div><span className="eyebrow">Record details</span><h3 id="record-detail-title">{selected.name}</h3><p>{selected.id} · {selected.type}</p></div><button className="icon-button" aria-label="Close details" onClick={() => setSelected(null)}><X size={17} /></button></div><div className="record-detail-list">{[{ label: "Context", value: selected.detail }, { label: "Status", value: selected.status }, { label: "Created / updated", value: selected.date }, { label: "Metric", value: selected.metric }].map((item) => <div className="record-detail-row" key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}</div><div className="modal-note"><CircleAlert size={15} /><span>This is a mock record. Actions update only this page’s local state and are not sent to the backend.</span></div><div className="modal-actions"><Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>{routeKey === "users" && <Button onClick={() => { setSelected(null); router.push(`/admin/users/${selected.id}`); }}>Open member details <ArrowRight size={14} /></Button>}</div></div></div>}
    {showCreate && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowCreate(false); }}><div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="create-record-title"><div className="modal-head"><div><span className="eyebrow">Local demo action</span><h3 id="create-record-title">Add {meta.singular}</h3><p>This creates an in-memory sample record only.</p></div><button className="icon-button" aria-label="Close create form" onClick={() => setShowCreate(false)}><X size={17} /></button></div><form className="admin-create-form" onSubmit={createRecord}><div className="field"><label htmlFor="recordName">Name</label><input className="input" id="recordName" value={newName} onChange={(event) => setNewName(event.target.value)} required maxLength={120} placeholder={`Enter ${meta.singular} name`} /></div><div className="field"><label htmlFor="recordDetail">Description / context</label><textarea className="textarea" id="recordDetail" value={newDetail} onChange={(event) => setNewDetail(event.target.value)} placeholder="Optional details" maxLength={300} /></div><div className="modal-actions"><Button type="button" variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button><Button type="submit">Add to demo <Plus size={14} /></Button></div></form></div></div>}
    <div className="mock-data-disclaimer"><ShieldCheck size={14} /> The data and mutations on this page are mock-only. Server authorization, audit logging, and durable persistence must be implemented by the backend.</div>
  </>;
}

function MemberDetail({ id }: { id: string }) {
  const { toast } = useToast();
  const member = users.find((item) => item.id === id) ?? users[0];
  const [role, setRole] = useState(member.type);
  return <><WorkspaceHead eyebrow="Member profile" title={member.name} description={`Account detail for ${member.id}. Information is illustrative sample data.`} action={<><Button variant="secondary" onClick={() => toast("This opens the public profile once the user API is connected.", "info")}>View profile <ArrowUpRight size={14} /></Button><Button variant="danger" onClick={() => toast("Suspension requires a server-authorized moderation action.", "info")}>Suspend member</Button></>} /><div className="member-detail-grid"><section className="card member-overview"><div className="member-overview-top"><Avatar name={member.name} tone={member.tone} size="xl" /><span className="pill pill-success">Account active</span></div><h2>{member.name}</h2><p>{member.detail}</p><div className="member-id-pill">{member.id}</div><div className="member-profile-metrics"><div><strong>128</strong><span>Posts</span></div><div><strong>2.4k</strong><span>Followers</span></div><div><strong>398</strong><span>Following</span></div></div><div className="divider" style={{ margin: "18px 0" }} /><div className="member-meta-row"><span>Joined</span><strong>{member.date}</strong></div><div className="member-meta-row"><span>Last active</span><strong>Today, 6:42 PM</strong></div><div className="member-meta-row"><span>Current role</span><strong>{role}</strong></div></section><section className="card admin-card"><div className="section-head"><div><h3 className="section-title">Access and activity</h3><p className="section-subtitle">Role assignment is a mock preview control.</p></div><span className="pill pill-warning">Requires permission</span></div><div className="field"><label htmlFor="member-role">Role assignment</label><select id="member-role" className="select" value={role} onChange={(event) => setRole(event.target.value)}><option>Member</option><option>Moderator</option><option>Admin</option><option>Super Admin</option></select><p className="subtle" style={{ margin: 0, fontSize: 10 }}>The backend must prevent self-escalation and enforce role grants using a trusted permission model.</p><Button onClick={() => toast(`Role change for ${member.name} is local only; no permission was changed on the server.`, "info")}>Save role change</Button></div><div className="divider" style={{ margin: "23px 0" }} /><h3 className="section-title">Recent activity</h3><div className="activity-list"><div className="activity-item"><span className="activity-mark"><FileText size={15} /></span><div className="activity-copy"><p>Published a new post</p><span>Today, 5:14 PM</span></div></div><div className="activity-item"><span className="activity-mark activity-mark-mint"><Heart size={15} /></span><div className="activity-copy"><p>Reacted to 12 posts</p><span>Today, 3:27 PM</span></div></div><div className="activity-item"><span className="activity-mark activity-mark-amber"><Users size={15} /></span><div className="activity-copy"><p>Joined Design-minded people</p><span>Yesterday</span></div></div></div><Link href="/admin/audit-logs" className="button button-secondary button-sm" style={{ marginTop: 20 }}>View audit history <ArrowRight size={13} /></Link></section></div></>;
}

function AnalyticsWorkspace() {
  const { toast } = useToast();
  const [range, setRange] = useState("Last 30 days");
  return <><WorkspaceHead eyebrow="Product intelligence" title="Analytics & insights" description="Illustrative numbers to establish chart layouts and reporting interactions; not connected to live platform data." action={<label className="admin-range-select"><Filter size={14} /><select aria-label="Analytics date range" value={range} onChange={(event) => setRange(event.target.value)}><option>Last 7 days</option><option>Last 30 days</option><option>Last 90 days</option></select></label>} /><div className="admin-kpis">{[{ label: "Member retention", value: "68.4%", change: "+4.2%", note: "30-day rolling" }, { label: "Avg. daily active", value: "6,840", change: "+9.1%", note: "across 7 days" }, { label: "Engagement rate", value: "12.8%", change: "+1.6%", note: "reactions + comments" }, { label: "Reel completion", value: "42.3%", change: "+5.8%", note: "average watch depth" }].map((kpi) => <article className="card kpi-card" key={kpi.label}><div className="kpi-top"><span>{kpi.label}</span><span className="kpi-icon"><Activity size={16} /></span></div><div className="kpi-value"><strong>{kpi.value}</strong><span className="kpi-change"><ArrowUpRight size={12} />{kpi.change}</span></div><div className="kpi-foot">{kpi.note}</div></article>)}</div><div className="analytics-panel-grid"><section className="card admin-card"><div className="section-head"><div><h3 className="section-title">Engagement over time</h3><p className="section-subtitle">Selected range: {range} · illustrative sample</p></div><span className="pill pill-brand">Demo data</span></div><div className="analytics-line-chart" role="img" aria-label="Illustrative engagement line chart"><svg viewBox="0 0 620 230" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8174f2" stopOpacity=".23" /><stop offset="100%" stopColor="#8174f2" stopOpacity="0" /></linearGradient></defs><path d="M0 180 C35 174, 46 130, 82 140 S130 155, 165 111 S222 131, 252 94 S310 116, 340 82 S390 99, 425 57 S480 81, 510 47 S570 55, 620 18 L620 230 L0 230 Z" fill="url(#chart-fill)" /><path d="M0 180 C35 174, 46 130, 82 140 S130 155, 165 111 S222 131, 252 94 S310 116, 340 82 S390 99, 425 57 S480 81, 510 47 S570 55, 620 18" stroke="#8174f2" strokeWidth="3" strokeLinecap="round" fill="none" /></svg></div><div className="chart-labels"><span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span></div></section><section className="card admin-card"><div className="section-head"><div><h3 className="section-title">Content mix</h3><p className="section-subtitle">Published content types</p></div></div>{[{ name: "Text posts", value: "48%", width: 48, color: "purple" }, { name: "Image posts", value: "31%", width: 31, color: "mint" }, { name: "Short video / reels", value: "21%", width: 21, color: "amber" }].map((item) => <div className="content-mix-row" key={item.name}><div><span>{item.name}</span><strong>{item.value}</strong></div><div className="content-mix-track"><span className={`content-mix-fill ${item.color}`} style={{ width: item.width + "%" }} /></div></div>)}<Button variant="secondary" style={{ marginTop: 17 }} onClick={() => toast("Analytics export will be connected to the reporting API.", "info")}><Download size={14} /> Export analytics</Button></section></div><div className="mock-data-disclaimer"><CircleAlert size={14} /> Values shown here are sample analytics for layout validation and should not be used for business decisions.</div></>;
}

function PermissionWorkspace({ rolesOnly = false }: { rolesOnly?: boolean }) {
  const { toast } = useToast();
  const router = useRouter();
  const roles = ["Guest", "Member", "Moderator", "Admin", "Super Admin"];
  const permissionRows = ["Create posts", "Manage own content", "Review reports", "Manage users", "Manage taxonomy", "View analytics", "Manage roles", "Security settings"];
  const initial: Record<string, boolean[]> = { "Create posts": [false, true, true, true, true], "Manage own content": [false, true, true, true, true], "Review reports": [false, false, true, true, true], "Manage users": [false, false, false, true, true], "Manage taxonomy": [false, false, false, true, true], "View analytics": [false, false, true, true, true], "Manage roles": [false, false, false, false, true], "Security settings": [false, false, false, false, true] };
  const [matrix, setMatrix] = useState(initial);
  if (rolesOnly) return <><WorkspaceHead eyebrow="Access governance" title="Roles & permissions" description="A clear role hierarchy helps keep responsibilities focused and privileged actions accountable." action={<Button onClick={() => toast("Creating a new role requires the backend role-management API.", "info")}><Plus size={14} /> Create role</Button>} /><div className="role-cards-grid">{[{ name: "Guest", badge: "Public", users: "—", description: "Browse public pages and discover the community.", tone: "slate" }, { name: "Member", badge: "Standard", users: "23,894", description: "Publish personal content and engage with other members.", tone: "violet" }, { name: "Moderator", badge: "Trust & safety", users: "18", description: "Review reports and manage community content within scope.", tone: "mint" }, { name: "Admin", badge: "Operations", users: "6", description: "Manage members, content, taxonomy, and analytics.", tone: "amber" }, { name: "Super Admin", badge: "Privileged", users: "2", description: "Manage role grants and sensitive security configuration.", tone: "rose" }].map((role) => <article className="card role-card" key={role.name}><div className={`role-symbol role-symbol-${role.tone}`}><ShieldCheck size={19} /></div><div className="role-card-heading"><h3>{role.name}</h3><span className="pill">{role.badge}</span></div><p>{role.description}</p><div className="role-card-footer"><span>{role.users} {role.users === "—" ? "assigned" : "assigned users"}</span><button className="button button-ghost button-sm" onClick={() => { toast(`Opening permissions for ${role.name}.`, "info"); router.push("/admin/permissions"); }}>View permissions <ArrowRight size={13} /></button></div></article>)}</div><div className="card admin-card" style={{ marginTop: 18 }}><div className="section-head"><div><h3 className="section-title">Access model principles</h3><p className="section-subtitle">Security expectations for the production backend</p></div><span className="pill pill-warning">Server enforced</span></div><div className="access-principles-grid">{[{ icon: LockKeyhole, title: "Deny by default", text: "Every privileged action needs an explicit permission check." }, { icon: UserCheck, title: "No self-escalation", text: "Users cannot grant themselves roles or increase their own scope." }, { icon: Activity, title: "Auditable changes", text: "Record actor, target, timestamp, result, and meaningful context." }].map(({ icon: Icon, title, text }) => <div className="access-principle" key={title}><span><Icon size={17} /></span><div><strong>{title}</strong><p>{text}</p></div></div>)}</div></div></>;
  return <><WorkspaceHead eyebrow="Access governance" title="Permission matrix" description="This matrix is an editable prototype. Real permission changes must be authorized by trusted server-side logic." action={<Button onClick={() => toast("Permission matrix saved only in local state, not to the backend.", "info")}><Check size={14} /> Save changes</Button>} /><div className="card admin-card"><div className="section-head"><div><h3 className="section-title">Capability assignments</h3><p className="section-subtitle">Check each capability for a role. Super Admin capabilities are protected in production.</p></div><span className="pill pill-warning">Mock configuration</span></div><div className="table-wrap"><table className="permission-matrix"><thead><tr><th>Capability</th>{roles.map((role) => <th key={role}>{role}</th>)}</tr></thead><tbody>{permissionRows.map((permission) => <tr key={permission}><td><strong>{permission}</strong><small>{permission === "Manage roles" || permission === "Security settings" ? "Sensitive action" : "Platform capability"}</small></td>{roles.map((role, index) => <td key={role}><input className="permission-check" type="checkbox" aria-label={`${permission} for ${role}`} checked={matrix[permission][index]} disabled={role === "Super Admin"} onChange={(event) => setMatrix((current) => ({ ...current, [permission]: current[permission].map((value, i) => i === index ? event.target.checked : value) }))} /></td>)}</tr>)}</tbody></table></div><div className="permission-footnote"><LockKeyhole size={14} /> The Super Admin column is locked in the UI. The backend must enforce that restriction regardless of client input.</div></div></>;
}

function SettingsWorkspace({ security = false }: { security?: boolean }) {
  const { toast } = useToast();
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [emailVerification, setEmailVerification] = useState(true);
  const [moderationQueue, setModerationQueue] = useState(true);
  const [sessionMinutes, setSessionMinutes] = useState("60");
  const [mfaRequired, setMfaRequired] = useState(false);
  const [rateLimit, setRateLimit] = useState("5");
  return <><WorkspaceHead eyebrow="Platform configuration" title={security ? "Security settings" : "General settings"} description={security ? "Review account protection, session policies, and request safeguards." : "Set the basics that shape how Pulse looks and how people join the community."} action={<Button onClick={() => toast("Settings saved in local UI state only. Connect a server-owned configuration API to persist these values.", "info")}><Check size={14} /> Save changes</Button>} /><div className="admin-setting-grid"><section className="card admin-card"><div className="section-head"><div><h3 className="section-title">{security ? "Authentication policies" : "Community defaults"}</h3><p className="section-subtitle">{security ? "Suggested configuration controls" : "Changes that affect the member experience"}</p></div><span className="pill pill-brand">Editable demo</span></div>{!security ? <>{[{ title: "Allow new registrations", detail: "Allow new members to create accounts.", value: registrationOpen, set: setRegistrationOpen }, { title: "Require email verification", detail: "Members verify email before posting.", value: emailVerification, set: setEmailVerification }, { title: "Enable moderation queue", detail: "Route reported content for review.", value: moderationQueue, set: setModerationQueue }].map((item) => <div className="setting-row" key={item.title}><div><strong>{item.title}</strong><p>{item.detail}</p></div><button className="switch" role="switch" aria-checked={item.value} aria-label={item.title} onClick={() => item.set((value) => !value)} /></div>)}</> : <><div className="field" style={{ marginBottom: 15 }}><label htmlFor="sessionMinutes">Session lifetime</label><select className="select" id="sessionMinutes" value={sessionMinutes} onChange={(event) => setSessionMinutes(event.target.value)}><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="60">60 minutes</option><option value="240">4 hours</option><option value="720">12 hours</option></select></div><div className="field" style={{ marginBottom: 15 }}><label htmlFor="rateLimit">Login attempts before cooldown</label><select className="select" id="rateLimit" value={rateLimit} onChange={(event) => setRateLimit(event.target.value)}><option value="3">3 attempts</option><option value="5">5 attempts</option><option value="10">10 attempts</option></select></div><div className="setting-row"><div><strong>Require multi-factor authentication</strong><p>Require a second factor for privileged accounts.</p></div><button className="switch" role="switch" aria-checked={mfaRequired} aria-label="Require multi-factor authentication" onClick={() => setMfaRequired((value) => !value)} /></div></>}</section><section className="card admin-card"><div className="section-head"><div><h3 className="section-title">{security ? "Security posture" : "Brand & experience"}</h3><p className="section-subtitle">{security ? "Controls that still need server integration" : "A consistent feel across client and admin"}</p></div><span className="pill pill-warning">Needs integration</span></div>{!security ? <><div className="field" style={{ marginBottom: 15 }}><label htmlFor="siteName">Application name</label><input className="input" id="siteName" defaultValue="Pulse Social" /></div><div className="field" style={{ marginBottom: 15 }}><label htmlFor="supportEmail">Support email</label><input className="input" type="email" id="supportEmail" defaultValue="support@example.com" /></div><div className="field" style={{ marginBottom: 15 }}><label htmlFor="welcomeMessage">Welcome message</label><textarea className="textarea" id="welcomeMessage" defaultValue="A little space for you." /></div><Button variant="secondary" onClick={() => toast("Brand settings changed only in this form. Connect the configuration API.", "info")}>Preview brand settings</Button></> : <><div className="security-status-row"><span className="security-status-icon"><ShieldCheck size={19} /></span><div><strong>Authorization boundary</strong><p>UI route checks are not sufficient to protect API data.</p></div><span className="pill pill-warning">Review</span></div><div className="security-status-row"><span className="security-status-icon mint"><LockKeyhole size={19} /></span><div><strong>Secure cookies</strong><p>Backend should issue HttpOnly, Secure, SameSite cookies.</p></div><span className="pill pill-brand">Backend</span></div><div className="security-status-row"><span className="security-status-icon amber"><Activity size={19} /></span><div><strong>Rate limiting</strong><p>Enforce on the API and authentication endpoints.</p></div><span className="pill pill-brand">Backend</span></div><div className="security-status-row"><span className="security-status-icon rose"><ShieldCheck size={19} /></span><div><strong>Audit trail</strong><p>Record privileged mutations server-side.</p></div><span className="pill pill-brand">Backend</span></div></>}</section></div><div className="mock-data-disclaimer"><ShieldCheck size={14} /> Configuration controls are interactive examples only. Secure deployment requires server-owned validation, authorization, and persistence.</div></>;
}

function MediaWorkspace() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  return <><WorkspaceHead eyebrow="Assets and uploads" title="Media library" description="Inspect existing sample media and prepare an upload integration point." action={<Button onClick={() => document.getElementById("media-upload-input")?.click()}><UploadCloud size={14} /> Select files</Button>} /><div className="card media-upload-zone"><div className="media-upload-icon"><UploadCloud size={25} /></div><h3>Bring your media here</h3><p>Choose an image or video to validate the file metadata. Selecting a file does not upload or store it.</p><input id="media-upload-input" type="file" accept="image/*,video/*" className="visually-hidden" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /><Button variant="secondary" onClick={() => document.getElementById("media-upload-input")?.click()}>Choose a file</Button>{file && <div className="selected-file-row"><FileImage size={18} /><div><strong>{file.name}</strong><span>{(file.size / 1024 / 1024).toFixed(2)} MB · {file.type || "Unknown type"}</span></div><button className="icon-button" aria-label="Clear selected file" onClick={() => setFile(null)}><X size={15} /></button></div>}</div><div className="media-preview-grid">{(recordSets.media ?? []).map((media) => <article className="card media-file-card" key={media.id}><div className={`media-file-art media-file-art-${media.tone}`}>{media.type === "Video" ? <Video size={26} /> : <FileImage size={26} />}<span className="media-file-ext">{media.type === "Video" ? "MP4" : "JPG"}</span></div><div className="media-file-info"><strong>{media.name}</strong><span>{media.detail}</span><div><StatusPill status={media.status} /><button className="icon-button" aria-label={`Inspect ${media.name}`} onClick={() => toast("Media metadata is sample-only until the storage service is connected.", "info")}><ArrowUpRight size={15} /></button></div></div></article>)}</div><div className="mock-data-disclaimer"><UploadCloud size={14} /> For production, integrate signed uploads or a trusted upload endpoint. Never expose private storage credentials in the browser.</div></>;
}

export function AdminWorkspace() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean).slice(1);
  if (segments[0] === "users" && segments.length > 1) return <MemberDetail id={segments[1]} />;
  const key = getRouteKey(segments);
  const meta = pageMeta[key] ?? pageMeta.users;
  if (key === "analytics") return <AnalyticsWorkspace />;
  if (key === "roles") return <PermissionWorkspace rolesOnly />;
  if (key === "permissions") return <PermissionWorkspace />;
  if (key === "settings/general") return <SettingsWorkspace />;
  if (key === "settings/security") return <SettingsWorkspace security />;
  if (key === "media") return <MediaWorkspace />;
  return <GenericTableWorkspace key={key} routeKey={key} meta={meta} />;
}
