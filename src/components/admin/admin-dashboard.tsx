"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import { Activity, ArrowRight, ArrowUpRight, CalendarDays, Download, Flag, FileText, MessageCircle, MoreHorizontal, ShieldCheck, TrendingUp, UserPlus, Users, Video } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/toast-provider";

const weeklyBars = [36, 48, 44, 65, 57, 70, 59, 78, 68, 86, 73, 95];
const weeklyBarsSecondary = [23, 34, 30, 42, 39, 51, 47, 56, 50, 61, 58, 70];

const recentUsers = [
  { name: "Ava Thompson", email: "ava.thompson@mail.com", date: "Oct 21, 2026", tone: 1, status: "Active" },
  { name: "Theo Martin", email: "theo.martin@mail.com", date: "Oct 21, 2026", tone: 2, status: "Active" },
  { name: "Lina Chen", email: "lina.chen@mail.com", date: "Oct 20, 2026", tone: 3, status: "Pending" },
  { name: "Mateo Silva", email: "mateo.silva@mail.com", date: "Oct 20, 2026", tone: 4, status: "Active" },
];

const recentReports = [
  { title: "Potential harassment", detail: "Comment · @quietreader", priority: "High", tone: "danger" },
  { title: "Misleading content", detail: "Post · @dailybrief", priority: "Normal", tone: "warning" },
  { title: "Spam / repetitive posts", detail: "Profile · @linkdropper", priority: "Normal", tone: "warning" },
];

function PageHead({ onExport }: { onExport: () => void }) {
  const [range, setRange] = useState("Last 7 days");
  return <div className="admin-page-head"><div><div className="eyebrow">Community health · overview</div><h1>Good evening, admin <span className="wave-emoji">✦</span></h1><p>Here’s what’s happening in your Pulse community today.</p></div><div className="admin-head-actions"><label className="admin-range-select"><CalendarDays size={14} /><select aria-label="Dashboard date range" value={range} onChange={(event) => setRange(event.target.value)}><option>Last 7 days</option><option>Last 30 days</option><option>Last 90 days</option></select></label><Button variant="secondary" leadingIcon={<Download size={14} />} onClick={onExport}>Export report</Button></div></div>;
}

