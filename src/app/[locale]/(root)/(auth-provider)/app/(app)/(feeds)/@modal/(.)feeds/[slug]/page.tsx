"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { use, useState } from "react";
import PostCardDetail from "@/components/shared/PostCard/PostCardDetail";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInteractions, usePostDetail } from "@/services/post.hook";

export default function PostModalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: post } = usePostDetail(slug);
  const { data: interactions } = useInteractions(slug);

  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    router.back();
  };

  if (!post) {
    return null;
  }

  return (
    <>
      <Dialog
        modal={false}
        open={open}
        onOpenChange={(isOpen) => !isOpen && handleClose()}
      >
        <DialogContent className="p-0 max-w-xl w-full overflow-hidden rounded-2xl">
          <DialogTitle className="sr-only">Post Details</DialogTitle>
          <ScrollArea className="max-h-[80vh] z-10">
            <PostCardDetail post={post} interactions={interactions} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <div className="w-full h-full bg-background/70 fixed top-0 left-0 z-50"></div>
    </>
  );
}
