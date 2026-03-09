"use client";

import { Card, CardContent } from "../../ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonPostCard() {
  return (
    <Card className="h-full">
      <CardContent className="h-full flex flex-col gap-4">
        {/* Header: Avatar + Info + More Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>

        {/* Ảnh đại diện bài viết */}
        <Skeleton className="mb-4 h-full w-full rounded-md" />

        {/* Nội dung text mô phỏng */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>

        {/* Các nút tương tác */}
        <div className="flex gap-4">
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
