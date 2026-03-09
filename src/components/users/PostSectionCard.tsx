"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { GetFriendSuggestionsResult } from "@/types/follow.type";
import FriendRow from "../shared/FriendRow";
import { addOrUnFollowById } from "@/actions/follow.actions";
import { toast } from "sonner";

import useSWR from "swr";

import { notify } from "@/actions/notify.action";
import { useProfile } from "@/services/user.hook";
import { searchPost } from "@/services/post.service";
import PostCard from "../shared/PostCard/PostCard";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { keySWRPost } from "@/services/post.hook";

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
  const limit = 5;
  const { data: currentUser } = useProfile();
  // ===================== SEARCH =====================
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 350);

    return () => clearTimeout(t);
  }, [search]);

  // ===================== PAGINATION =====================
  const [page, setPage] = useState(0);

  const { data, isLoading, mutate } = useSWR(
    [keySWRPost.list, notMe, user_id, debouncedSearch, page],
    () =>
      searchPost({
        q: debouncedSearch || undefined,
        limit,
        start: page * limit,
        userId: notMe ? user_id : undefined,
        onlyMe: !notMe,
      }),
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      revalidateIfStale: true,
      revalidateOnReconnect: true,
    }
  );

  const posts = data?.items ?? [];
  const total = data?.total ?? 0;
  const isLoadMore = (page + 1) * limit < total;

  // Khi xoá — reset về page 0 + fetch lại
  const refreshPosts = async () => {
    await mutate(undefined, { revalidate: true });
  };

  // ===================== FOLLOW =====================
  const mutual = friend?.mutualFriends ?? [];
  const followersOnly = friend?.followers ?? [];
  const followingOnly = friend?.following ?? [];

  const followersList = [...mutual, ...followersOnly];
  const followingList = [...mutual, ...followingOnly];

  const isMutual = (uid: string) => mutual.some((u) => u.user_id === uid);

  const handleFollow = (
    uid: string,
    variant: "followers" | "following" | "mutual" | "suggest"
  ) => {
    const promise = addOrUnFollowById(uid).then(async (err) => {
      if (err) throw new Error("Đã xảy ra lỗi.");

      if (variant !== "following") {
        await notify({
          title: "Ai đó đã theo dõi bạn",
          message: `${currentUser?.username} đã theo dõi bạn`,
          type: "follow",
          userId: uid,
          entityType: "user",
          entityId: currentUser?.user_id,
        });
      }

      return "Thành công!";
    });

    toast.promise(promise, {
      loading: "Đang xử lý...",
      success: (msg) => msg,
      error: (err) => err.message,
    });
  };

  // ===================== UI =====================
  return (
    <Card className="shadow-lg py-0 overflow-hidden border-0 bg-linear-to-br from-background via-background to-muted/20 backdrop-blur-sm rounded-t-none">
      <CardContent className="p-0">
        <Tabs defaultValue="followers" className="w-full">
          {/* Tabs Header */}
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
            {/* Search */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm pb-3">
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 bg-muted/40 border rounded-xl text-sm"
              />
            </div>

            {isLoading && page === 0 && (
              <div className="text-sm text-muted-foreground">Đang tải...</div>
            )}

            {!isLoading && posts.length === 0 && (
              <div className="text-sm text-center text-muted-foreground">
                Không tìm thấy bài viết.
              </div>
            )}

            {/* Render posts */}
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                notPageFeed
                refreshPosts={refreshPosts}
              />
            ))}

            {/* Load more */}
            {isLoadMore && (
              <Button
                variant="outline"
                className="mx-auto mt-2"
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
              <div className="text-center text-sm text-muted-foreground">
                Chưa có ai follow bạn.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {followersList.map((item) => (
                  <FriendRow
                    key={item.user_id}
                    item={item}
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
              <div className="text-center text-sm text-muted-foreground">
                Bạn chưa follow ai.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {followingList.map((item) => (
                  <FriendRow
                    key={item.user_id}
                    item={item}
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
