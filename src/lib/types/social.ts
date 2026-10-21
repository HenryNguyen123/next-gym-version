export type ReactionType = "like" | "love" | "laugh" | "wow" | "sad" | "angry";

export type SocialComment = {
  id: string;
  author: string;
  username: string;
  text: string;
  time: string;
};

export type SocialPost = {
  id: string;
  author: string;
  username: string;
  initialsTone: number;
  time: string;
  text: string;
  image?: string;
  tag?: string;
  likes: number;
  comments: SocialComment[];
  reaction?: ReactionType;
  saved?: boolean;
};
