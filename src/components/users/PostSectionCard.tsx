"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { GetFriendSuggestionsResult } from "@/types/follow.type";
import FriendRow from "../shared/FriendRow";
import { addOrUnFollowById } from "@/actions/follow.actions";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import { notify } from "@/actions/notify.action";
import { useProfile } from "@/services/user.hook";
import { searchPost } from "@/services/post.service";
import type { Post } from "@/types/post.type";
import PostCard from "../shared/PostCard/PostCard";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

type Props = {
  friend?: GetFriendSuggestionsResult;
  notMe?: boolean;
  user_id?: string;
};

export default function PostSectionCard({
  friend,
  notMe = false,
  user_id,
}: Props) {
  const { data: currentUser } = useProfile();
  // ===================== PAGINATION =====================
  const [page, setPage] = useState(0);
  const limit = 5;

  const {
    data: posts,
    isLoading,
    mutate: mutatePost,
  } = useSWR<Post[]>(
    ["posts-section", notMe, page, user_id],
    async () => {
      const res = await searchPost({
        q: "",
        limit,
        start: page * limit,
        userId: notMe ? user_id : undefined,
        onlyMe: !notMe,
      });
      return res;
    },
    { revalidateOnFocus: false }
  );

  const [allPosts, setAllPosts] = useState<Post[]>([]);

  // ---------- FIX: append posts đúng cách ----------
  useEffect(() => {
    if (posts && posts.length > 0) {
      setAllPosts((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        const filtered = posts.filter((p) => !ids.has(p.id));
        return [...prev, ...filtered];
      });
    }
  }, [posts]);
  // ----------------------------------------------------

  const isLoadMore = posts && posts.length === limit;

  // ===================== FRIEND LIST =====================
  const mutualFriends = friend?.mutualFriends ?? [];
  const followersOnly = friend?.followers ?? [];
  const followingOnly = friend?.following ?? [];

  const followersList = [...mutualFriends, ...followersOnly];
  const followingList = [...mutualFriends, ...followingOnly];

  const isMutual = (userId: string) =>
    mutualFriends.some((u) => u.user_id === userId);

  // ===================== FOLLOW / UNFOLLOW =====================
  const handleFollow = (
    user_id: string,
    variant: "followers" | "following" | "mutual" | "suggest"
  ) => {
    const followPromise = addOrUnFollowById(user_id).then(async (err) => {
      if (!err) {
        let successMessage = "Thao tác thành công";

        switch (variant) {
          case "followers":
            successMessage = "Bạn đã follow back";
            break;
          case "following":
            successMessage = "Bạn đã unfollow người này";
            break;
          case "mutual":
            successMessage = "Đã cập nhật kết nối";
            break;
        }

        if (variant !== "following") {
          await notify({
            title: "Ai đó đã theo dõi bạn",
            message: `${currentUser?.username} đã theo dõi bạn`,
            type: "follow",
            userId: user_id,
            entityType: "user",
            entityId: currentUser?.user_id,
          });
        }

        await mutate("invitationUsers");
        return successMessage;
      } else {
        throw new Error("Đã xảy ra lỗi, vui lòng thử lại.");
      }
    });

    toast.promise(followPromise, {
      loading: "Đang xử lý...",
      success: (msg) => msg,
      error: (err) => err.message || "Đã xảy ra lỗi",

      className:
        variant === "following"
          ? "bg-red-600 text-white"
          : variant === "followers"
          ? "bg-blue-600 text-white"
          : "bg-primary text-white",
    });
  };

  return (
    <Card className="shadow-lg py-0 overflow-hidden border-0 bg-linear-to-br from-background via-background to-muted/20 backdrop-blur-sm rounded-t-none">
      <CardContent className="p-0">
        <Tabs defaultValue="followers" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-none border-b h-auto p-0 backdrop-blur-sm bg-transparent">
            <TabsTrigger
              value="followers"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 py-3 text-xs sm:text-sm"
            >
              Followers ({followersList.length})
            </TabsTrigger>

            <TabsTrigger
              value="following"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:text-purple-600 py-3 text-xs sm:text-sm"
            >
              Following ({followingList.length})
            </TabsTrigger>

            <TabsTrigger
              value="posts"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:text-pink-600 py-3 text-xs sm:text-sm"
            >
              Posts
            </TabsTrigger>
          </TabsList>

          {/* ========================= POSTS ========================= */}
          <TabsContent value="posts" className="p-6 flex flex-col gap-6">
            {isLoading && page === 0 && (
              <div className="text-sm text-muted-foreground">Đang tải...</div>
            )}

            {!isLoading && allPosts.length === 0 && (
              <div className="text-sm text-muted-foreground text-center">
                Chưa có bài viết nào.
              </div>
            )}

            {allPosts.map((post) => (
              <PostCard
                notPageFeed={true}
                mutatePost={async () => {
                  mutatePost();
                }}
                post={post}
                key={post.id}
              />
            ))}

            {/* LOAD MORE */}
            {isLoadMore && (
              <Button
                className="mx-auto mt-2"
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
              >
                Xem thêm
              </Button>
            )}

            {isLoading && page > 0 && (
              <div className="text-center text-xs text-muted-foreground">
                Đang tải thêm...
              </div>
            )}
          </TabsContent>

          {/* ========================= FOLLOWERS ========================= */}
          <TabsContent value="followers" className="p-6">
            {followersList.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-8">
                Chưa có ai follow bạn.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {followersList.map((item) => (
                  <FriendRow
                    item={item}
                    key={item.user_id}
                    variant={isMutual(item.user_id) ? "mutual" : "followers"}
                    onAction={handleFollow}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ========================= FOLLOWING ========================= */}
          <TabsContent value="following" className="p-6">
            {followingList.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-8">
                Bạn chưa follow ai.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {followingList.map((item) => (
                  <FriendRow
                    item={item}
                    key={item.user_id}
                    variant={isMutual(item.user_id) ? "mutual" : "following"}
                    onAction={handleFollow}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
