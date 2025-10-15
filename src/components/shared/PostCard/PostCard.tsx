"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type React from "react";

import {
  MoreHorizontal,
  Heart,
  MessageSquare,
  FileText,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useState, memo } from "react";
import { FilesModal } from "@/components/shared/FilesModal";
import { PostImageGrid } from "./PostImageGrid";
import { PostCardProps } from "@/types/PostCard";

const PostCard = memo(function PostCard({
  id,
  title,
  body,
  userId,
  userName,
  userAvatar,
  tags = [],
  files = [],
  images = [],
  likes = 1498,
  comments = 3000,
  createdAt = "15 mins ago",
  hideStats = false,
}: PostCardProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [showAllFiles, setShowAllFiles] = useState(false);
  const [imageLoadStates, setImageLoadStates] = useState<
    Record<string, boolean>
  >({});

  // Mock data for demo - replace with real data
  const mockImages =
    images.length > 0
      ? images
      : [
          {
            id: "1",
            name: "image1.jpg",
            type: "image/jpeg",
            url: `https://picsum.photos/seed/${id}/600/400`,
          },
          {
            id: "2",
            name: "image2.jpg",
            type: "image/jpeg",
            url: `https://picsum.photos/seed/${id + 1}/600/400`,
          },
          {
            id: "3",
            name: "image3.jpg",
            type: "image/jpeg",
            url: `https://picsum.photos/seed/${id + 2}/600/400`,
          },
          {
            id: "4",
            name: "image4.jpg",
            type: "image/jpeg",
            url: `https://picsum.photos/seed/${id + 3}/600/400`,
          },
        ];

  const mockFiles =
    files.length > 0
      ? files
      : [
          {
            id: "f1",
            name: "document.pdf",
            type: "application/pdf",
            url: "#",
            size: 2048000,
          },
          {
            id: "f2",
            name: "presentation.pptx",
            type: "application/vnd.ms-powerpoint",
            url: "#",
            size: 5120000,
          },
        ];

  const mockTags =
    tags.length > 0
      ? tags
      : ["technology", "design", "inspiration", "creative", "innovation"];

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening lightbox if it's an image click
    router.push(`/app/feeds/${id}`);
  };

  const handleImageLoad = (imageId: string) => {
    setImageLoadStates((prev) => ({ ...prev, [imageId]: true }));
  };

  return (
    <>
      <Card className="h-full py-3!">
        <CardContent className="h-full flex flex-col max-sm:px-3 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={
                    userAvatar || `https://i.pravatar.cc/150?u=user-${userId}`
                  }
                  alt={userName || `User ${userId}`}
                />
                <AvatarFallback>U{userId}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">
                  {userName || `User #${userId}`}
                </div>
                <div className="text-sm text-muted-foreground">{createdAt}</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>

          {/* Images Grid */}
          <PostImageGrid
            images={mockImages}
            imageLoadStates={imageLoadStates}
            onImageLoad={handleImageLoad}
            onImageClick={handleCardClick} // Clicks on images navigate to detail page
            onShowAllFiles={() => setShowAllFiles(true)}
            aspectRatio="3/2"
          />

          {/* Content */}
          <div className="mb-4 flex-1">
            <p className="text-sm leading-relaxed">
              <span className="font-semibold line-clamp-1">{title}</span>
              <span className="text-muted-foreground line-clamp-2">{body}</span>
            </p>
          </div>

          {/* Tags */}
          {mockTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {mockTags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs px-2 py-0.5 cursor-pointer"
                >
                  <Hash className="w-2.5 h-2.5 mr-1" />
                  {tag}
                </Badge>
              ))}
              {mockTags.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0.5 cursor-pointer"
                >
                  +{mockTags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Other Files Preview */}
          {mockFiles.length > 0 && (
            <div className="mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllFiles(true);
                }}
                className="w-full text-left justify-start"
              >
                <FileText className="w-4 h-4 mr-2" />
                {mockFiles.length} file{mockFiles.length > 1 ? "s" : ""}{" "}
                attached
              </Button>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-6 text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 p-0 h-auto ${isLiked ? "text-red-500" : ""}`}
              onClick={handleLike}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              {!hideStats && (
                <span className="font-medium">
                  {likeCount.toLocaleString()}
                </span>
              )}
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/app/feeds/${id}`);
              }}
              variant="ghost"
              size="sm"
              className="gap-2 p-0 h-auto"
            >
              <MessageSquare className="h-5 w-5" />
              {!hideStats && (
                <span className="font-medium">{comments.toLocaleString()}</span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Files Modal */}
      {showAllFiles && (
        <FilesModal
          images={mockImages}
          files={mockFiles}
          onClose={() => setShowAllFiles(false)}
          postTitle={title}
        />
      )}
    </>
  );
});

export default PostCard;
