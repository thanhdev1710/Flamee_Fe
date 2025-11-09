import { FileItem } from "@/utils/fileHelpers";

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  userName: string;
  userAvatar?: string;
  tags?: string[];
  files?: FileItem[];
  images?: FileItem[];
  videos?: FileItem[];
  likes?: number;
  comments?: number;
  shares?: number;
  createdAt?: string;
  hideStats?: boolean;
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
