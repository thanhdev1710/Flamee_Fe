"use client";

import PostCard from "@/components/shared/PostCard/PostCard";
import useSWRInfinite from "swr/infinite";
import { useEffect } from "react";
import { PAGE_SIZE } from "@/global/base";
import SkeletonPostCard from "@/components/shared/PostCard/SkeletonPostCard";
import { Post } from "@/types/post.type";
import { CONFIG } from "@/global/config";
import useSWR from "swr";
import { getFriendSuggestions } from "@/services/follow.service";

interface SectionPostProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export default function SectionPost({ scrollRef }: SectionPostProps) {
  const { data: friendData } = useSWR(
    "friend-suggestions",
    getFriendSuggestions
  );

  // 🔥 CHƯA CÓ friendData → chưa gọi API hot feed
  const shouldLoadHotFeed = !!friendData;

  const followingIds = shouldLoadHotFeed
    ? friendData.following.map((u) => u.user_id).join(",")
    : "";

  const friendIds = shouldLoadHotFeed
    ? [
        ...friendData.mutualFriends.map((u) => u.user_id),
        ...friendData.followers.map((u) => u.user_id),
      ].join(",")
    : "";

  const { data, setSize, isValidating, error, mutate } = useSWRInfinite<Post[]>(
    (pageIndex, previousPageData) => {
      if (!shouldLoadHotFeed) return null; // 🚀 chờ dữ liệu

      if (previousPageData && previousPageData.length < PAGE_SIZE) return null;

      const start = pageIndex * PAGE_SIZE;

      return (
        `${CONFIG.API.BASE_URL}${CONFIG.API.VERSION}/search/hot` +
        `?start=${start}` +
        `&limit=${PAGE_SIZE}` +
        `&following=${followingIds}` +
        `&friends=${friendIds}`
      );
    },
    (url) =>
      fetch(url, {
        credentials: "include",
        headers: {
          "X-API-KEY": CONFIG.API.X_API_KEY,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => data.items)
  );

  const posts = data ? data.flat() : [];
  const hasMore = data ? data[data.length - 1]?.length === PAGE_SIZE : true;

  // Infinite scroll dựa trên scrollRef
  useEffect(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;

    const onScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = container;
      const distanceToBottom = scrollHeight - (scrollTop + clientHeight);

      if (distanceToBottom < 400 && hasMore && !isValidating) {
        setSize((s) => s + 1);
      }
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [scrollRef, hasMore, isValidating, setSize]);

  if (!friendData) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonPostCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        Lỗi tải dữ liệu: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          mutatePost={async () => {
            await mutate();
          }}
        />
      ))}

      {isValidating && (
        <div className="py-4 text-center text-sm text-muted-foreground">
          Đang tải thêm...
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="py-4 text-center text-xs text-muted-foreground">
          Hết bài viết rồi
        </div>
      )}
    </div>
  );
}
