import React from "react";
import { Card, CardContent } from "../ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function Stories() {
  const stories = [
    {
      name: "Chi Thanh3 123 12321 31222222222",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    { name: "Phùng Phong", avatar: "/placeholder.svg?height=80&width=80" },
    { name: "Lavern Laboy", avatar: "/placeholder.svg?height=80&width=80" },
    { name: "Geoffrey Mott", avatar: "/placeholder.svg?height=80&width=80" },
    { name: "Geoffrey Mott1", avatar: "/placeholder.svg?height=80&width=80" },
    { name: "Geoffrey Mott2", avatar: "/placeholder.svg?height=80&width=80" },
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Stories</h2>
        <ScrollArea className="w-full overflow-x-auto">
          <div className="flex gap-4 pb-6">
            {stories.map((story, index) => (
              <div key={index} className="flex-shrink-0">
                <div className="relative">
                  <div className="lg:h-52 h-36 aspect-[2/3] rounded-lg border-2 border-flamee-primary"></div>
                  <p className="text-xs mt-2 max-w-[80%] truncate absolute bottom-2 left-2">
                    {story.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
