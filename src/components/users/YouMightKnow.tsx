"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { GetFriendSuggestionsResult } from "@/types/follow.type";
import FriendRow from "../shared/FriendRow";
import { addOrUnFollowById } from "@/actions/follow.actions";
import { toast } from "sonner";
import { mutate } from "swr";

type Props = {
  friend?: GetFriendSuggestionsResult;
};

export default function YouMightKnow({ friend }: Props) {
  const suggestions = friend?.suggestions ?? [];

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

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-background via-background to-muted/20 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500 rounded-full" />
            Gợi ý kết nối
          </h3>
          {suggestions.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {suggestions.length} gợi ý
            </span>
          )}
        </div>

        {suggestions.length === 0 ? (
          <div className="py-6 text-sm text-muted-foreground text-center">
            Hiện chưa có gợi ý kết nối nào.
          </div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((item) => (
              <FriendRow
                item={item}
                variant="suggest"
                onAction={handleFollow}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
