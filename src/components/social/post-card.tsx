"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Bookmark, Check, ChevronDown, MessageCircle, MoreHorizontal, Send, Share2, ThumbsUp } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/toast-provider";
import type { ReactionType, SocialPost } from "@/lib/types/social";

const reactionOptions: { type: ReactionType; emoji: string; label: string }[] = [
  { type: "like", emoji: "👍", label: "Like" },
  { type: "love", emoji: "❤️", label: "Love" },
  { type: "laugh", emoji: "😂", label: "Laugh" },
  { type: "wow", emoji: "😮", label: "Wow" },
  { type: "sad", emoji: "😢", label: "Sad" },
  { type: "angry", emoji: "😡", label: "Angry" },
];

type Props = { post: SocialPost };

export function PostCard({ post }: Props) {
  const [reaction, setReaction] = useState<ReactionType | undefined>(post.reaction);
  const [saved, setSaved] = useState(Boolean(post.saved));
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments);
  const { toast } = useToast();
  const selectedReaction = reactionOptions.find((item) => item.type === reaction);

  function toggleSaved() {
    const next = !saved;
    setSaved(next);
    toast(next ? "Post saved to your collection." : "Removed from saved posts.", "success");
  }

  async function sharePost() {
    const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/post/${post.id}` : "";
    try {
      if (navigator.share) await navigator.share({ title: `Post by ${post.author}`, text: post.text, url: shareUrl });
      else if (navigator.clipboard && shareUrl) {
        await navigator.clipboard.writeText(shareUrl);
        toast("Link copied. Ready to share!");
      } else toast("Sharing is a demo action in this preview.", "info");
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") toast("Could not share this post.", "error");
    }
  }

  function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = commentText.trim();
    if (!value) return;
    setComments((current) => [...current, { id: `${post.id}-${Date.now()}`, author: "You", username: "you", text: value, time: "now" }]);
    setCommentText("");
    toast("Comment added locally.", "success");
  }

  return (
    <article className="card post-card" aria-label={`Post by ${post.author}`}>
      <div className="post-header">
        <Avatar name={post.author} tone={post.initialsTone} size="md" />
        <div className="post-author">
          <div><strong>{post.author}</strong><span className="post-username">@{post.username}</span></div>
          <div className="post-meta"><span>{post.time}</span><span>·</span><span>Everyone</span></div>
        </div>
        <div style={{ position: "relative" }}>
          <button className="icon-button" aria-label="Post options" aria-expanded={showMenu} onClick={() => setShowMenu((value) => !value)}><MoreHorizontal size={19} /></button>
          {showMenu && <div className="floating-menu">
            <button onClick={() => { setShowMenu(false); toast("Post link copied to your clipboard when sharing is supported.", "info"); }}>Copy post link</button>
            <button onClick={() => { setShowMenu(false); toast("This post has been added to your review queue (demo).", "info"); }}>Report post</button>
            <button onClick={() => { setShowMenu(false); toast("Post hidden from this local preview.", "success"); }}>Hide post</button>
          </div>}
        </div>
      </div>
      <p className="post-copy">{post.text}</p>
      {post.tag && <div className="post-tag">#{post.tag.replace(/^#/, "")}</div>}
      {post.image && <img className="post-image" src={post.image} alt={`Media attached to ${post.author}'s post`} loading="lazy" />}
      <div className="post-statline">
        <span className="reaction-stack"><span className="reaction-icons"><i className="reaction-dot">👍</i><i className="reaction-dot">❤️</i><i className="reaction-dot">✨</i></span>{post.likes + (reaction ? 1 : 0)} reactions</span>
        <button className="button button-ghost button-sm" onClick={() => setCommentsOpen((value) => !value)}>{comments.length} comments</button>
      </div>
      <div className="post-actions">
        <div className="reaction-action-wrap">
          <button className={`post-action ${reaction ? "active" : ""}`} aria-expanded={showReactions} onClick={() => setShowReactions((value) => !value)}>
            {selectedReaction ? <span>{selectedReaction.emoji}</span> : <ThumbsUp size={16} />}<span>{selectedReaction?.label ?? "Like"}</span><ChevronDown size={12} />
          </button>
          {showReactions && <div className="reaction-picker" role="group" aria-label="Choose a reaction">
            {reactionOptions.map((option) => <button key={option.type} title={option.label} aria-label={option.label} onClick={() => { setReaction(reaction === option.type ? undefined : option.type); setShowReactions(false); }}>{option.emoji}</button>)}
          </div>}
        </div>
        <button className={`post-action ${commentsOpen ? "active" : ""}`} onClick={() => setCommentsOpen((value) => !value)}><MessageCircle size={16} /><span>Comment</span></button>
        <button className="post-action" onClick={sharePost}><Share2 size={15} /><span>Share</span></button>
        <button className={`post-action ${saved ? "active" : ""}`} onClick={toggleSaved}>{saved ? <Check size={16} /> : <Bookmark size={16} />}<span>{saved ? "Saved" : "Save"}</span></button>
      </div>
      {commentsOpen && <div className="comment-list">
        {comments.length === 0 ? <p className="muted" style={{ margin: 0, fontSize: 11 }}>Be the first to join the conversation.</p> : comments.map((comment, index) => <div className="comment-row" key={comment.id}>
          <Avatar name={comment.author} tone={index + 2} size="sm" />
          <div className="comment-bubble"><strong>{comment.author}</strong><span className="subtle" style={{ fontSize: 9 }}>{comment.time}</span><p>{comment.text}</p></div>
        </div>)}
        <form className="comment-form" onSubmit={submitComment}>
          <Avatar name="You" tone={3} size="sm" />
          <input className="input" aria-label="Write a comment" placeholder="Write a thoughtful reply…" value={commentText} onChange={(event) => setCommentText(event.target.value)} />
          <Button type="submit" size="icon" aria-label="Send comment" disabled={!commentText.trim()}><Send size={15} /></Button>
        </form>
      </div>}
    </article>
  );
}
