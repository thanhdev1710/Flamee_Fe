"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type React from "react";

import {
  MoreHorizontal,
  Heart,
  MessageSquare,
  FileText,
  Hash,
  Share2,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useState, memo } from "react";
import { FilesModal } from "@/components/shared/FilesModal";
import { PostImageGrid } from "./PostImageGrid";
import { Post } from "@/types/post.type"; // Đảm bảo Post có: images, videos, files, shares,...

const PostCard = memo(function PostCard({
  id,
  title,
  body,
  userId,
  userName,
  userAvatar,
  tags = [],
  files = [],
  videos = [],
  images = [],
  shares = 0,
  likes = 0,
  comments = 0,
  createdAt,
  hideStats,
}: Post) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [imageLoadStates, setImageLoadStates] = useState<
    Record<string, boolean>
  >({});

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((prev) => {
      const next = !prev;
      setLikeCount((curr) => (next ? curr + 1 : curr - 1));
      // TODO: gọi API like/unlike ở đây
      return next;
    });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/app/feeds/${id}`);
  };

  const handleImageLoad = (imageId: string) => {
    setImageLoadStates((prev) => ({ ...prev, [imageId]: true }));
  };

  const hasAnyMedia =
    images.length > 0 || videos.length > 0 || files.length > 0;

  return (
    <>
      <Card className="h-full py-3! cursor-pointer" onClick={handleCardClick}>
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
                <AvatarFallback>
                  {userName?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">
                  {userName || `User #${userId}`}
                </div>
                {createdAt && (
                  <div className="text-sm text-muted-foreground">
                    {createdAt}
                  </div>
                )}
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
          {images.length > 0 && (
            <div className="mb-3">
              <PostImageGrid
                images={images}
                imageLoadStates={imageLoadStates}
                onImageLoad={handleImageLoad}
                onImageClick={handleCardClick}
                onShowAllFiles={() => setShowMediaModal(true)}
                aspectRatio="3/2"
              />
            </div>
          )}

          {/* Videos Preview */}
          {videos.length > 0 && (
            <div className="mb-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMediaModal(true);
                }}
              >
                <Play className="w-4 h-4" />
                {videos.length} video{videos.length > 1 ? "s" : ""} đính kèm
              </Button>
            </div>
          )}

          {/* Files Preview */}
          {files.length > 0 && (
            <div className="mb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMediaModal(true);
                }}
                className="w-full text-left justify-start gap-2"
              >
                <FileText className="w-4 h-4" />
                {files.length} file{files.length > 1 ? "s" : ""} đính kèm
              </Button>
            </div>
          )}

          {/* Content */}
          {(title || body) && (
            <div className="mb-4 flex-1">
              {title && (
                <p className="font-semibold text-sm line-clamp-1 mb-1">
                  {title}
                </p>
              )}
              {body && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {body}
                </p>
              )}
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs px-2 py-0.5 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Điều hướng search hashtag nếu muốn
                    // router.push(`/app/search?tag=${encodeURIComponent(tag)}`);
                  }}
                >
                  <Hash className="w-2.5 h-2.5 mr-1" />
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0.5 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  +{tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-6 text-muted-foreground">
            {/* Like */}
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

            {/* Comment */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/app/feeds/${id}#comments`);
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

            {/* Shares */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                // TODO: mở modal share / gọi API share
              }}
              variant="ghost"
              size="sm"
              className="gap-2 p-0 h-auto"
            >
              <Share2 className="h-5 w-5" />
              {!hideStats && (
                <span className="font-medium">{shares.toLocaleString()}</span>
              )}
            </Button>
          </div>

          {/* Nếu muốn có nút xem toàn bộ media khi có bất kỳ media */}
          {hasAnyMedia && (
            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground px-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMediaModal(true);
                }}
              >
                Xem tất cả media & files
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Media + Files Modal */}
      {showMediaModal && (
        <FilesModal
          images={images}
          videos={videos}
          files={files}
          onClose={() => setShowMediaModal(false)}
          postTitle={title || ""}
        />
      )}
    </>
  );
});

export default PostCard;
