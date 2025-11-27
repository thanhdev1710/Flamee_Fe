"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Search } from "lucide-react";
import useSWR from "swr";

import { usePresenceStore } from "@/store/presenceStore";
import { getFriendSuggestions } from "@/services/follow.service";

function formatLastSeen(lastSeen?: string | null) {
  if (!lastSeen) return "";
  const diff = Date.now() - new Date(lastSeen).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "vừa xong";
  if (min < 60) return `${min} phút trước`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} giờ trước`;
  const d = Math.floor(h / 24);
  return `${d} ngày trước`;
}

export default function AsideFriendApp() {
  const presence = usePresenceStore((s) => s.presence);

  const [search, setSearch] = useState("");

  const { data: friendData, isLoading } = useSWR(
    "friend-suggestions",
    getFriendSuggestions,
    { revalidateOnFocus: false }
  );

  // Lọc + sắp xếp online trước
  const filteredFriends = useMemo(() => {
    return (friendData?.mutualFriends || [])
      .filter((f) => {
        const name =
          `${f.lastName || ""} ${f.firstName || ""}`.trim() || f.username;
        return name.toLowerCase().includes(search.toLowerCase());
      })
      .sort((a, b) => {
        const A = presence[a.user_id]?.isOnline ? 1 : 0;
        const B = presence[b.user_id]?.isOnline ? 1 : 0;
        return B - A;
      });
  }, [friendData?.mutualFriends, presence, search]);

  return (
    <aside className="hidden xl:block w-80 sticky top-0">
      <Card>
        <CardContent className="p-4">
          {/* Search */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search"
              className="pl-10 border-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <h3 className="font-semibold mb-4">Mutual Friends</h3>

          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-700 rounded-full" />
                    <div>
                      <div className="h-3 w-24 bg-gray-700 rounded" />
                      <div className="h-2 w-16 mt-2 bg-gray-800 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredFriends.length === 0 && (
            <p className="text-xs text-gray-500">Chưa có bạn chung nào.</p>
          )}

          {!isLoading && filteredFriends.length > 0 && (
            <div className="space-y-3">
              {filteredFriends.map((f) => {
                const p = presence[f.user_id];
                const isOnline = p?.isOnline;
                const lastSeen = p?.lastSeen;

                const displayName =
                  `${f.lastName || ""} ${f.firstName || ""}`.trim() ||
                  f.username;

                return (
                  <div
                    key={f.user_id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={f.avatar_url || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {displayName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            isOnline ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                      </div>

                      <div>
                        <div className="font-medium text-sm">{displayName}</div>
                        <div className="text-xs text-gray-500">
                          {isOnline ? "Online" : "Offline"}
                        </div>
                      </div>
                    </div>

                    {!isOnline && lastSeen && (
                      <div className="text-xs text-gray-400">
                        {formatLastSeen(lastSeen)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}
