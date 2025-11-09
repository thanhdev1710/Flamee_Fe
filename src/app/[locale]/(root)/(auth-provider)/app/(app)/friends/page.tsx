"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, UserPlus, UserCheck } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface User {
  id: number;
  name: string;
  avatar: string;
  status: "follow" | "following";
}

const followMeUsers: User[] = [
  {
    id: 1,
    name: "Chí Thành",
    avatar: "/diverse-avatars.png",
    status: "follow",
  },
  {
    id: 2,
    name: "Chí Thành",
    avatar: "/diverse-avatars.png",
    status: "follow",
  },
  {
    id: 3,
    name: "Chí Thành",
    avatar: "/diverse-avatars.png",
    status: "follow",
  },
  {
    id: 4,
    name: "Chí Thành",
    avatar: "/diverse-avatars.png",
    status: "follow",
  },
  {
    id: 5,
    name: "Chí Thành",
    avatar: "/diverse-avatars.png",
    status: "follow",
  },
  {
    id: 6,
    name: "Chí Thành",
    avatar: "/diverse-avatars.png",
    status: "follow",
  },
  {
    id: 7,
    name: "Chí Thành",
    avatar: "/diverse-avatars.png",
    status: "follow",
  },
  {
    id: 8,
    name: "Chí Thành",
    avatar: "/diverse-avatars.png",
    status: "follow",
  },
];

const invitationUsers: User[] = [
  {
    id: 9,
    name: "Chí Thành",
    avatar: "/diverse-avatars.png",
    status: "follow",
  },
  {
    id: 10,
    name: "Chí Thành",
    avatar: "/diverse-avatars.png",
    status: "follow",
  },
  {
    id: 11,
    name: "Chí Thành",
    avatar: "/diverse-avatars.png",
    status: "follow",
  },
  {
    id: 12,
    name: "Chí Thành",
    avatar: "/diverse-avatars.png",
    status: "follow",
  },
  {
    id: 13,
    name: "Chí Thành",
    avatar: "/diverse-avatars.png",
    status: "follow",
  },
  {
    id: 14,
    name: "Chí Thành",
    avatar: "/diverse-avatars.png",
    status: "follow",
  },
  {
    id: 15,
    name: "Chí Thành",
    avatar: "/diverse-avatars.png",
    status: "follow",
  },
  {
    id: 16,
    name: "Chí Thành",
    avatar: "/diverse-avatars.png",
    status: "follow",
  },
];

function UserCard({ user }: { user: User }) {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <Card className="flex flex-col items-center p-5 gap-4 hover:shadow-xl hover:border-primary/50 transition-all duration-300 border border-border">
      <div className="relative">
        <Avatar className="h-20 w-20 ring-2 ring-border">
          <AvatarImage
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
          />
          <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="text-center w-full">
        <h3 className="font-semibold text-base text-foreground leading-tight">
          {user.name}
        </h3>
      </div>

      <div className="w-full flex flex-col gap-2.5">
        <Button
          onClick={handleFollow}
          className="w-full transition-all duration-200 font-medium flex items-center justify-center gap-2"
          size="sm"
          variant={isFollowing ? "default" : "default"}
        >
          {isFollowing ? (
            <>
              <UserCheck className="h-4 w-4" />
              Following
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Follow
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-secondary/30 border-border hover:bg-secondary/50 transition-colors duration-200"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Message
        </Button>
      </div>
    </Card>
  );
}

function UserSection({ title, users }: { title: string; users: User[] }) {
  const [showAll, setShowAll] = useState(false);
  const displayUsers = showAll ? users : users.slice(0, 8);

  return (
    <section className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">
          {title}
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Connect with friends and expand your network
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {displayUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      {users.length > 8 && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 rounded-lg font-medium text-primary hover:bg-secondary/50 transition-colors duration-200 text-sm border border-border"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </section>
  );
}

export default function FriendsPage() {
  return (
    <ScrollArea className="h-full py-8">
      <div className="px-4">
        <UserSection title="Follow me" users={followMeUsers} />
        <div className="mt-8">
          <UserSection title="Invitation to follow" users={invitationUsers} />
        </div>
        <div className="h-[90px]"></div>
      </div>
    </ScrollArea>
  );
}
