"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ProfileSummary } from "@/types/follow.type";
import { cn } from "@/lib/utils";
import Link from "next/link";

type FriendRowProps = {
  item: ProfileSummary;
  variant?: "followers" | "following" | "suggest" | "mutual";
  onAction?: (
    id: string,
    variant: "followers" | "following" | "mutual" | "suggest"
  ) => void;
};

export default function FriendRow({
  item,
  variant = "suggest",
  onAction,
}: FriendRowProps) {
  const fullName = `${item.lastName ?? ""} ${item.firstName ?? ""}`.trim();
  const displayName = item.username || fullName;

  // Text theo variant
  const buttonLabel = {
    followers: "Follow back",
    following: "Unfollow",
    suggest: "Follow",
    mutual: "Bạn chung",
  }[variant];

  // Style theo variant
  const buttonStyle = {
    followers:
      "bg-blue-600 text-white hover:bg-blue-700 border-blue-600 shadow-xs",
    following:
      "bg-red-600/10 text-red-600 border border-red-500/50 hover:bg-red-600/20",
    suggest:
      "bg-primary/10 text-primary border border-primary/40 hover:bg-primary/20",
    mutual:
      "bg-green-600/10 text-green-600 border border-green-600/40 hover:bg-green-600/20",
  }[variant];

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl 
      hover:bg-muted/60 border border-transparent 
      hover:border-muted/40 transition-all duration-200 group"
    >
      {/* Avatar */}
      <Avatar className="h-11 w-11 ring-2 ring-transparent group-hover:ring-primary/40 transition-all duration-300">
        <AvatarImage src={item.avatar_url || ""} alt={displayName} />
        <AvatarFallback className="bg-linear-to-br from-primary to-purple-600 text-white font-bold">
          {displayName.charAt(0)?.toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Tên */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate text-foreground">
          {fullName || displayName}
        </p>
        <p className="text-xs truncate text-muted-foreground">{displayName}</p>
      </div>

      {/* Button */}
      {variant === "mutual" ? (
        <Button
          size="sm"
          className={cn(
            "text-xs rounded-lg px-3 py-1 font-medium transition-all shadow-sm",
            buttonStyle
          )}
          asChild
        >
          <Link href={`/app/users/${item.username}`}>{buttonLabel}</Link>
        </Button>
      ) : (
        <Button
          size="sm"
          className={cn(
            "text-xs rounded-lg px-3 py-1 font-medium transition-all shadow-sm",
            buttonStyle
          )}
          onClick={() => onAction?.(item.user_id, variant)}
        >
          {buttonLabel}
        </Button>
      )}
    </div>
  );
}
