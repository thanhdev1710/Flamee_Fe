"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ProfileSummary } from "@/types/follow.type";
import { cn } from "@/lib/utils";

type FriendRowProps = {
  item: ProfileSummary;
  variant?: "followers" | "following" | "suggest" | "mutual";
  onAction?: (id: string) => void;
};

export default function FriendRow({
  item,
  variant = "suggest",
  onAction,
}: FriendRowProps) {
  const fullName = `${item.lastName ?? ""} ${item.firstName ?? ""}`.trim();
  const displayName = fullName || item.username || "Người dùng";

  // Nút theo variant
  const buttonLabel = {
    followers: "Follow Back",
    following: "Unfollow",
    suggest: "Follow",
    mutual: "Bạn chung",
  }[variant];

  const buttonStyle = {
    followers:
      "bg-blue-600 text-white hover:bg-blue-700 border-blue-600 shadow-sm cursor-pointer",
    following:
      "bg-red-600/10 text-red-500 border-red-600/40 hover:bg-red-600/20 cursor-pointer",
    suggest:
      "bg-gradient-to-r text-purple-500 from-indigo-500/20 to-purple-500/20 border-purple-300/40 hover:border-purple-300 hover:bg-purple-500/10 cursor-pointer",
    mutual:
      "bg-green-600/10 text-green-500 border-green-600/40 hover:bg-green-600/20 cursor-pointer",
  }[variant];

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/60 transition-all duration-200 group border border-transparent hover:border-muted/40">
      <Avatar className="h-11 w-11 ring-2 ring-transparent group-hover:ring-primary/30 transition-all duration-300 shadow-sm">
        <AvatarImage src={item.avatar_url || ""} alt={displayName} />
        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-700 text-white font-semibold">
          {displayName.charAt(0)?.toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate text-foreground">
          {displayName}
        </p>
        <p className="text-xs truncate text-muted-foreground">
          {item.bio || "Chưa có mô tả"}
        </p>
      </div>

      <Button
        size="sm"
        className={cn(
          "text-xs rounded-lg px-3 py-1 transition-all shadow-sm",
          buttonStyle
        )}
        onClick={() => onAction?.(item.user_id)}
      >
        {buttonLabel}
      </Button>
    </div>
  );
}
