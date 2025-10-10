import { FileItem } from "@/utils/fileHelpers";

export interface PostCardProps {
  id: number;
  title: string;
  body: string;
  userId: number;
  userName?: string;
  userAvatar?: string;
  tags?: string[];
  files?: FileItem[];
  images?: FileItem[];
  likes?: number;
  comments?: number;
  createdAt?: string;
  hideStats?: boolean;
}
