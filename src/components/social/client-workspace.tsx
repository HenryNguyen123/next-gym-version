"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  ArrowRight, Bell, Bookmark, Check, Compass, Film, Heart, Image, LockKeyhole, Mail,
  MessageCircle, MoreHorizontal, Search, Send, Settings2, SlidersHorizontal,
  Sparkles, Users, UserRound, Video, Volume2, VolumeX, Plus, CheckCheck,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { PostCard } from "@/components/social/post-card";
import { initialPosts, trendingTopics } from "@/lib/mocks/social-data";
import { useToast } from "@/components/providers/toast-provider";

const settingLinks = [
  { href: "/settings/profile", label: "Profile information", icon: UserRound },
  { href: "/settings/account", label: "Account", icon: Settings2 },
  { href: "/settings/privacy", label: "Privacy & safety", icon: LockKeyhole },
  { href: "/settings/appearance", label: "Appearance", icon: Sparkles },
];

const notificationsSeed = [
  { id: "n1", name: "Maya Chen", tone: 1, text: "reacted to your latest post", time: "4 min ago", icon: Heart, unread: true },
  { id: "n2", name: "Oliver Reed", tone: 2, text: "started following you", time: "25 min ago", icon: UserRound, unread: true },
  { id: "n3", name: "Aisha Bello", tone: 4, text: "mentioned you in a comment", time: "1 hour ago", icon: MessageCircle, unread: true },
  { id: "n4", name: "Design Notes", tone: 5, text: "shared a new post in a community you follow", time: "3 hours ago", icon: Compass, unread: false },
  { id: "n5", name: "Pulse", tone: 0, text: "Your weekly recap is ready to explore", time: "Yesterday", icon: Sparkles, unread: false },
];

const conversationsSeed = [
  { id: "maya", name: "Maya Chen", username: "mayacreates", tone: 1, preview: "That palette is so good!", time: "2m", online: true, messages: ["Hey! I saw your latest post about making time for creative work.", "It really resonated with me.", "That palette is so good! 🌿"] },
  { id: "oliver", name: "Oliver Reed", username: "oliverbuilds", tone: 2, preview: "Sent you the link", time: "18m", online: true, messages: ["I finally shipped the tiny project I mentioned.", "Sent you the link — would love your thoughts."] },
  { id: "aisha", name: "Aisha Bello", username: "aishab", tone: 4, preview: "See you there ✨", time: "1h", online: false, messages: ["Are you coming to the design meetup this weekend?", "See you there ✨"] },
  { id: "leo", name: "Leo Park", username: "leopark", tone: 0, preview: "You: Sounds great", time: "1d", online: false, messages: ["Let’s work on something together.", "You: Sounds great"] },
];

const groupsSeed = [
  { id: "g1", name: "Design-minded people", category: "Design", members: "8.2k members", tone: 1, description: "A thoughtful place to share work-in-progress, feedback, and design decisions." },
  { id: "g2", name: "Build in public", category: "Indie makers", members: "5.7k members", tone: 3, description: "Share small wins, tough lessons, launches, and what you are learning along the way." },
  { id: "g3", name: "Slow living club", category: "Lifestyle", members: "3.1k members", tone: 2, description: "For people choosing intention, creativity, and a little more breathing room." },
  { id: "g4", name: "Creative coding", category: "Technology", members: "2.4k members", tone: 4, description: "Generative art, playful experiments, frontend craft, and tiny weird ideas." },
];

function WorkspaceHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="workspace-header"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2><p>{description}</p></div>{action && <div className="workspace-actions">{action}</div>}</div>;
}

