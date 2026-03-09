"use client";
import MobileSearch from "@/components/shared/MobileSearch";
import AsideFriendApp from "@/layouts/AsideFriendApp";
import SectionPost from "@/layouts/SectionPost";

import { useRef } from "react";

export default function Feeds() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-full">
      <div
        ref={scrollRef}
        className="relative flex-1 lg:flex lg:gap-16 padding-flame justify-center w-full h-full overflow-auto  
    [&::-webkit-scrollbar]:w-0.5
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-track]:bg-background
  [&::-webkit-scrollbar-thumb]:bg-gray-400"
      >
        {/* Center Content */}
        <div className="flex-1 max-w-2xl mx-auto lg:mx-0">
          {/* Mobile Search */}
          <MobileSearch />

          {/* Stories */}
          {/* <Stories /> */}

          {/* Recent Post */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent post</h2>
            <h2 className="text-lg font-semibold">Feed</h2>
          </div>

          <SectionPost scrollRef={scrollRef} />

          <div className="h-[90px]"></div>
        </div>

        {/* Right Sidebar - Friends */}
        <AsideFriendApp />
      </div>
    </div>
  );
}