export function AdminDashboard() {
  const { toast } = useToast();
  const [chartMode, setChartMode] = useState<"Users" | "Content">("Users");
  const kpis = [
    { label: "Total members", value: "24,892", change: "+12.8%", foot: "vs. previous period", icon: Users, color: "violet" },
    { label: "Active this week", value: "8,421", change: "+8.4%", foot: "weekly active members", icon: Activity, color: "mint" },
    { label: "Posts published", value: "3,672", change: "+18.2%", foot: "including short videos", icon: FileText, color: "amber" },
    { label: "Reports to review", value: "12", change: "4 urgent", foot: "needs moderator attention", icon: Flag, color: "rose", warning: true },
  ];

  function exportReport() {
    const csv = ["Metric,Value", "Total members,24892", "Active this week,8421", "Posts published,3672", "Reports to review,12"].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pulse-dashboard-sample.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast("Sample dashboard CSV exported. Values are illustrative mock data.", "info");
  }

  return <>
    <PageHead onExport={exportReport} />
    <div className="admin-kpis">{kpis.map((item) => { const Icon = item.icon; return <article className="card kpi-card" key={item.label}><div className="kpi-top"><span>{item.label}</span><span className={`kpi-icon kpi-icon-${item.color}`}><Icon size={16} /></span></div><div className="kpi-value"><strong>{item.value}</strong><span className={`kpi-change ${item.warning ? "warning-change" : ""}`}>{item.warning ? <Flag size={12} /> : <ArrowUpRight size={12} />}{item.change}</span></div><div className="kpi-foot">{item.foot}</div><div className="kpi-sparkline" aria-hidden="true">{Array.from({ length: 14 }, (_, index) => <i key={index} style={{ height: `${18 + ((index * (item.label.length + 7)) % 40)}%` }} />)}</div></article>; })}</div>

    <div className="admin-dashboard-grid">
      <section className="card admin-card chart-card"><div className="section-head"><div><h3 className="section-title">Community growth</h3><p className="section-subtitle">A seven-day look at member and content activity</p></div><div className="chart-mode-switch">{(["Users", "Content"] as const).map((item) => <button key={item} className={chartMode === item ? "selected" : ""} onClick={() => setChartMode(item)}>{item}</button>)}</div></div><div className="chart-legend"><span><i className="legend-dot" />{chartMode === "Users" ? "New members" : "Posts published"}</span><span><i className="legend-dot legend-dot-secondary" />{chartMode === "Users" ? "Returning members" : "Comments & reactions"}</span></div><div className="chart-bars" role="img" aria-label={`${chartMode} activity chart, illustrative sample data`}>{weeklyBars.map((height, index) => <div className="chart-bar-group" key={index}><span className="chart-bar" style={{ height: `${chartMode === "Users" ? height : Math.max(14, height - 10)}%` }} /><span className="chart-bar secondary" style={{ height: `${chartMode === "Users" ? weeklyBarsSecondary[index] : Math.min(92, weeklyBarsSecondary[index] + 12)}%` }} /></div>)}</div><div className="chart-labels"><span>Oct 15</span><span>Oct 16</span><span>Oct 17</span><span>Oct 18</span><span>Oct 19</span><span>Oct 20</span><span>Oct 21</span></div><div className="chart-footnote"><span><TrendingUp size={13} /> Trend is up compared with the prior week</span><span>Sample metrics <i className="chart-footnote-dot" /></span></div></section>
      <section className="card admin-card"><div className="section-head"><div><h3 className="section-title">Recent activity</h3><p className="section-subtitle">What has changed across Pulse</p></div><button className="icon-button" aria-label="More activity options" onClick={() => toast("Activity history is sample data.", "info")}><MoreHorizontal size={17} /></button></div><div className="activity-list">
        <div className="activity-item"><span className="activity-mark"><UserPlus size={15} /></span><div className="activity-copy"><p><b>128 new members</b> joined the community.</p><span>Today, 6:42 PM</span></div></div>
        <div className="activity-item"><span className="activity-mark activity-mark-mint"><MessageCircle size={15} /></span><div className="activity-copy"><p>Engagement increased by <b>8.4%</b> this week.</p><span>Today, 4:08 PM</span></div></div>
        <div className="activity-item"><span className="activity-mark activity-mark-amber"><ShieldCheck size={15} /></span><div className="activity-copy"><p><b>5 reports</b> were resolved by moderators.</p><span>Today, 2:31 PM</span></div></div>
        <div className="activity-item"><span className="activity-mark activity-mark-rose"><Video size={15} /></span><div className="activity-copy"><p>A new reel reached <b>10k views</b>.</p><span>Today, 12:16 PM</span></div></div>
      </div><Link href="/admin/audit-logs" className="button button-ghost button-sm" style={{ marginTop: 17, width: "100%" }}>View activity log <ArrowRight size={13} /></Link></section>
    </div>

    <div className="admin-dashboard-grid admin-dashboard-grid-bottom">
      <section className="card admin-table-card"><div className="table-toolbar"><div><h3 className="section-title">Recently joined</h3><p className="section-subtitle">New members across your community</p></div><Link href="/admin/users" className="button button-ghost button-sm">View all <ArrowRight size={13} /></Link></div><div className="table-wrap"><table className="data-table"><thead><tr><th>Member</th><th>Joined</th><th>Status</th><th aria-label="Actions" /></tr></thead><tbody>{recentUsers.map((user) => <tr key={user.email}><td><div className="table-person"><Avatar name={user.name} tone={user.tone} size="sm" /><div><strong>{user.name}</strong><span>{user.email}</span></div></div></td><td>{user.date}</td><td><span className={`pill ${user.status === "Active" ? "pill-success" : "pill-warning"}`}>{user.status}</span></td><td><button className="icon-button" aria-label={`View ${user.name}`} onClick={() => toast(`Opening ${user.name} needs the user detail API.`, "info")}><ArrowUpRight size={15} /></button></td></tr>)}</tbody></table></div></section>
      <section className="card admin-table-card"><div className="table-toolbar"><div><h3 className="section-title">Needs a closer look</h3><p className="section-subtitle">A little attention can help</p></div><span className="pill pill-danger">12 open</span></div><div className="report-list">{recentReports.map((report) => <div className="report-row" key={report.title}><span className={`report-mark report-mark-${report.tone}`}><Flag size={15} /></span><div className="report-copy"><strong>{report.title}</strong><span>{report.detail}</span></div><span className={`pill ${report.tone === "danger" ? "pill-danger" : "pill-warning"}`}>{report.priority}</span></div>)}</div><div style={{ padding: "0 18px 15px" }}><Link href="/admin/reports" className="button button-secondary button-sm" style={{ width: "100%" }}>Open moderation queue <ArrowRight size={13} /></Link></div></section>
    </div>
    <div className="mock-data-disclaimer"><ShieldCheck size={14} /> All statistics, charts, activity items, and member records on this dashboard are illustrative demo data until connected to the backend analytics API.</div>
  </>;
}
