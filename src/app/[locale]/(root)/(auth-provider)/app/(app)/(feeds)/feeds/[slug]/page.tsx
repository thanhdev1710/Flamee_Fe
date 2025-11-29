"use client";

import { use } from "react";
import PostCardDetail from "@/components/shared/PostCard/PostCardDetail";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInteractions, usePostDetail } from "@/services/post.hook";

export default function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: post, mutate: mutatePost } = usePostDetail(slug);
  const { data: interactions, mutate: mutateInteractions } =
    useInteractions(slug);

  const mutateAll = async () => {
    await mutatePost(undefined, { revalidate: true });
    await mutateInteractions(undefined, { revalidate: true });
  };

  if (!post) return null;

  return (
    <div className="min-h-svh px-3">
      <div className="w-full h-[85vh] rounded-xl overflow-hidden mt-3">
        <ScrollArea className="w-full h-full">
          <PostCardDetail
            post={post}
            interactions={interactions}
            mutateAll={mutateAll}
            openComment={true}
          />
        </ScrollArea>
      </div>
    </div>
  );
}
