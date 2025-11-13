"use client";

import { use } from "react";
import PostCardDetail from "@/components/shared/PostCard/PostCardDetail";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPostById } from "@/services/post.service";
import useSWR from "swr";

export default function PostModalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: post } = useSWR(slug, getPostById);

  if (!post) {
    return;
  }

  return (
    <div className="p-3">
      <ScrollArea className="h-full">
        <PostCardDetail post={post} />
      </ScrollArea>
    </div>
  );
}
