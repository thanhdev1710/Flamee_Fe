// components/ProfileHeader.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CreateUserType } from "@/types/user.type";
import type { GetFriendSuggestionsResult } from "@/types/follow.type";

type Props = {
  profile?: CreateUserType;
  friend?: GetFriendSuggestionsResult;
  notMe?: boolean;
};

export default function ProfileHeader({
  profile,
  friend,
  notMe = false,
}: Props) {
  const fullName = `${profile?.lastName ?? ""} ${
    profile?.firstName ?? ""
  }`.trim();

  const displayName = fullName || profile?.username || "Người dùng";

  // Đếm followers / following (không double-count mutual, không bị NaN)
  const mutualCount = friend?.mutualFriends?.length ?? 0;
  const followingOnlyCount = friend?.following?.length ?? 0;
  const followersOnlyCount = friend?.followers?.length ?? 0;

  const followingCount = mutualCount + followingOnlyCount;
  const followersCount = mutualCount + followersOnlyCount;

  const coverText =
    fullName || profile?.username || (profile ? "Profile" : "Welcome");

  return (
    <Card className="overflow-hidden border-0 shadow-xl bg-linear-to-br from-background via-background to-muted/20">
      {/* COVER */}
      <div className="relative md:h-[260px] h-[180px] bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800">
        <div className="absolute inset-0 bg-linear-to-t from-black/25 via-black/10 to-transparent" />
        <Image
          src={`https://placehold.co/1200x400/6366f1/ffffff?text=${encodeURIComponent(
            coverText
          )}`}
          alt={displayName}
          fill
          priority
          className="object-cover mix-blend-overlay opacity-70"
        />
      </div>

      {/* INFO */}
      <div className="relative px-6 pb-6 bg-linear-to-b from-background to-muted/10">
        {/* Avatar nổi lên cover */}
        <div className="absolute -top-16 left-6">
          <Avatar className="w-32 h-32 shadow-2xl ring-4 ring-background bg-background">
            <AvatarImage src={profile?.avatar_url || ""} alt={displayName} />
            <AvatarFallback className="bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 text-white text-2xl font-semibold">
              {displayName.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="pt-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Tên + username + stats */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {displayName}
            </h1>

            {profile?.username && (
              <p className="text-sm sm:text-base text-muted-foreground">
                {profile.username}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span className="text-muted-foreground/80">Following:</span>
                <span className="font-semibold text-foreground ml-1">
                  {followingCount}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span className="text-muted-foreground/80">Followers:</span>
                <span className="font-semibold text-foreground ml-1">
                  {followersCount}
                </span>
              </span>
            </div>
          </div>

          {!notMe && (
            <Button
              asChild
              variant="outline"
              className="rounded-full px-4 py-2 text-sm font-medium border-border hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-300 hover:shadow-md transition-all"
            >
              <Link href="/app/users/edit">Edit profile</Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
