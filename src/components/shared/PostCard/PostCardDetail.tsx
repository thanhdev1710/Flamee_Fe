"use client";
import type React from "react";
import { useState } from "react";
import Image from "next/image";

import {
  Heart,
  MessageSquare,
  Send,
  Share2,
  Bookmark,
  MoreHorizontal,
  Hash,
  FileText,
  X,
} from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { PostImageGrid } from "./PostImageGrid";
import { FilesModal } from "@/components/shared/FilesModal";
import { Post } from "@/types/post.type";

export default function PostCardDetail(props: Post) {
  const {
    title,
    body,
    userId,
    userName,
    userAvatar,
    tags = [],
    files = [],
    images = [],
    videos = [],
    likes = 0,
    comments = 0,
    shares = 0,
    createdAt,
    hideStats,
  } = props;

  const displayName = userName || `User #${userId}`;
  const displayAvatar =
    userAvatar || `https://i.pravatar.cc/150?u=user-${userId}`;

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [newComment, setNewComment] = useState("");
  const [imageLoadStates, setImageLoadStates] = useState<
    Record<string, boolean>
  >({});
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedImageInLightbox, setSelectedImageInLightbox] = useState<
    string | null
  >(null);

  const hasImages = images.length > 0;
  const hasFiles = files.length > 0;
  const hasVideos = videos.length > 0;
  const hasAnyMedia = hasImages || hasFiles || hasVideos;

  // Like
  const handleLike = () => {
    setIsLiked((prev) => {
      const next = !prev;
      setLikeCount((curr) => (next ? curr + 1 : curr - 1));
      // TODO: call like/unlike API
      return next;
    });
  };

  // Comment
  const handleSendComment = () => {
    if (!newComment.trim()) return;
    // TODO: call comment API
    console.log("New comment:", newComment);
    setNewComment("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  // Image load animation hook
  const handleImageLoad = (imageId: string) => {
    setImageLoadStates((prev) => ({ ...prev, [imageId]: true }));
  };

  // Click vào image để mở lightbox
  const handleImageClickForLightbox = (
    e: React.MouseEvent,
    imageUrl?: string
  ) => {
    e.stopPropagation();
    if (imageUrl) setSelectedImageInLightbox(imageUrl);
  };

  return (
    <>
      <Card className="flex flex-col w-full h-full bg-background">
        {/* HEADER */}
        <CardContent className="flex items-center justify-between px-4 py-4 border-b bg-background sticky top-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 ring-2 ring-border">
              <AvatarImage src={displayAvatar} alt={displayName} />
              <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">
                {displayName}
              </span>
              <span className="text-sm text-muted-foreground">
                {createdAt || ""}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </CardContent>

        {/* BODY */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
              {/* MEDIA */}
              {hasImages && (
                <PostImageGrid
                  images={images}
                  imageLoadStates={imageLoadStates}
                  onImageLoad={handleImageLoad}
                  onImageClick={handleImageClickForLightbox}
                  onShowAllFiles={() => setShowMediaModal(true)}
                  aspectRatio="4/3"
                />
              )}

              {hasVideos && (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={() => setShowMediaModal(true)}
                  >
                    <Share2 className="w-4 h-4 rotate-90 opacity-0" />
                    {/* placeholder để cân layout nếu cần */}
                    🎬 {videos.length} video
                    {videos.length > 1 ? "s" : ""} đính kèm - bấm để xem
                  </Button>
                </div>
              )}

              {hasFiles && (
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMediaModal(true)}
                    className="w-full text-left justify-start"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {files.length} file{files.length > 1 ? "s" : ""} đính kèm
                  </Button>
                </div>
              )}

              {/* NỘI DUNG */}
              {(title || body) && (
                <div className="space-y-3">
                  {title && (
                    <h1 className="text-xl font-bold text-foreground leading-tight">
                      {title}
                    </h1>
                  )}
                  {body && (
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {body}
                    </p>
                  )}
                </div>
              )}

              {/* TAGS */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs px-2 py-0.5 cursor-pointer"
                    >
                      <Hash className="w-2.5 h-2.5 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* NÚT XEM MEDIA */}
              {hasAnyMedia && (
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground px-0"
                    onClick={() => setShowMediaModal(true)}
                  >
                    Xem tất cả media & files
                  </Button>
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex items-center gap-6 text-muted-foreground">
                {/* Like */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 p-0 h-auto ${
                    isLiked ? "text-red-500" : ""
                  }`}
                  onClick={handleLike}
                >
                  <Heart
                    className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`}
                  />
                  {!hideStats && (
                    <span className="font-medium">
                      {likeCount.toLocaleString()}
                    </span>
                  )}
                </Button>

                {/* Comments */}
                <Button variant="ghost" size="sm" className="gap-2 p-0 h-auto">
                  <MessageSquare className="h-5 w-5" />
                  {!hideStats && (
                    <span className="font-medium">
                      {comments.toLocaleString()}
                    </span>
                  )}
                </Button>

                {/* Shares */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 p-0 h-auto"
                  // TODO: mở modal chia sẻ / gọi API share
                >
                  <Share2 className="h-5 w-5" />
                  {!hideStats && (
                    <span className="font-medium">
                      {shares.toLocaleString()}
                    </span>
                  )}
                </Button>

                {/* Bookmark */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto p-0 h-auto"
                  // TODO: toggle save
                >
                  <Bookmark className="h-5 w-5" />
                </Button>
              </div>

              <Separator className="my-3" />

              {/* COMMENTS LIST (mock demo, hook vào API sau) */}
              <div className="pb-2">
                <h3 className="font-semibold text-foreground mb-4">
                  Comments ({comments})
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      name: "JaneDoe",
                      comment: "This looks absolutely amazing! 🔥",
                      time: "5m",
                    },
                    {
                      name: "ChiThanh",
                      comment: "Very inspiring work! Keep it up 👏✨",
                      time: "10m",
                    },
                    {
                      name: "DevGuy",
                      comment:
                        "Can you share more details about this? Would love to learn!",
                      time: "12m",
                    },
                  ].map((c, idx) => (
                    <div key={idx} className="flex gap-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage
                          src={`https://i.pravatar.cc/150?u=${c.name}`}
                          alt={c.name}
                        />
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                          {c.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="bg-muted rounded-md px-3 py-2">
                          <div className="font-medium text-sm text-foreground">
                            {c.name}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {c.comment}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground px-3">
                          <span>{c.time}</span>
                          <button className="hover:text-foreground">
                            Like
                          </button>
                          <button className="hover:text-foreground">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* COMMENT INPUT */}
          <div className="border-t bg-background p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage
                  src="/placeholder.svg?height=32&width=32"
                  alt="You"
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  You
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex items-center gap-2">
                <Input
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1 rounded-full border-input focus:border-primary"
                />
                <Button
                  size="sm"
                  onClick={handleSendComment}
                  disabled={!newComment.trim()}
                  className="rounded-full px-4"
                >
                  <Send className="h-4 w-4" />
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
          className="fixed inset-0 bg-black/80 z-60 flex items-center justify-center p-4"
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
              className="absolute top-4 right-4 bg-background/80 rounded-full w-10 h-10 p-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
