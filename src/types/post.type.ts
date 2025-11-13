import { FileItem } from "@/utils/fileHelpers";

export interface Post {
  id: string;

  title: string;
  content: string;
  hashtags: string[];

  author_id: string;
  author_username: string;
  author_avatar: string;

  images: FileItem[];
  videos: FileItem[];
  files: FileItem[];

  like_count: number;
  comment_count: number;
  share_count: number;

  created_at: string;
  updated_at: string;
  visibility: "public" | "friends" | "private";

  isLiked: boolean;
  isShared: boolean;

  score: number;
  highlight: Record<string, string[]>;
}

export type VisibilityEnum = "public" | "private" | "friends";
export type CensorEnum = "approved" | "pending" | "rejected" | "under_review";
export type MediaTypeEnum = "image" | "video" | "file";
export type PostTypeEnum = "post" | "reel" | "story";

export type Media = { mediaUrl: string; mediaType: MediaTypeEnum };

export interface CreatePost {
  title?: string;
  content?: string;
  visibility?: VisibilityEnum;
  hashtags?: string[];
  tagged_friends?: string[];
  mediaUrls?: Media[];
  postType: PostTypeEnum;
  expired_at?: Date;
}
