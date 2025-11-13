"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type React from "react";

import {
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
import { Post } from "@/types/post.type";
import { SWRInfiniteKeyedMutator } from "swr/infinite";
import { likeOrDislikePostById } from "@/actions/post.action";
import { toast } from "sonner";

const PostCard = memo(function PostCard({
  post,
  mutatePost,
}: {
  post: Post;
  mutatePost: SWRInfiniteKeyedMutator<Post[][]>;
}) {
  const router = useRouter();
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [imageLoadStates, setImageLoadStates] = useState<
    Record<string, boolean>
  >({});

  const {
    author_avatar,
    author_id,
    author_username,
    comment_count,
    content,
    created_at,
    files,
    hashtags,
    id,
    images,
    isLiked,
    isShared,
    like_count,
    share_count,
    title,
    videos,
  } = post;

  const handleLike = async () => {
    const err = await likeOrDislikePostById(id);
    if (!err) {
      await mutatePost();
      toast.success("Thành công", { richColors: true });
    } else {
      toast.error("Đã xảy ra lỗi", { richColors: true });
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/app/feeds/${id}`);
  };

  const handleImageLoad = (imageId: string) => {
    setImageLoadStates((prev) => ({ ...prev, [imageId]: true }));
  };

  if (!post) {
    return null;
  }

  const hasAnyMedia =
    images.length > 0 || videos.length > 0 || files.length > 0;

  return (
    <>
      <Card className="h-full py-3!">
        <CardContent
          onClick={handleCardClick}
          className="h-full flex flex-col max-sm:px-3 p-6 cursor-pointer"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={
                    author_avatar ||
                    `https://i.pravatar.cc/150?u=user-${author_id}`
                  }
                  alt={author_username || `User ${author_id}`}
                />
                <AvatarFallback>
                  {author_username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">
                  {author_username || `User #${author_id}`}
                </div>
                {created_at && (
                  <div className="text-sm text-muted-foreground">
                    {created_at}
                  </div>
                )}
              </div>
            </div>
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
          {(title || content) && (
            <div className="mb-4 flex-1">
              {title && (
                <p className="font-semibold text-sm line-clamp-1 mb-1">
                  {title}
                </p>
              )}
              {content && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {content}
                </p>
              )}
            </div>
          )}

          {/* Tags */}
          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {hashtags.slice(0, 3).map((tag) => (
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
              {hashtags.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0.5 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  +{hashtags.length - 3} more
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
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              <span className="font-medium">{like_count.toLocaleString()}</span>
            </Button>

            {/* Comment */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/app/feeds/${id}#comments`);
              }}
              variant="ghost"
              size="sm"
              className="gap-2 p-0 h-auto cursor-pointer"
            >
              <MessageSquare className="h-5 w-5" />

              <span className="font-medium">
                {comment_count.toLocaleString()}
              </span>
            </Button>

            {/* Shares */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
              }}
              variant="ghost"
              size="sm"
              className={`gap-2 p-0 h-auto cursor-pointer ${
                isShared ? "text-red-500" : ""
              }`}
            >
              <Share2 className={`h-5 w-5 ${isShared ? "fill-current" : ""}`} />

              <span className="font-medium">
                {share_count.toLocaleString()}
              </span>
            </Button>
          </div>

          {/* Nếu muốn có nút xem toàn bộ media khi có bất kỳ media */}
          {hasAnyMedia && (
            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground px-0 cursor-pointer"
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
