import type { SocialPost } from "@/lib/types/social";

export const stories = [
  { id: "story-1", name: "Your story", tone: 3, own: true, seen: false, label: "Add to your story" },
  { id: "story-2", name: "Maya Chen", tone: 1, seen: false, label: "Maya's story" },
  { id: "story-3", name: "Oliver Reed", tone: 2, seen: false, label: "Oliver's story" },
  { id: "story-4", name: "Aisha Bello", tone: 4, seen: true, label: "Aisha's story" },
  { id: "story-5", name: "Leo Park", tone: 0, seen: false, label: "Leo's story" },
  { id: "story-6", name: "Sofia Martinez", tone: 5, seen: true, label: "Sofia's story" },
];

export const initialPosts: SocialPost[] = [
  {
    id: "post-1", author: "Maya Chen", username: "mayacreates", initialsTone: 1, time: "18 min ago",
    text: "A little reminder to make things that feel like you. Not everything needs to be optimized, measured, or shared. Sometimes the process is the whole point. 🌱",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=85",
    tag: "Slow living", likes: 248,
    comments: [
      { id: "c1", author: "Noah Williams", username: "noahw", text: "Needed this today. Thank you for the reminder.", time: "12 min" },
      { id: "c2", author: "Aisha Bello", username: "aishab", text: "Making space for this mindset this week ✨", time: "8 min" },
    ],
  },
  {
    id: "post-2", author: "Oliver Reed", username: "oliverbuilds", initialsTone: 2, time: "52 min ago",
    text: "Shipped the smallest version of an idea I’ve been carrying around for months. It’s not perfect, but it exists now — and that feels pretty great. What are you building this week?",
    tag: "Build in public", likes: 96,
    comments: [{ id: "c3", author: "Sofia Martinez", username: "sofiam", text: "Congrats! Shipping is a superpower.", time: "31 min" }],
  },
  {
    id: "post-3", author: "Aisha Bello", username: "aishab", initialsTone: 4, time: "2 hours ago",
    text: "Sunday color study. Collected these on a walk through the city and turned them into a tiny palette. Inspiration is usually closer than we think.",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=85",
    tag: "Design notes", likes: 174, comments: [],
  },
];

export const suggestions = [
  { name: "Noah Williams", username: "noahw", tone: 3, detail: "Product designer" },
  { name: "Sofia Martinez", username: "sofiam", tone: 5, detail: "Photographer & maker" },
  { name: "Leo Park", username: "leopark", tone: 0, detail: "Creative developer" },
];

export const trendingTopics = [
  { tag: "BuildInPublic", posts: "2.4k posts" },
  { tag: "DesignSystems", posts: "1.8k posts" },
  { tag: "SlowLiving", posts: "986 posts" },
];
