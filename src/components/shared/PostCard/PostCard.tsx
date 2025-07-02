"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { MoreHorizontal, Heart, MessageSquare } from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import Image from "next/image";

interface PostCardProps {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function PostCard({ id, title, body, userId }: PostCardProps) {
  return (
    <Card className="h-full max-sm:py-3">
      <CardContent className="h-full flex flex-col max-sm:px-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 rounded-full overflow-hidden shadow border">
              <AvatarImage
                src={`https://i.pravatar.cc/150?u=user-${userId}`}
                alt={`User ${userId}`}
              />
              <AvatarFallback>U{userId}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">User #{userId}</div>
              <div className="text-sm text-gray-500">15 mins ago</div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative mb-4 h-full w-full rounded-md overflow-hidden">
          <Image
            fill
            src={`https://picsum.photos/seed/${id}/600/400`}
            sizes="(max-width: 768px) 100vw, 590px"
            alt="Post image"
            className="absolute w-full h-full object-cover"
          />
        </div>

        <div className="mb-4">
          <p className="text-sm">
            <span className="font-medium line-clamp-1">
              User #{userId}: {title}
            </span>
            <span className="text-gray-600 line-clamp-2">{body}</span>
          </p>
        </div>

        <div className="flex items-center gap-6 text-gray-500">
          <Button variant="ghost" size="sm" className="gap-2 p-0 h-auto">
            <Heart className="h-5 w-5" />
            <span>1,498</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 p-0 h-auto">
            <MessageSquare className="h-5 w-5" />
            <span>3,000</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
