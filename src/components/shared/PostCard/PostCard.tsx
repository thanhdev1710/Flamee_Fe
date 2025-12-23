"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import parse from "html-react-parser";

import {
  Heart,
  MessageSquare,
  FileText,
  Hash,
  Share2,
  Play,
  Loader2,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FilesModal } from "@/components/shared/FilesModal";
import { PostImageGrid } from "./PostImageGrid";
import type { Post } from "@/types/post.type";
import {
  deletePost,
  likeOrDislikePostById,
  sharePost,
} from "@/actions/post.action";
import { toast } from "sonner";
import { formatTimeAgo } from "@/utils/utils";
import Link from "next/link";
import { useProfile } from "@/services/user.hook";
import { notify } from "@/actions/notify.action";
import { keySWRPost, useInteractions } from "@/services/post.hook";
import { useSWRConfig } from "swr";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PostCard({
  post,
  notPageFeed = false,
  refreshPosts,
}: {
  post: Post;
  notPageFeed?: boolean;
  refreshPosts: () => Promise<void>;
}) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [imageLoadStates, setImageLoadStates] = useState<
    Record<string, boolean>
  >({});
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingShare, setLoadingShare] = useState(false);

  const { data: currentUser } = useProfile();
  const { data: interactions } = useInteractions(post.id);

  const isLiked =
    interactions?.likes.findIndex(
      (like) => like.userId === currentUser?.user_id
    ) !== -1 || false;
  const isShared =
    interactions?.shares.findIndex(
      (share) => share.userId === currentUser?.user_id
    ) !== -1 || false;

  const like_count = interactions?.likes.length || 0;
  const share_count = interactions?.shares.length || 0;
  const comment_count =
    interactions?.comments.reduce(
      (total, c) => total + 1 + (c.replies?.length || 0),
      0
    ) || 0;

  const {
    author_avatar,
    author_username,
    content,
    created_at,
    files,
    hashtags,
    id,
    images,
    title,
    videos,
    author_id,
  } = post;

  const handleLike = async () => {
    setLoadingLike(true);
    try {
      const err = await likeOrDislikePostById(id);
      if (!err) {
        if (currentUser?.user_id !== author_id) {
          await notify({
            title: "Ai đó đã tương tác với bài viết",
            message: `${currentUser?.username} đã ${
              isLiked ? "bỏ thích" : "thích"
            } bài viết của bạn`,
            type: "like",
            userId: author_id,
            entityType: "post",
            entityId: id,
          });
        }

        await mutate([keySWRPost.interaction, id]);
      } else {
        toast.error(err, { richColors: true });
      }
    } finally {
      setLoadingLike(false);
    }
  };

  const handleShare = async () => {
    setLoadingShare(true);
    try {
      const err = await sharePost(id);
      if (!err) {
        if (currentUser?.user_id !== author_id) {
          await notify({
            title: "Ai đó đã tương tác với bài viết",
            message: `${currentUser?.username} đã ${
              isShared ? "bỏ chia sẽ" : "chia sẽ"
            } bài viết của bạn`,
            type: "share",
            userId: author_id,
            entityType: "post",
            entityId: id,
          });
        }
        await mutate([keySWRPost.interaction, id]);
      } else {
        toast.error(err, { richColors: true });
      }
    } finally {
      setLoadingShare(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!notPageFeed) {
      router.push(`/app/feeds/${id}`);
    } else {
      window.location.href = `/app/feeds/${id}`;
    }
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
        <CardContent className="h-full flex flex-col max-sm:px-3 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link href={`/app/users/${author_username}`}>
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={author_avatar || "/placeholder.svg"}
                    alt={author_username}
                  />
                  <AvatarFallback>
                    {author_username?.[1]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <div>
                <Link
                  href={`/app/users/${author_username}`}
                  className="font-semibold"
                >
                  {author_username}
                </Link>

                {created_at && (
                  <div className="text-sm text-muted-foreground">
                    {formatTimeAgo(created_at)}
                  </div>
                )}
              </div>
            </div>

            {/* 🔥 NÚT XÓA BÀI VIẾT */}
            {/* === ACTION MENU (SHADCN DROPDOWN) === */}
            {currentUser?.user_id === author_id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 rounded-full hover:bg-muted"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-40 rounded-lg shadow-lg border bg-popover p-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Delete */}
                  <DropdownMenuItem
                    variant="destructive"
                    className="cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      toast("Bạn có chắc muốn xóa bài viết này?", {
                        description: "Hành động này không thể hoàn tác.",
                        action: {
                          label: "Xóa",
                          onClick: async () => {
                            const promise = (async () => {
                              const err = await deletePost(id);
                              if (err) throw new Error(err);
                              return true;
                            })();

                            toast.promise(promise, {
                              loading: "Đang xóa bài viết...",
                              success: async () => {
                                await refreshPosts();
                                return "Đã xóa bài viết!";
                              },
                              error: (err) => err.message || "Xóa thất bại!",
                            });
                          },
                        },
                      });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa bài viết
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div
            onClick={handleCardClick}
            className="cursor-pointer flex flex-col"
          >
            {/* Images Grid */}
            {images.length > 0 && (
              <div className="mb-3">
                <PostImageGrid
                  images={images}
                  imageLoadStates={imageLoadStates}
                  onImageLoad={handleImageLoad}
                  onImageClick={handleCardClick}
                  onShowAllFiles={() => setShowMediaModal(true)}
                />
              </div>
            )}

            {/* Videos Preview */}
            {videos.length > 0 && (
              <div className="mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 bg-transparent"
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
                  <h3 className="text-xl font-bold text-foreground leading-tight">
                    {title}
                  </h3>
                )}
                <hr className="my-3" />
                {content && (
                  <div className="text-foreground prose">{parse(content)}</div>
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
                disabled={loadingLike}
              >
                {loadingLike ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Heart
                    className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`}
                  />
                )}
                <span className="font-medium">
                  {like_count.toLocaleString()}
                </span>
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
                  handleShare();
                }}
                variant="ghost"
                size="sm"
                className={`gap-2 p-0 h-auto cursor-pointer ${
                  isShared ? "text-red-500" : ""
                }`}
                disabled={loadingShare}
              >
                {loadingShare ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Share2
                    className={`h-5 w-5 ${isShared ? "fill-current" : ""}`}
                  />
                )}
                <span className="font-medium">
                  {share_count.toLocaleString()}
                </span>
              </Button>
            </div>

            {/* View all media & files button */}
            {hasAnyMedia && (
              <div className="mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMediaModal(true);
                  }}
                >
                  Xem tất cả media & files
                </Button>
              </div>
            )}
          </div>
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
}
