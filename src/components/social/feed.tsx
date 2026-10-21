"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, Check, ChevronLeft, ChevronRight, ImagePlus, MapPin, Plus, Sparkles, Video, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/social/post-card";
import { useToast } from "@/components/providers/toast-provider";
import { initialPosts, stories, suggestions, trendingTopics } from "@/lib/mocks/social-data";
import type { SocialPost } from "@/lib/types/social";

export function SocialFeed() {
  const [posts, setPosts] = useState<SocialPost[]>(initialPosts);
  const [draft, setDraft] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<number | null>(null);
  const [followed, setFollowed] = useState<string[]>([]);
  const [feedFilter, setFeedFilter] = useState<"For you" | "Following">("For you");
  const { toast } = useToast();
  const shownPosts = useMemo(() => feedFilter === "Following" ? posts.filter((post) => post.username === "you" || followed.includes(post.username)) : posts, [feedFilter, posts, followed]);

  function publishPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const post: SocialPost = {
      id: `local-${Date.now()}`, author: "You", username: "you", initialsTone: 3, time: "just now", text,
      likes: 0, comments: [], tag: "Your update",
    };
    setPosts((current) => [post, ...current]);
    setDraft("");
    setComposerOpen(false);
    toast("Your post was added to this local preview.");
  }

  function toggleFollow(username: string) {
    setFollowed((current) => current.includes(username) ? current.filter((name) => name !== username) : [...current, username]);
    toast(followed.includes(username) ? `Unfollowed @${username}.` : `You’re now following @${username}.`);
  }

  function changeStory(direction: number) {
    setSelectedStory((current) => {
      if (current === null) return 0;
      const next = current + direction;
      if (next < 0 || next >= stories.length) return current;
      return next;
    });
  }

  return <>
    <div className="home-welcome">
      <div><div className="eyebrow">Wednesday, October 21</div><h2>A little space for <span style={{ color: "var(--brand)" }}>you.</span></h2><p>Catch up with your people and see what’s moving them today.</p></div>
      <div className="welcome-spark"><Sparkles size={24} /></div>
    </div>
    <div className="feed-layout">
      <section className="feed-column" aria-label="Social feed">
        <div className="card stories-card">
          <div className="section-head"><div><h3 className="section-title">Stories</h3><p className="section-subtitle">Tiny moments from your circle</p></div><button className="button button-ghost button-sm" onClick={() => setSelectedStory(1)}>View all <ArrowRight size={13} /></button></div>
          <div className="stories-track">
            {stories.map((story, index) => <button className="story-button" key={story.id} aria-label={story.label} onClick={() => setSelectedStory(index)}>
              <span className={`story-ring ${story.seen ? "seen" : ""}`}><span className="story-ring-inner">{story.own ? <span className="story-plus"><Plus size={22} /></span> : <Avatar name={story.name} size="lg" tone={story.tone} />}</span></span>
              <span className="story-name">{story.own ? "Your story" : story.name.split(" ")[0]}</span>
            </button>)}
          </div>
        </div>

        <div className="card composer-card">
          <div className="composer-top"><Avatar name="Your Name" tone={3} size="md" /><button className="composer-input" onClick={() => setComposerOpen((value) => !value)}>What’s on your mind today?</button></div>
          {composerOpen && <form onSubmit={publishPost} className="composer-expanded">
            <textarea className="textarea" autoFocus aria-label="Your post" placeholder="Share an idea, a win, or a little moment…" value={draft} onChange={(event) => setDraft(event.target.value)} />
            <div className="composer-expanded-footer"><span className="subtle" style={{ fontSize: 10 }}>This is saved to the local demo only.</span><div style={{ display: "flex", gap: 7 }}><Button type="button" variant="ghost" size="sm" onClick={() => { setComposerOpen(false); setDraft(""); }}>Cancel</Button><Button type="submit" size="sm" disabled={!draft.trim()}>Publish post</Button></div></div>
          </form>}
          <div className="composer-footer">
            <div className="composer-tools">
              <button className="composer-tool" onClick={() => { setComposerOpen(true); toast("Media upload needs a connected upload service.", "info"); }}><ImagePlus size={17} color="#39a98b" /><span>Photo</span></button>
              <button className="composer-tool" onClick={() => { setComposerOpen(true); toast("Video upload needs a connected upload service.", "info"); }}><Video size={17} color="#a477ec" /><span>Video</span></button>
              <button className="composer-tool" onClick={() => { setComposerOpen(true); toast("Location tagging will be available when connected to the API.", "info"); }}><MapPin size={16} color="#e39b50" /><span>Location</span></button>
            </div>
            <Button size="sm" onClick={() => setComposerOpen((value) => !value)}>{composerOpen ? <X size={14} /> : <Plus size={14} />}{composerOpen ? "Close" : "Create post"}</Button>
          </div>
        </div>

        <div className="feed-filter-row"><div><h3 className="section-title">Your feed</h3><p className="section-subtitle">Conversations worth your time</p></div><div className="segmented-control" role="group" aria-label="Feed filter">{(["For you", "Following"] as const).map((filter) => <button key={filter} className={feedFilter === filter ? "selected" : ""} onClick={() => setFeedFilter(filter)}>{filter}</button>)}</div></div>
        {shownPosts.length ? shownPosts.map((post) => <PostCard key={post.id} post={post} />) : <div className="card empty-state"><div className="empty-state-icon"><Check size={22} /></div><h3>Your circle is quiet for now</h3><p>Follow a few people to make your feed feel more like you.</p><Button size="sm" onClick={() => setFeedFilter("For you")}>Explore all posts</Button></div>}
      </section>

      <aside className="feed-side-column" aria-label="Discovery sidebar">
        <section className="card mini-card">
          <div className="section-head"><div><h3 className="section-title">People to know</h3><p className="section-subtitle">Good people, good ideas</p></div><button className="icon-button" aria-label="Refresh suggestions" onClick={() => toast("Suggestions refreshed in this demo.", "info")}><ArrowRight size={16} /></button></div>
          {suggestions.map((person) => { const isFollowing = followed.includes(person.username); return <div className="suggestion-row" key={person.username}><Avatar name={person.name} tone={person.tone} size="md" /><div className="suggestion-info"><strong>{person.name}</strong><span>{person.detail}</span></div><button className={`follow-small ${isFollowing ? "following" : ""}`} onClick={() => toggleFollow(person.username)}>{isFollowing ? "Following" : "Follow"}</button></div>; })}
          <button className="button button-ghost button-sm" style={{ width: "100%", marginTop: 11 }} onClick={() => toast("Creator discovery is using local sample data.", "info")}>Discover more <ArrowRight size={13} /></button>
        </section>
        <section className="card mini-card">
          <div className="section-head"><div><h3 className="section-title">Topics in motion</h3><p className="section-subtitle">What your community is talking about</p></div></div>
          {trendingTopics.map((topic, index) => <button className="topic-row" key={topic.tag} style={{ width: "100%", border: 0, borderBottom: index < trendingTopics.length - 1 ? "1px solid var(--line)" : 0, background: "transparent", textAlign: "left", cursor: "pointer" }} onClick={() => toast(`Showing posts tagged #${topic.tag} in a future API integration.`, "info")}><span><strong>#{topic.tag}</strong><span>{topic.posts}</span></span><ArrowRight className="topic-arrow" size={14} /></button>)}
        </section>
        <section className="sidebar-promo" style={{ padding: 18 }}><span className="eyebrow">A kinder internet</span><strong style={{ fontSize: 15 }}>Make room for good things.</strong><p>Follow ideas, not algorithms. Keep your feed intentional.</p><Button variant="secondary" size="sm" onClick={() => toast("Community guidelines opened in demo mode.", "info")}>Our community values <ArrowRight size={13} /></Button></section>
        <div className="subtle" style={{ padding: "0 4px", fontSize: 10 }}>About · Guidelines · Privacy · Terms<br />© 2026 Pulse Social</div>
      </aside>
    </div>

    {selectedStory !== null && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedStory(null); }}>
      <div className="story-viewer" role="dialog" aria-modal="true" aria-label={stories[selectedStory]?.label ?? "Story"}>
        <div className="story-progress"><span /></div>
        <div className="story-viewer-header"><div style={{ display: "flex", alignItems: "center", gap: 9 }}><Avatar name={stories[selectedStory]?.name ?? "Story"} tone={stories[selectedStory]?.tone ?? 0} /><div><strong>{stories[selectedStory]?.name}</strong><span>Shared a moment · demo</span></div></div><button className="icon-button" aria-label="Close story" onClick={() => setSelectedStory(null)}><X size={19} /></button></div>
        <div className="story-viewer-art"><Sparkles size={38} /><h3>{stories[selectedStory]?.own ? "Your story starts here." : "Small moments, shared with your circle."}</h3><p>Story viewing is interactive in this prototype. Timed playback and story uploads require API/media integration.</p></div>
        <button className="story-nav story-prev" aria-label="Previous story" disabled={selectedStory === 0} onClick={() => changeStory(-1)}><ChevronLeft size={19} /></button><button className="story-nav story-next" aria-label="Next story" disabled={selectedStory === stories.length - 1} onClick={() => changeStory(1)}><ChevronRight size={19} /></button>
      </div>
    </div>}
  </>;
}
