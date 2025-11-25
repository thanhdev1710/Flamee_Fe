"use client";
import type React from "react";
import { useState } from "react";
import Image from "next/image";
import parse from "html-react-parser";

import {
  Heart,
  MessageSquare,
  Send,
  Share2,
  Hash,
  FileText,
  X,
  MoreHorizontal,
  ChevronDown,
  Loader2,
} from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { PostImageGrid } from "./PostImageGrid";
import { FilesModal } from "@/components/shared/FilesModal";
import type { Post } from "@/types/post.type";
import { formatTimeAgo } from "@/utils/utils";
import {
  commentPost,
  likeOrDislikePostById,
  sharePost,
} from "@/actions/post.action";
import { toast } from "sonner";
import type { Interaction } from "@/types/interaction.type";
import Link from "next/link";
import { useProfile } from "@/services/user.hook";
import { Button } from "@/components/ui/button";
import { notify } from "@/actions/notify.action";

export default function PostCardDetail({
  post,
  interactions,
  mutateAll,
  openComment,
}: {
  post: Post;
  interactions?: Interaction;
  mutateAll: () => Promise<void>;
  openComment?: boolean;
}) {
  const {
    id,
    title,
    files = [],
    images = [],
    videos = [],
    author_avatar,
    author_username,
    comment_count,
    content,
    created_at,
    hashtags,
    like_count,
    share_count,
    author_id,
  } = post;

  const [replyId, setReplyId] = useState({ id: "", username: "" });
  const [newComment, setNewComment] = useState("");
  const [imageLoadStates, setImageLoadStates] = useState<
    Record<string, boolean>
  >({});
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedImageInLightbox, setSelectedImageInLightbox] = useState<
    string | null
  >(null);
  const [showReplies, setShowReplies] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingShare, setLoadingShare] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);

  const hasImages = images.length > 0;
  const hasFiles = files.length > 0;
  const hasVideos = videos.length > 0;
  const { data: currentUser } = useProfile();

  const isLiked =
    interactions?.likes.findIndex(
      (like) => like.userId === currentUser?.user_id
    ) !== -1;
  const isShared =
    interactions?.shares.findIndex(
      (share) => share.userId === currentUser?.user_id
    ) !== -1;

  const handleLike = async () => {
    setLoadingLike(true);
    try {
      const err = await likeOrDislikePostById(id);
      if (!err) {
        if (currentUser?.user_id !== author_id) {
          notify({
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
        await mutateAll();
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
          notify({
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
        await mutateAll();
      } else {
        toast.error(err, { richColors: true });
      }
    } finally {
      setLoadingShare(false);
    }
  };

  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    setLoadingComment(true);
    try {
      const err = await commentPost(id, {
        content: newComment,
        parent_id: replyId.id || null,
      });
      if (!err) {
        if (currentUser?.user_id !== author_id) {
          notify({
            title: "Ai đó đã tương tác với bài viết",
            message: `${currentUser?.username} đã bình luận bài viết của bạn`,
            type: "comment",
            userId: author_id,
            entityType: "post",
            entityId: id,
          });
        }
        await mutateAll();
      } else {
        toast.error(err, { richColors: true });
      }
    } finally {
      setNewComment("");
      setLoadingComment(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  const handleImageLoad = (imageId: string) => {
    setImageLoadStates((prev) => ({ ...prev, [imageId]: true }));
  };

  const handleImageClickForLightbox = (
    e: React.MouseEvent,
    imageUrl?: string
  ) => {
    e.stopPropagation();
    if (imageUrl) setSelectedImageInLightbox(imageUrl);
  };

  return (
    <>
      <Card className="flex flex-col w-full h-full bg-card border-border shadow-sm">
        {/* HEADER - Enhanced with more professional styling */}
        <CardContent className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-4">
            <Link href={`/app/users/${author_username}`}>
              <Avatar className="h-12 w-12 ring-2 ring-border">
                <AvatarImage
                  src={author_avatar || "/placeholder.svg"}
                  alt={author_username}
                />
                <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                  {author_username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex flex-col gap-1">
              <Link
                href={`/app/users/${author_username}`}
                className="font-semibold text-foreground text-base"
              >
                {author_username}
              </Link>
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(created_at)}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </Button>
        </CardContent>

        {/* BODY */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 pb-6 space-y-5">
            {/* TITLE & CONTENT - Improved typography */}
            {(title || content) && (
              <div className="space-y-3">
                {title && (
                  <h2 className="text-2xl font-bold text-foreground leading-snug">
                    {title}
                  </h2>
                )}
                <hr className="my-3" />
                {content && (
                  <div className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                    {parse(content)}
                  </div>
                )}
              </div>
            )}

            {/* MEDIA */}
            {hasImages && (
              <div className="mt-4">
                <PostImageGrid
                  images={images}
                  imageLoadStates={imageLoadStates}
                  onImageLoad={handleImageLoad}
                  onImageClick={handleImageClickForLightbox}
                  onShowAllFiles={() => setShowMediaModal(true)}
                  aspectRatio="16/10"
                />
              </div>
            )}

            {hasVideos && (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground bg-transparent"
                onClick={() => setShowMediaModal(true)}
              >
                <FileText className="w-4 h-4" />
                {videos.length} video{videos.length > 1 ? "s" : ""} - Click to
                view
              </Button>
            )}

            {hasFiles && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMediaModal(true)}
                className="w-full text-left justify-start text-muted-foreground hover:text-foreground"
              >
                <FileText className="w-4 h-4 mr-2" />
                {files.length} file{files.length > 1 ? "s" : ""}
              </Button>
            )}

            {/* TAGS - Enhanced styling */}
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {hashtags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs px-3 py-1 cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <Hash className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* ACTIONS - Improved layout */}
            <div className="flex items-center gap-8 text-muted-foreground pt-3">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 p-0 h-auto text-sm font-medium transition-colors ${
                  isLiked ? "text-red-500" : "hover:text-foreground"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                disabled={loadingLike}
              >
                {loadingLike ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Heart
                    className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                  />
                )}
                <span>{like_count.toLocaleString()}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="gap-2 p-0 h-auto text-sm font-medium hover:text-foreground transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{comment_count.toLocaleString()}</span>
              </Button>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
                variant="ghost"
                size="sm"
                className={`gap-2 p-0 h-auto text-sm font-medium transition-colors ${
                  isShared ? "text-red-500" : "hover:text-foreground"
                }`}
                disabled={loadingShare}
              >
                {loadingShare ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Share2
                    className={`h-4 w-4 ${isShared ? "fill-current" : ""}`}
                  />
                )}
                <span>{share_count.toLocaleString()}</span>
              </Button>
            </div>

            <Separator className="my-4" />

            {/* COMMENTS HEADER WITH TOGGLE */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-sm">
                Comments ({comment_count})
              </h3>
              {openComment ? null : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplies(!showReplies)}
                  className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      showReplies ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              )}
            </div>

            {/* COMMENTS LIST - Only show when toggled */}
            {(openComment || showReplies) && (
              <div className="space-y-4 pt-2">
                {interactions?.comments.map((c, idx) => (
                  <div key={idx} className="space-y-3">
                    {/* Parent Comment */}
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage
                          src={c.user.avatarUrl || "/placeholder.svg"}
                          alt={c.user.username}
                        />
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
                          {c.user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1.5">
                        <div className="bg-muted rounded-lg px-3 py-2.5">
                          <div className="font-medium text-sm text-foreground">
                            {c.user.username}
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {c.content}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground px-1">
                          <span className="font-medium">
                            {formatTimeAgo(c.createdAt)}
                          </span>
                          <button
                            onClick={() =>
                              setReplyId({
                                id: c.id,
                                username: c.user.username,
                              })
                            }
                            className="hover:text-foreground transition-colors font-medium"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Nested Replies */}
                    {c.replies && c.replies.length > 0 && (
                      <div className="ml-10 space-y-3 border-l border-border pl-3">
                        {c.replies.map((reply, replyIdx) => (
                          <div key={replyIdx} className="flex gap-3">
                            <Avatar className="h-7 w-7 flex-shrink-0">
                              <AvatarImage
                                src={reply.user.avatarUrl || "/placeholder.svg"}
                                alt={reply.user.username}
                              />
                              <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
                                {reply.user.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="bg-muted/50 rounded-lg px-3 py-2">
                                <div className="font-medium text-xs text-foreground">
                                  {reply.user.username}
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {reply.content}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground px-1">
                                <span className="font-medium">
                                  {formatTimeAgo(reply.createdAt)}
                                </span>

                                <button
                                  onClick={() =>
                                    setReplyId({
                                      id: c.id,
                                      username: reply.user.username,
                                    })
                                  }
                                  className="hover:text-foreground transition-colors font-medium"
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COMMENT INPUT */}
          <div className="h-10"></div>
          <div className="flex-shrink-0 border-t border-border bg-card px-6 py-4 space-y-3 w-full absolute bottom-0 left-0">
            {replyId.username && (
              <div className="text-xs text-muted-foreground bg-muted/30 rounded px-3 py-2 flex items-center justify-between">
                <span>
                  Replying to{" "}
                  <span className="font-medium">{replyId.username}</span>
                </span>
                <button
                  onClick={() => setReplyId({ id: "", username: "" })}
                  className="hover:text-foreground transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            <div className="flex items-end gap-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage
                  src="/placeholder.svg?height=32&width=32"
                  alt="You"
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                  U
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex items-center gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={loadingComment}
                  className="flex-1 rounded-full border-border focus:ring-1 focus:ring-primary text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleSendComment}
                  disabled={!newComment.trim() || loadingComment}
                  className="rounded-full px-4 h-9"
                >
                  {loadingComment ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* MEDIA MODAL */}
      {showMediaModal && (
        <FilesModal
          images={images}
          videos={videos}
          files={files}
          onClose={() => setShowMediaModal(false)}
          postTitle={title || ""}
        />
      )}

      {/* IMAGE LIGHTBOX */}
      {selectedImageInLightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImageInLightbox(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <Image
              src={selectedImageInLightbox || "/placeholder.svg"}
              alt="Full size image"
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              onClick={() => setSelectedImageInLightbox(null)}
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full w-9 h-9 p-0"
            >
              <X className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
