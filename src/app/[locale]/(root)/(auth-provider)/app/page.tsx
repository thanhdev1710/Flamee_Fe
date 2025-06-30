"use client";
import HeaderApp from "@/layouts/HeaderApp";
import AsideMenuApp from "@/layouts/AsideMenuApp";
import MobileSearch from "@/components/shared/MobileSearch";
import Stories from "@/components/shared/Stories";
import AsideFriendApp from "@/layouts/AsideFriendApp";
import SectionPost from "@/layouts/SectionPost";

import { useRef } from "react";

export default function Dashboard() {
  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <div className="max-h-screen h-screen overflow-hidden">
      <HeaderApp />

      <div className="flex h-full">
        {/* Sidebar */}
        <AsideMenuApp />

        {/* Main Content */}
        <main
          ref={mainRef}
          className="relative flex-1 lg:flex lg:gap-16 p-2 sm:p-4 lg:p-6 justify-center w-full h-full overflow-auto  [&::-webkit-scrollbar]:w-1.5
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-400"
        >
          {/* Center Content */}
          <div className="flex-1 max-w-2xl mx-auto lg:mx-0">
            {/* Mobile Search */}
            <MobileSearch />

            {/* Stories */}
            <Stories />

            {/* Recent Post */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent post</h2>
              <h2 className="text-lg font-semibold">Feed</h2>
            </div>

            <SectionPost scrollRef={mainRef} />

            <div className="h-[90px]"></div>
          </div>

          {/* Right Sidebar - Friends */}
          <AsideFriendApp />
        </main>
      </div>
    </div>
  );
}