function ExploreWorkspace({ searchPage = false }: { searchPage?: boolean }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const { toast } = useToast();
  const filteredPosts = useMemo(() => initialPosts.filter((post) => {
    const matchesQuery = `${post.author} ${post.username} ${post.text} ${post.tag ?? ""}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "All" || (filter === "Photos" ? Boolean(post.image) : filter === "Text" ? !post.image : post.tag?.toLowerCase().includes(filter.toLowerCase()) ?? false);
    return matchesQuery && matchesFilter;
  }), [query, filter]);
  return <>
    <WorkspaceHeader eyebrow={searchPage ? "Follow your curiosity" : "Fresh perspectives"} title={searchPage ? "Search Pulse" : "Explore something new"} description={searchPage ? "Search people, conversations, or a topic you can’t stop thinking about." : "Discover ideas, creators, and communities that might feel like home."} />
    <div className="card card-pad" style={{ marginBottom: 18 }}>
      <div className="explore-search"><Search size={18} /><input className="input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={searchPage ? "Try ‘design systems’ or ‘Maya Chen’…" : "Search people, topics, or posts…"} aria-label="Search posts and people" /></div>
      <div className="filter-row"><div className="filter-row-label"><SlidersHorizontal size={14} /> Filter results</div>{["All", "Photos", "Text", "Design", "Slow"].map((item) => <button key={item} className={`filter-chip ${filter === item ? "selected" : ""}`} onClick={() => setFilter(item)}>{item}</button>)}</div>
    </div>
    {!searchPage && <div className="explore-feature-grid">
      <button className="explore-feature explore-feature-violet" onClick={() => { setFilter("Design"); toast("Filtered to design-related posts.", "info"); }}><span><Sparkles size={20} /></span><div><strong>Design that feels human</strong><small>Ideas and work in progress</small></div><ArrowRight size={16} /></button>
      <button className="explore-feature explore-feature-mint" onClick={() => { setFilter("Slow"); toast("Filtered to slow-living posts.", "info"); }}><span><Compass size={20} /></span><div><strong>Make room to breathe</strong><small>Routines, rituals, small joys</small></div><ArrowRight size={16} /></button>
      <button className="explore-feature explore-feature-amber" onClick={() => { setFilter("Text"); toast("Showing text-first conversations.", "info"); }}><span><MessageCircle size={20} /></span><div><strong>Conversations in motion</strong><small>Thoughtful takes from your circle</small></div><ArrowRight size={16} /></button>
    </div>}
    <div className="workspace-list-head"><div><h3 className="section-title">{query ? `Results for “${query}”` : searchPage ? "Suggested searches" : "Worth a look"}</h3><p className="section-subtitle">{filteredPosts.length} posts from local sample data</p></div><button className="button button-ghost button-sm" onClick={() => { setQuery(""); setFilter("All"); }}>Clear filters <Plus size={13} /></button></div>
    <div className="workspace-post-list">{filteredPosts.length ? filteredPosts.map((post) => <PostCard key={post.id} post={post} />) : <div className="card empty-state"><div className="empty-state-icon"><Search size={22} /></div><h3>No matches yet</h3><p>Try another phrase or remove a filter. This search currently uses local demo data.</p><Button size="sm" onClick={() => { setQuery(""); setFilter("All"); }}>Reset search</Button></div>}</div>
    <div className="card mini-card" style={{ marginTop: 18 }}><div className="section-head"><div><h3 className="section-title">Topics picking up</h3><p className="section-subtitle">Conversation starters from the sample feed</p></div></div><div className="topic-chip-row">{trendingTopics.map((topic) => <button className="topic-chip" key={topic.tag} onClick={() => setQuery(topic.tag.replace(/([A-Z])/g, " $1").trim())}>#{topic.tag}<span>{topic.posts}</span></button>)}</div></div>
  </>;
}

function MessagesWorkspace() {
  const [activeId, setActiveId] = useState(conversationsSeed[0].id);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [localMessages, setLocalMessages] = useState<Record<string, string[]>>({});
  const { toast } = useToast();
  const active = conversationsSeed.find((conversation) => conversation.id === activeId) ?? conversationsSeed[0];
  const messages = [...active.messages, ...(localMessages[active.id] ?? [])];
  const conversations = conversationsSeed.filter((conversation) => `${conversation.name} ${conversation.username} ${conversation.preview}`.toLowerCase().includes(search.toLowerCase()));
  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = draft.trim();
    if (!value) return;
    setLocalMessages((current) => ({ ...current, [active.id]: [...(current[active.id] ?? []), value] }));
    setDraft("");
    toast("Message added locally. Real-time delivery needs a messaging backend.", "info");
  }
  return <>
    <WorkspaceHeader eyebrow="Private conversations" title="Messages" description="A quieter place to keep a conversation going." action={<Button variant="secondary" leadingIcon={<Plus size={15} />} onClick={() => toast("New conversation discovery needs the user-search API.", "info")}>New message</Button>} />
    <div className="card message-layout">
      <section className="conversation-list"><div className="section-head"><h3 className="section-title">Inbox</h3><span className="pill pill-brand">3 unread</span></div><div className="explore-search" style={{ marginBottom: 12 }}><Search size={14} /><input className="input" aria-label="Search conversations" placeholder="Search inbox" value={search} onChange={(event) => setSearch(event.target.value)} /></div>{conversations.map((conversation) => <button key={conversation.id} className={`conversation-item ${active.id === conversation.id ? "active" : ""}`} onClick={() => setActiveId(conversation.id)}><Avatar name={conversation.name} tone={conversation.tone} online={conversation.online} /><span className="conversation-copy"><strong>{conversation.name}</strong><span>{conversation.preview}</span></span><small className="subtle">{conversation.time}</small></button>)}</section>
      <section className="chat-panel"><div className="chat-header"><Avatar name={active.name} tone={active.tone} online={active.online} /><div style={{ flex: 1 }}><strong style={{ display: "block", fontSize: 12 }}>{active.name}</strong><span className="subtle" style={{ fontSize: 10 }}>{active.online ? "Online now" : "Last active recently"}</span></div><button className="icon-button" aria-label="Conversation options" onClick={() => toast("Conversation options are a backend-dependent feature.", "info")}><MoreHorizontal size={18} /></button></div><div className="chat-messages">{messages.map((message, index) => <div key={`${active.id}-${index}`} className={`chat-bubble ${index === messages.length - 1 && (localMessages[active.id] ?? []).includes(message) ? "own" : ""}`}>{message}</div>)}<span className="subtle" style={{ marginTop: "auto", fontSize: 10, textAlign: "center" }}>This is a local interaction preview — messages are not delivered.</span></div><form className="chat-composer" onSubmit={sendMessage}><input className="input" aria-label="Write a message" placeholder={`Message ${active.name.split(" ")[0]}…`} value={draft} onChange={(event) => setDraft(event.target.value)} /><Button type="submit" size="icon" aria-label="Send message" disabled={!draft.trim()}><Send size={16} /></Button></form></section>
    </div>
  </>;
}

function NotificationsWorkspace() {
  const [items, setItems] = useState(notificationsSeed);
  const { toast } = useToast();
  const unread = items.filter((item) => item.unread).length;
  return <>
    <WorkspaceHeader eyebrow="Stay in the loop" title="Activity" description="The meaningful little moments happening around you." action={<Button variant="secondary" leadingIcon={<CheckCheck size={15} />} onClick={() => { setItems((current) => current.map((item) => ({ ...item, unread: false }))); toast("All notifications marked as read."); }}>Mark all as read</Button>} />
    <div className="notification-summary-grid"><div className="card notification-summary"><span className="feature-icon"><Bell size={19} /></span><strong>{unread}</strong><span>Unread notifications</span></div><div className="card notification-summary"><span className="feature-icon" style={{ color: "var(--teal)", background: "var(--success-soft)" }}><Heart size={19} /></span><strong>{items.length}</strong><span>Recent activity</span></div><div className="card notification-summary"><span className="feature-icon" style={{ color: "var(--warning)", background: "var(--warning-soft)" }}><Users size={19} /></span><strong>2</strong><span>New connections</span></div></div>
    <div className="card notification-list"><div className="notification-list-head"><div><h3 className="section-title">Recent activity</h3><p className="section-subtitle">Notifications are sample data in this preview.</p></div><button className="button button-ghost button-sm" onClick={() => setItems((current) => [...current].reverse())}>Sort oldest first</button></div>{items.map((item) => { const Icon = item.icon; return <button className={`notification-row ${item.unread ? "unread" : ""}`} key={item.id} onClick={() => { setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, unread: false } : entry)); toast("Notification opened in preview mode.", "info"); }}><Avatar name={item.name} tone={item.tone} size="md" /><span className="notification-main"><span className="notification-copy"><strong>{item.name}</strong> {item.text}</span><span className="subtle" style={{ display: "block", marginTop: 4, fontSize: 10 }}>{item.time}</span></span><span className="notification-kind"><Icon size={16} /></span>{item.unread && <i className="notification-unread-dot" />}</button>; })}</div>
  </>;
}

function SavedWorkspace() {
  const [items, setItems] = useState(initialPosts.slice(0, 2));
  const { toast } = useToast();
  return <>
    <WorkspaceHeader eyebrow="Your personal library" title="Saved collection" description="Keep the ideas you want to return to, all in one place." action={<Button variant="secondary" leadingIcon={<SlidersHorizontal size={15} />} onClick={() => toast("Collection filters need persistent saved-post data.", "info")}>Filter collection</Button>} />
    <div className="saved-summary card card-pad"><div><span className="eyebrow">Saved for later</span><h3>{items.length} thoughtful finds</h3><p className="muted" style={{ margin: 0, fontSize: 11 }}>These examples are reset when you refresh the demo.</p></div><div className="saved-summary-icon"><Bookmark size={22} /></div></div>
    <div className="workspace-post-list" style={{ marginTop: 18 }}>{items.length ? items.map((post) => <div className="saved-post-wrap" key={post.id}><PostCard post={post} /><button className="saved-remove" onClick={() => { setItems((current) => current.filter((item) => item.id !== post.id)); toast("Removed from the local saved collection."); }}><Bookmark size={14} /> Remove from collection</button></div>) : <div className="card empty-state"><div className="empty-state-icon"><Bookmark size={22} /></div><h3>Your collection is all caught up</h3><p>Save a post from your feed to keep it here for later.</p><Link className="button button-primary button-sm" href="/">Back to your feed</Link></div>}</div>
  </>;
}

function GroupsWorkspace() {
  const [joined, setJoined] = useState<string[]>(["g2"]);
  const { toast } = useToast();
  return <>
    <WorkspaceHeader eyebrow="Belong to something" title="Communities" description="Find your people around the things you care about." action={<Button leadingIcon={<Plus size={15} />} onClick={() => toast("Creating a community needs the groups API and moderation rules.", "info")}>Create community</Button>} />
    <div className="group-feature-banner"><div className="group-banner-icon"><Users size={25} /></div><div><span className="eyebrow">Better together</span><h3>Good conversations start with a shared interest.</h3><p>Join a community to exchange feedback, make friends, and learn in public.</p></div><div className="group-banner-decoration"><Sparkles size={66} /></div></div>
    <div className="workspace-list-head"><div><h3 className="section-title">Communities to explore</h3><p className="section-subtitle">Curated example communities</p></div><div className="filter-row" style={{ margin: 0, padding: 0 }}><button className="filter-chip selected" onClick={() => toast("Showing every category.", "info")}>All</button><button className="filter-chip" onClick={() => toast("Category filtering will connect to the API.", "info")}>Design</button><button className="filter-chip" onClick={() => toast("Category filtering will connect to the API.", "info")}>Technology</button></div></div>
    <div className="groups-grid">{groupsSeed.map((group) => { const isJoined = joined.includes(group.id); return <article className="card group-card" key={group.id}><div className={`group-art group-art-${group.tone}`}><span className="group-art-pattern"><Sparkles size={31} /></span><span className="pill">{group.category}</span></div><div className="group-card-body"><div className="group-card-title"><Avatar name={group.name} tone={group.tone} size="md" /><div><h3>{group.name}</h3><p>{group.members}</p></div></div><p className="group-description">{group.description}</p><div className="group-card-footer"><span className="subtle" style={{ fontSize: 10 }}>Community · public</span><Button size="sm" variant={isJoined ? "secondary" : "primary"} onClick={() => { setJoined((current) => isJoined ? current.filter((id) => id !== group.id) : [...current, group.id]); toast(isJoined ? `You left ${group.name}.` : `You joined ${group.name}.`); }}>{isJoined ? <Check size={13} /> : <Plus size={13} />}{isJoined ? "Joined" : "Join group"}</Button></div></div></article>; })}</div>
  </>;
}

function ReelsWorkspace() {
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const { toast } = useToast();
  return <>
    <WorkspaceHeader eyebrow="A little inspiration, in motion" title="Reels" description="Short-form video browsing with native media controls. The sample video is public demo media." action={<Button variant="secondary" leadingIcon={<Film size={15} />} onClick={() => toast("Reel uploads need an authenticated media service.", "info")}>Create reel</Button>} />
    <div className="reel-workspace-grid"><div className="reel-stage reel-video-stage">
      <video key={index} className="reel-video" controls playsInline preload="metadata" muted={muted} poster={index % 2 === 0 ? "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=80" : "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80"} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}><source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />Your browser does not support the sample video.</video>
      <div className="reel-floating-top"><span className="pill" style={{ color: "white", background: "#111827b8" }}>Reel {index + 1} of 2</span><button className="reel-float-button" aria-label={muted ? "Unmute reel" : "Mute reel"} onClick={() => setMuted((value) => !value)}>{muted ? <VolumeX size={17} /> : <Volume2 size={17} />}</button></div>
      <div className="reel-floating-caption"><div style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar name={index === 0 ? "Maya Chen" : "Leo Park"} tone={index === 0 ? 1 : 0} /><div><strong>{index === 0 ? "Maya Chen" : "Leo Park"}</strong><span>@{index === 0 ? "mayacreates" : "leopark"}</span></div></div><p>{index === 0 ? "A few seconds of calm from the weekend 🌱" : "Little things that make a creative workspace feel right."} <b>#SmallMoments</b></p></div>
    </div><div className="reel-side-actions"><button className={`reel-action ${liked ? "active" : ""}`} onClick={() => setLiked((value) => !value)}><span><Heart size={20} fill={liked ? "currentColor" : "none"} /></span><strong>{liked ? "1.3k" : "1.2k"}</strong><small>Likes</small></button><button className="reel-action" onClick={() => toast("Comments panel is waiting for the reels API.", "info")}><span><MessageCircle size={20} /></span><strong>86</strong><small>Comments</small></button><button className="reel-action" onClick={() => toast("Share link copied in this preview.", "success")}><span><Send size={19} /></span><strong>Share</strong></button><button className="reel-action" onClick={() => toast("Reel saved locally for this preview.", "success")}><span><Bookmark size={19} /></span><strong>Save</strong></button><div className="reel-next-buttons"><Button variant="secondary" size="icon" aria-label="Previous reel" disabled={index === 0} onClick={() => { setIndex(0); setPlaying(false); }}><ArrowRight size={16} style={{ transform: "rotate(180deg)" }} /></Button><Button variant="secondary" size="icon" aria-label="Next reel" disabled={index === 1} onClick={() => { setIndex(1); setPlaying(false); }}><ArrowRight size={16} /></Button></div><small className="subtle">{playing ? "Playing" : "Paused"}</small></div></div>
    <div className="card reel-notice"><Video size={17} /><div><strong>Media integration point</strong><p>Swap the sample MP4 and poster images for authorized media URLs returned by your backend. Playback controls are native browser controls; comments, upload, and engagement persistence need API integration.</p></div></div>
  </>;
}

function ProfileWorkspace({ username }: { username: string }) {
  const [tab, setTab] = useState("Posts");
  const [following, setFollowing] = useState(false);
  const [ownPosts] = useState(initialPosts.filter((post) => post.username === username || username === "you").length ? initialPosts : initialPosts.slice(0, 2));
  const isOwner = username === "you" || username === "your-name";
  const profileName = isOwner ? "Your Name" : username.split(/[-_.]/g).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
  const { toast } = useToast();
  return <>
    <div className="card profile-hero"><div className="profile-cover" /><div className="profile-info-wrap"><div className="profile-avatar-wrap"><Avatar name={profileName} tone={isOwner ? 3 : 1} size="xl" /></div><div className="profile-description"><h2>{profileName}</h2><p>@{username} · Sharing bits of life, work, and wonder.</p><div className="profile-stats"><span><strong>128</strong> posts</span><span><strong>2.4k</strong> followers</span><span><strong>398</strong> following</span></div></div>{isOwner ? <Button variant="secondary" onClick={() => window.location.assign("/settings/profile")}><Settings2 size={14} /> Edit profile</Button> : <div style={{ display: "flex", gap: 8 }}><Button variant={following ? "secondary" : "primary"} onClick={() => { setFollowing((value) => !value); toast(following ? "Unfollowed profile." : "Follow added locally."); }}>{following ? <Check size={14} /> : <Plus size={14} />}{following ? "Following" : "Follow"}</Button><Button variant="secondary" onClick={() => window.location.assign("/messages")}><Mail size={14} /> Message</Button></div>}</div></div>
    <div className="profile-tab-row">{["Posts", "Reels", "Media", ...(isOwner ? ["Saved"] : [])].map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>)}</div>
    {tab === "Posts" ? <div className="workspace-post-list">{ownPosts.map((post) => <PostCard post={post} key={post.id} />)}</div> : tab === "Saved" ? <div className="card empty-state"><Bookmark size={25} /><h3>Your private collection</h3><p>Saved posts are visible only to you. Connect the saved-content API to show your collection here.</p><Link href="/saved" className="button button-secondary button-sm">Open saved collection</Link></div> : <div className="card empty-state"><div className="empty-state-icon">{tab === "Reels" ? <Film size={22} /> : <Image size={22} />}</div><h3>No {tab.toLowerCase()} to show yet</h3><p>When media is added to this profile, it will appear here.</p></div>}
  </>;
}

function SettingsWorkspace({ route }: { route: string }) {
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState("Your Name");
  const [bio, setBio] = useState("Curious mind. Making things slowly, with care.");
  const [email, setEmail] = useState("you@example.com");
  const [privateAccount, setPrivateAccount] = useState(false);
  const [activityStatus, setActivityStatus] = useState(true);
  const [mentions, setMentions] = useState(true);
  const current = route.split("/").filter(Boolean).at(-1) ?? "profile";
  const pageTitle = settingLinks.find((item) => item.href.endsWith(current))?.label ?? "Profile information";
  function toggle(setter: (value: boolean | ((previous: boolean) => boolean)) => void, value: boolean) { setter(!value); }
  return <>
    <WorkspaceHeader eyebrow="Your space, your way" title="Settings" description="Manage your profile, preferences, and how you show up on Pulse." />
    <div className="settings-layout"><nav className="card settings-nav" aria-label="Settings sections">{settingLinks.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={href.endsWith(current) ? "active" : ""}><Icon size={16} />{label}</Link>)}</nav>
      <section className="card settings-panel"><h3>{pageTitle}</h3><p>Changes in this prototype stay in local UI state and are not persisted to an account.</p>
        {current === "profile" && <form className="settings-form" onSubmit={(event) => { event.preventDefault(); toast("Profile updated in this preview."); }}><div className="profile-edit-row"><Avatar name={displayName} tone={3} size="xl" /><div><strong style={{ display: "block", fontSize: 12 }}>Profile photo</strong><span className="subtle" style={{ display: "block", margin: "3px 0 9px", fontSize: 10 }}>JPG or PNG · upload integration required</span><Button type="button" variant="secondary" size="sm" onClick={() => toast("Avatar upload needs a connected media service.", "info")}>Change photo</Button></div></div><div className="field"><label htmlFor="displayName">Display name</label><input id="displayName" className="input" value={displayName} onChange={(event) => setDisplayName(event.target.value)} required maxLength={60} /></div><div className="field"><label htmlFor="bio">Bio</label><textarea id="bio" className="textarea" value={bio} onChange={(event) => setBio(event.target.value)} maxLength={180} /><span className="subtle" style={{ fontSize: 10 }}>{bio.length}/180 characters</span></div><div className="settings-two-col"><div className="field"><label htmlFor="email">Email address</label><input id="email" className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div><div className="field"><label htmlFor="website">Website</label><input id="website" className="input" id="website" placeholder="https://yourwebsite.com" /></div></div><Button type="submit">Save profile changes</Button></form>}
        {current === "account" && <div>{[{ title: "Email address", detail: email, action: "Change" }, { title: "Password", detail: "Last updated — not connected", action: "Update" }, { title: "Connected accounts", detail: "No external accounts connected", action: "Manage" }].map((item) => <div className="setting-row" key={item.title}><div><strong>{item.title}</strong><p>{item.detail}</p></div><Button variant="secondary" size="sm" onClick={() => toast(`${item.title}: connect the account API to enable this action.`, "info")}>{item.action}</Button></div>)}<div className="setting-row"><div><strong>Sign out everywhere</strong><p>End sessions on other devices after backend integration.</p></div><Button variant="danger" size="sm" onClick={() => toast("Session revocation needs a backend endpoint.", "info")}>Revoke sessions</Button></div></div>}
        {current === "privacy" && <div>{[{ title: "Private account", detail: "Only approved followers can see your posts.", value: privateAccount, set: setPrivateAccount }, { title: "Show activity status", detail: "Let connections know when you are active.", value: activityStatus, set: setActivityStatus }, { title: "Review mentions", detail: "Choose what can appear on your profile.", value: mentions, set: setMentions }].map((item) => <div className="setting-row" key={item.title}><div><strong>{item.title}</strong><p>{item.detail}</p></div><button className="switch" role="switch" aria-checked={item.value} aria-label={item.title} onClick={() => toggle(item.set, item.value)} /></div>)}<div className="settings-save-row"><Button onClick={() => toast("Privacy preferences updated in local UI state.")}>Save privacy settings</Button></div></div>}
        {current === "appearance" && <div><div className="appearance-preview"><div className="appearance-preview-sidebar"><span /><span /><span /></div><div className="appearance-preview-main"><div className="appearance-preview-top" /><div className="appearance-preview-post"><i /><span /><span /></div><div className="appearance-preview-post short"><i /><span /></div></div></div><div className="setting-row"><div><strong>Color theme</strong><p>Choose light, dark, or follow your operating system.</p></div><ThemeToggle /></div><div className="setting-row"><div><strong>Motion preferences</strong><p>Pulse respects your operating system’s reduced-motion preference.</p></div><span className="pill pill-success">System aware</span></div><div className="settings-save-row"><Button variant="secondary" onClick={() => toast("Theme preference is managed by the theme switcher.", "info")}>About appearance</Button></div></div>}
      </section>
    </div>
  </>;
}

export function ClientWorkspace() {
  const pathname = usePathname();
  if (pathname.startsWith("/explore")) return <ExploreWorkspace />;
  if (pathname.startsWith("/search")) return <ExploreWorkspace searchPage />;
  if (pathname.startsWith("/reels")) return <ReelsWorkspace />;
  if (pathname.startsWith("/messages")) return <MessagesWorkspace />;
  if (pathname.startsWith("/notifications")) return <NotificationsWorkspace />;
  if (pathname.startsWith("/saved")) return <SavedWorkspace />;
  if (pathname.startsWith("/groups")) return <GroupsWorkspace />;
  if (pathname.startsWith("/settings")) return <SettingsWorkspace route={pathname} />;
  if (pathname.startsWith("/u/")) return <ProfileWorkspace username={decodeURIComponent(pathname.split("/")[2] ?? "you")} />;
  if (pathname.startsWith("/post/")) {
    const id = pathname.split("/")[2];
    const post = initialPosts.find((item) => item.id === id) ?? initialPosts[0];
    return <><WorkspaceHeader eyebrow="From your community" title="Post details" description="Read the full post and join the conversation." /><div className="workspace-post-list"><PostCard post={post} /></div><Button variant="ghost" onClick={() => window.history.back()}>Back to previous page</Button></>;
  }
  return <ExploreWorkspace />;
}
