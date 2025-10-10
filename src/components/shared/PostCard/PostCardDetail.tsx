"use client";
import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

import {
  Heart,
  MessageSquare,
  Send,
  Share,
  Bookmark,
  MoreHorizontal,
  Hash,
  FileText,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PostImageGrid } from "./PostImageGrid";
import { FilesModal } from "../FilesModal";
import { PostCardProps } from "@/types/PostCard";

export default function PostCardDetail({
  id,
  title,
  body,
  userId,
  userName = `User #${userId}`,
  userAvatar = `https://i.pravatar.cc/150?u=user-${userId}`,
  tags = [],
  files = [],
  images = [],
  likes = 1200,
  comments = 350,
  createdAt = "15 mins ago",
  hideStats = false,
}: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [newComment, setNewComment] = useState("");
  const [imageLoadStates, setImageLoadStates] = useState<
    Record<string, boolean>
  >({});
  const [showAllFiles, setShowAllFiles] = useState(false);
  const [selectedImageInLightbox, setSelectedImageInLightbox] = useState<
    string | null
  >(null);

  // Mock data for demo if not provided
  const mockImages =
    images.length > 0
      ? images
      : [
          {
            id: "1",
            name: "image1.jpg",
            type: "image/jpeg",
            url: `https://picsum.photos/seed/${id}/800/600`,
          },
          {
            id: "2",
            name: "image2.jpg",
            type: "image/jpeg",
            url: `https://picsum.photos/seed/${id + 1}/800/600`,
          },
          {
            id: "3",
            name: "image3.jpg",
            type: "image/jpeg",
            url: `https://picsum.photos/seed/${id + 2}/800/600`,
          },
          {
            id: "4",
            name: "image4.jpg",
            type: "image/jpeg",
            url: `https://picsum.photos/seed/${id + 3}/800/600`,
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
      : [
          "technology",
          "design",
          "inspiration",
          "creative",
          "innovation",
          "webdev",
        ];

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleSendComment = () => {
    if (newComment.trim()) {
      console.log("New comment:", newComment);
      setNewComment("");
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
    if (imageUrl) {
      setSelectedImageInLightbox(imageUrl);
    }
  };

  return (
    <>
      <Card className="flex flex-col w-full h-full bg-background">
        {/* Header */}
        <CardContent className="flex items-center justify-between px-4 py-4 border-b bg-background sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 ring-2 ring-border">
              <AvatarImage
                src={userAvatar || "/placeholder.svg"}
                alt={userName}
              />
              <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">{userName}</span>
              <span className="text-sm text-muted-foreground">
                {createdAt} • {comments.toLocaleString()} views
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </CardContent>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1">
            <div className="p-6">
              {/* Images Grid */}
              <PostImageGrid
                images={mockImages}
                imageLoadStates={imageLoadStates}
                onImageLoad={handleImageLoad}
                onImageClick={handleImageClickForLightbox} // Clicks on images open lightbox
                onShowAllFiles={() => setShowAllFiles(true)}
                aspectRatio="4/3" // Aspect ratio for detail page
              />

              {/* Post Content */}
              <div className="mb-4 space-y-3">
                <h1 className="text-xl font-bold text-foreground leading-tight">
                  {title}
                </h1>
                <p className="text-muted-foreground leading-relaxed">{body}</p>
              </div>

              {/* Tags */}
              {mockTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {mockTags.map((tag) => (
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

              {/* Other Files Preview */}
              {mockFiles.length > 0 && (
                <div className="mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAllFiles(true)}
                    className="w-full text-left justify-start"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {mockFiles.length} file{mockFiles.length > 1 ? "s" : ""}{" "}
                    attached
                  </Button>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-6 text-muted-foreground mb-4">
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

                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 p-0 h-auto text-muted-foreground"
                >
                  <MessageSquare className="h-5 w-5" />
                  {!hideStats && (
                    <span className="font-medium">
                      {comments.toLocaleString()}
                    </span>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground"
                >
                  <Share className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground ml-auto"
                >
                  <Bookmark className="h-5 w-5" />
                </Button>
              </div>

              <Separator />

              {/* Comments Section */}
              <div className="py-3">
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
                  ].map((comment, index) => (
                    <div key={index} className="flex gap-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage
                          src={`https://i.pravatar.cc/150?u=${comment.name}`}
                          alt={comment.name}
                        />
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                          {comment.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="bg-muted rounded-md px-3 py-2">
                          <div className="font-medium text-sm text-foreground">
                            {comment.name}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {comment.comment}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground px-3">
                          <span>{comment.time}</span>
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

          {/* New Comment Input */}
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

      {/* Files Modal (re-used from PostCard) */}
      {showAllFiles && (
        <FilesModal
          images={mockImages}
          files={mockFiles}
          onClose={() => setShowAllFiles(false)}
          postTitle={title}
        />
      )}

      {/* Image Lightbox for PostCardDetail */}
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
