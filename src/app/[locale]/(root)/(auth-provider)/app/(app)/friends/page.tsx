"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserMinus, UserPlus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import useSWR, { mutate } from "swr";
import { ProfileSummary } from "@/types/follow.type";
import { getFriendSuggestions } from "@/services/follow.service";
import { addOrUnFollowById } from "@/actions/follow.actions";
import { toast } from "sonner";

type UserSectionVariant = "followers" | "suggestions" | "following" | "mutual";

function UserCard({
  user,
  variant,
}: {
  user: ProfileSummary;
  variant: UserSectionVariant;
}) {
  const handleFollow = () => {
    const followPromise = addOrUnFollowById(user.user_id).then(async (err) => {
      if (!err) {
        await mutate("invitationUsers");
        return "Thành công";
      } else {
        throw new Error("Đã xảy ra lỗi");
      }
    });

    toast.promise(followPromise, {
      loading: "Đang xử lý...",
      success: (msg) => msg || "Thành công",
      error: (err) => err.message || "Đã xảy ra lỗi",
      richColors: true,
    });
  };

  const isFollowerSection = variant === "followers";

  // Chuẩn hoá username nếu bạn muốn bỏ @ trên URL,
  // còn nếu backend xử lý được @ thì có thể dùng luôn user.username
  const usernameSlug = user.username?.replace(/^@/, "") || user.user_id;

  return (
    <Card className="flex flex-col items-center p-5 gap-4 hover:shadow-xl hover:border-primary/50 transition-all duration-300 border border-border">
      <div className="relative">
        <Avatar className="h-20 w-20 ring-2 ring-border">
          <AvatarImage src={user.avatar_url || ""} alt={user.lastName || ""} />
          <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
            {user.firstName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="text-center w-full">
        <h3 className="font-semibold text-base text-foreground leading-tight">
          {user.firstName}
        </h3>
        {user.username && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {user.username}
          </p>
        )}
      </div>

      <div className="w-full flex flex-col gap-2.5">
        {variant === "mutual" ? (
          // 👉 Đã là bạn chung: chỉ cho đi tới trang cá nhân
          <Button
            asChild
            className="w-full transition-all duration-200 font-medium flex items-center justify-center gap-2"
            size="sm"
            variant="outline"
          >
            <Link href={`/app/users/${usernameSlug}`}>View profile</Link>
          </Button>
        ) : variant === "following" ? (
          <Button
            onClick={handleFollow}
            className="w-full transition-all duration-200 font-medium flex items-center justify-center gap-2"
            size="sm"
          >
            <UserMinus className="h-4 w-4" />
            Unfollow
          </Button>
        ) : (
          // 👉 Các case còn lại: Follow / Follow back
          <Button
            onClick={handleFollow}
            className="w-full transition-all duration-200 font-medium flex items-center justify-center gap-2"
            size="sm"
          >
            <UserPlus className="h-4 w-4" />
            {isFollowerSection ? "Follow back" : "Follow"}
          </Button>
        )}
      </div>
    </Card>
  );
}

function UserSection({
  title,
  subtitle,
  users,
  variant,
}: {
  title: string;
  subtitle: string;
  users: ProfileSummary[];
  variant: UserSectionVariant;
}) {
  const [showAll, setShowAll] = useState(false);
  const displayUsers = showAll ? users : users.slice(0, 8);

  return (
    <section className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">
          {title}
        </h2>
        <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
      </div>

      {users.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No users to show in this section.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {displayUsers.map((user) => (
              <UserCard key={user.user_id} user={user} variant={variant} />
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
        </>
      )}
    </section>
  );
}

export default function FriendsPage() {
  const { data } = useSWR("invitationUsers", getFriendSuggestions);

  return (
    <ScrollArea className="h-full py-8">
      <div className="px-4 space-y-8">
        <UserSection
          title="Followers (Follow You)"
          subtitle="These people are already following you. Follow them back to connect."
          users={data?.followers || []}
          variant="followers"
        />

        <UserSection
          title="People You May Know"
          subtitle="Suggested profiles you might want to connect with."
          users={data?.suggestions || []}
          variant="suggestions"
        />

        <UserSection
          title="Following"
          subtitle="People whose updates you’re currently following."
          users={data?.following || []}
          variant="following"
        />

        <UserSection
          title="Mutual Friends"
          subtitle="You follow each other — your closest connections."
          users={data?.mutualFriends || []}
          variant="mutual"
        />

        <div className="h-[90px]" />
      </div>
    </ScrollArea>
  );
}
