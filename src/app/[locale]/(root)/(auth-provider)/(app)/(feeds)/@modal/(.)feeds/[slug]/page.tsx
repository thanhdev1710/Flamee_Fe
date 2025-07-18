"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { use, useState } from "react";
import PostCardDetail from "@/components/shared/PostCard/PostCardDetail";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PostModalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const post = {
    id: 123,
    title: decodeURIComponent(slug.replaceAll("-", " ")),
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis finibus.",
    userId: 42,
  };

  const handleClose = () => {
    setOpen(false);
    router.back();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="p-0 max-w-xl w-full">
        <ScrollArea className="max-h-[80vh]">
          <DialogTitle className="text-xl font-semibold px-6 pt-6">
            Post Details
          </DialogTitle>
          <PostCardDetail {...post} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
