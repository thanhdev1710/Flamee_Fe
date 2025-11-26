"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Search } from "lucide-react";
import useSWR from "swr";

import { useProfile } from "@/services/user.hook";
import { getFriendSuggestions } from "@/services/follow.service";
import { getChatSocket } from "@/lib/chatSocket";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4004";

type MutualFriend = {
  user_id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar_url?: string | null;
  // OPTIONAL: nếu API mutualFriends đã trả sẵn 2 field này
  is_online?: boolean;
  last_seen?: string | null;
};

type PresenceInfo = {
  isOnline: boolean;
  lastSeen?: string | null;
};

type PresenceMap = Record<string, PresenceInfo>;

function formatLastSeen(lastSeen?: string | null) {
  if (!lastSeen) return "";
  const last = new Date(lastSeen).getTime();
  const now = Date.now();
  const diffMs = now - last;

  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} giờ trước`;

  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} ngày trước`;
}

export default function AsideFriendApp() {
  const { data: profile } = useProfile();
  const [search, setSearch] = useState("");

  // 1) Chỉ lấy MUTUAL FRIENDS
  const { data: friendData, isLoading } = useSWR(
    "friend-suggestions",
    getFriendSuggestions,
    { revalidateOnFocus: false }
  );

  const mutualFriends: MutualFriend[] = useMemo(() => {
    if (!friendData?.mutualFriends) return [];
    return friendData.mutualFriends as MutualFriend[];
  }, [friendData]);

  // 2) Map trạng thái presence
  const [presence, setPresence] = useState<PresenceMap>({});

  // Khởi tạo presence từ DB (is_online / last_seen nếu API có trả)
  useEffect(() => {
    if (!mutualFriends.length) return;

    setPresence((prev) => {
      const next: PresenceMap = { ...prev };
      for (const f of mutualFriends) {
        if (!next[f.user_id]) {
          if (f.is_online !== undefined || f.last_seen) {
            next[f.user_id] = {
              isOnline: !!f.is_online,
              lastSeen: f.last_seen ?? null,
            };
          }
        }
      }
      return next;
    });
  }, [mutualFriends]);

  // 3) Lắng nghe realtime:
  //  - "presence-init" → snapshot danh sách đang online khi mình login
  //  - "user-presence"  → broadcast mỗi lần user online/offline
  useEffect(() => {
    if (!profile?.user_id) return;

    const userId = String(profile.user_id);
    const socket = getChatSocket(userId, SOCKET_URL);

    const handleUserPresence = (data: {
      userId: string | number;
      isOnline: boolean;
      lastSeen?: string | null;
    }) => {
      setPresence((prev) => ({
        ...prev,
        [String(data.userId)]: {
          isOnline: data.isOnline,
          lastSeen: data.lastSeen ?? null,
        },
      }));
    };

    const handlePresenceInit = (
      list: {
        userId: string | number;
        isOnline: boolean;
        lastSeen?: string | null;
      }[]
    ) => {
      setPresence((prev) => {
        const next: PresenceMap = { ...prev };
        for (const u of list) {
          next[String(u.userId)] = {
            isOnline: u.isOnline,
            lastSeen: u.lastSeen ?? null,
          };
        }
        return next;
      });
    };

    socket.on("user-presence", handleUserPresence);
    socket.on("presence-init", handlePresenceInit);

    return () => {
      socket.off("user-presence", handleUserPresence);
      socket.off("presence-init", handlePresenceInit);
      // KHÔNG disconnect ở đây, HeaderApp đang giữ socket global
    };
  }, [profile?.user_id]);

  // 4) Lọc theo search + sắp xếp Online trước
  const filteredFriends = useMemo(() => {
    const list = mutualFriends.filter((f) => {
      const displayName =
        `${f.lastName || ""} ${f.firstName || ""}`.trim() || f.username;
      return displayName.toLowerCase().includes(search.toLowerCase());
    });

    return list.sort((a, b) => {
      const aOnline = presence[a.user_id]?.isOnline ? 1 : a.is_online ? 1 : 0;
      const bOnline = presence[b.user_id]?.isOnline ? 1 : b.is_online ? 1 : 0;
      return bOnline - aOnline; // Online lên trước
    });
  }, [mutualFriends, presence, search]);

  return (
    <aside className="hidden xl:block w-80 sticky top-0">
      <Card>
        <CardContent className="p-4">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search"
                className="pl-10 border-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <h3 className="font-semibold mb-4">Mutual Friends</h3>

          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-700" />
                    <div className="space-y-2">
                      <div className="h-3 w-24 bg-gray-700 rounded" />
                      <div className="h-2 w-16 bg-gray-800 rounded" />
                    </div>
                  </div>
                  <div className="h-2 w-12 bg-gray-800 rounded" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredFriends.length === 0 && (
            <p className="text-xs text-gray-500">Chưa có bạn chung nào.</p>
          )}

          {!isLoading && filteredFriends.length > 0 && (
            <div className="space-y-3">
              {filteredFriends.map((friend) => {
                const p = presence[friend.user_id];
                const isOnline = p?.isOnline ?? !!friend.is_online;
                const lastSeen = p?.lastSeen ?? friend.last_seen ?? null;

                const dotColor = isOnline ? "bg-green-500" : "bg-gray-400";
                const statusText = isOnline ? "Online" : "Offline";
                const timeText =
                  !isOnline && lastSeen ? formatLastSeen(lastSeen) : "";

                const displayName =
                  `${friend.lastName || ""} ${friend.firstName || ""}`.trim() ||
                  friend.username;

                return (
                  <div
                    key={friend.user_id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={
                              friend.avatar_url ||
                              "/placeholder.svg?height=40&width=40"
                            }
                          />
                          <AvatarFallback>
                            {displayName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${dotColor}`}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{displayName}</div>
                        <div className="text-xs text-gray-500">
                          {statusText}
                        </div>
                      </div>
                    </div>
                    {timeText && (
                      <div className="text-xs text-gray-400">{timeText}</div>
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
