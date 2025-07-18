"use client";

import Image from "next/image";
import { Heart, MessageSquare, SendHorizonal } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PostCardDetailProps {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function PostCardDetail({
  id,
  title,
  body,
  userId,
}: PostCardDetailProps) {
  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={`https://i.pravatar.cc/150?u=user-${userId}`}
            alt={`User ${userId}`}
          />
          <AvatarFallback>{userId}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium text-sm">User #{userId}</span>
          <span className="text-xs text-muted-foreground">15 mins ago</span>
        </div>
      </div>

      {/* Image */}
      <div className="relative aspect-[4/3] w-full">
        <Image
          fill
          src={`https://picsum.photos/seed/${id}/800/600`}
          alt={title}
          className="object-cover"
        />
      </div>

      {/* Post Content */}
      <div className="px-4 py-3">
        <h2 className="text-lg font-semibold mb-1">{title}</h2>
        <p className="text-sm text-gray-700 leading-relaxed">{body}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 px-4 pb-2">
        <Button variant="ghost" size="sm" className="gap-1">
          <Heart className="h-5 w-5" />
          <span>1.2K</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-1">
          <MessageSquare className="h-5 w-5" />
          <span>350</span>
        </Button>
      </div>

      {/* Comments */}
      <ScrollArea className="px-4 h-40">
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium">JaneDoe</span>: This looks awesome!
          </div>
          <div>
            <span className="font-medium">ChiThanh</span>: Very inspiring 👏
          </div>
          <div>
            <span className="font-medium">DevGuy</span>: Can you share the code?
          </div>
          {/* Thêm comment mẫu */}
        </div>
      </ScrollArea>

      {/* New Comment */}
      <div className="flex items-center gap-2 px-4 py-3 border-t">
        <Input placeholder="Add a comment..." className="flex-1" />
        <Button size="sm" variant="default">
          <SendHorizonal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
