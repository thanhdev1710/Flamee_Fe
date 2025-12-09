"use client";
import type React from "react";
import { useState } from "react";
import Image from "next/image";
import parse from "html-react-parser";
import { useSWRConfig } from "swr";

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
  Play,
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
import { handleToxicCheck } from "@/actions/check.handle";
import { keySWRPost } from "@/services/post.hook";

export default function PostCardDetail({
  post,
  interactions,
  openComment,
}: {
  post: Post;
  interactions?: Interaction;
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
    content,
    created_at,
    hashtags,
    author_id,
  } = post;

  const { mutate } = useSWRConfig();
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

  const { data: currentUser } = useProfile();

  const isLiked =
    interactions?.likes.findIndex(
      (like) => like.userId === currentUser?.user_id
    ) !== -1;
  const isShared =
    interactions?.shares.findIndex(
      (share) => share.userId === currentUser?.user_id
    ) !== -1;

  const like_count = interactions?.likes.length || 0;
  const share_count = interactions?.shares.length || 0;
  const comment_count =
    interactions?.comments.reduce(
      (total, c) => total + 1 + (c.replies?.length || 0),
      0
    ) || 0;

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

  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    setLoadingComment(true);
    try {
      if (!(await handleToxicCheck(newComment))) {
        setLoadingComment(false);
        return;
      }
      const err = await commentPost(id, {
        content: newComment,
        parent_id: replyId.id || null,
      });
      if (!err) {
        if (currentUser?.user_id !== author_id) {
          await notify({
            title: "Ai đó đã tương tác với bài viết",
            message: `${currentUser?.username} đã bình luận bài viết của bạn`,
            type: "comment",
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
      <Card className="flex flex-col w-full h-full min-h-[80vh] bg-card border-border shadow-sm">
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

            {/* MEDIA FULL PREVIEW */}
            <div className="space-y-4 mt-4">
              {/* IMAGE GRID */}
              {images.length > 0 && (
                <PostImageGrid
                  images={images}
                  imageLoadStates={imageLoadStates}
                  onImageLoad={handleImageLoad}
                  onImageClick={handleImageClickForLightbox}
                  onShowAllFiles={() => setShowMediaModal(true)}
                />
              )}

              {/* ========= VIDEO GRID (NEW) ========= */}
              {videos.length > 0 && (
                <div className="grid grid-cols-2 gap-3 rounded-lg overflow-hidden">
                  {videos.map((video, idx) => (
                    <div
                      key={idx}
                      className="relative group cursor-pointer rounded-lg bg-black"
                      onClick={() => setShowMediaModal(true)}
                    >
                      <video
                        src={video.mediaUrl}
                        className="w-full h-40 object-cover opacity-70 group-hover:opacity-100 transition"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/60 p-2 rounded-full">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ========= FILE LIST (NEW) ========= */}
              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file, idx) => (
                    <a
                      key={idx}
                      href={file.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-md border hover:bg-muted transition"
                    >
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium truncate">
                        {file.name}
                      </span>
                    </a>
                  ))}
                </div>
              )}

              {/* BUTTON: SEE ALL MEDIA */}
              {(images.length > 0 || videos.length > 0 || files.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground"
                  onClick={() => setShowMediaModal(true)}
                >
                  Xem tất cả media & files
                </Button>
              )}
            </div>

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
                      <Avatar className="h-8 w-8 shrink-0">
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
                            <Avatar className="h-7 w-7 shrink-0">
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
                <div className="h-5"></div>
              </div>
            )}
          </div>

          {/* COMMENT INPUT */}
          <div className="h-10"></div>
          <div className="shrink-0 border-t border-border bg-card px-6 py-4 space-y-3 w-full absolute bottom-0 left-0">
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
              <Avatar className="h-8 w-8 shrink-0">
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
