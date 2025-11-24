"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GetFriendSuggestionsResult } from "@/types/follow.type";
import FriendRow from "../shared/FriendRow";
import { addOrUnFollowById } from "@/actions/follow.actions";
import { toast } from "sonner";
import { mutate } from "swr";

type Props = {
  friend?: GetFriendSuggestionsResult;
  notMe?: boolean;
};

export default function PostSectionCard({ friend, notMe = false }: Props) {
  // Nếu chưa có dữ liệu thì coi như mảng rỗng
  const mutualFriends = friend?.mutualFriends ?? [];
  const followersOnly = friend?.followers ?? [];
  const followingOnly = friend?.following ?? [];

  // Followers tab: bạn chung + những người chỉ follow mình
  const followersList = [...mutualFriends, ...followersOnly];

  // Following tab: bạn chung + những người mình chỉ follow
  const followingList = [...mutualFriends, ...followingOnly];

  const isMutual = (userId: string) =>
    mutualFriends.some((u) => u.user_id === userId);

  const handleFollow = (user_id: string) => {
    const followPromise = addOrUnFollowById(user_id).then(async (err) => {
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

  console.log(notMe);

  return (
    <Card className="shadow-lg py-0 overflow-hidden border-0 bg-gradient-to-br from-background via-background to-muted/20 backdrop-blur-sm rounded-t-none">
      <CardContent className="p-0">
        <Tabs defaultValue="followers" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-none border-b bg-transparent h-auto p-0 backdrop-blur-sm">
            <TabsTrigger
              value="followers"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 py-3 text-xs sm:text-sm transition-all duration-200"
            >
              Followers ({followersList.length})
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 py-3 text-xs sm:text-sm transition-all duration-200"
            >
              Following ({followingList.length})
            </TabsTrigger>
            <TabsTrigger
              value="posts"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:bg-pink-500/10 data-[state=active]:text-pink-600 dark:data-[state=active]:text-pink-400 py-3 text-xs sm:text-sm transition-all duration-200"
            >
              Posts
            </TabsTrigger>
          </TabsList>

          {/* POSTS – tạm để trống */}
          <TabsContent value="posts" className="p-6 flex flex-col gap-6">
            {/* Render post sau */}
          </TabsContent>

          {/* FOLLOWERS */}
          <TabsContent value="followers" className="p-6">
            {followersList.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
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

          {/* FOLLOWING */}
          <TabsContent value="following" className="p-6">
            {followingList.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
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
