"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { getNotification } from "@/services/notify.service";
import { Heart, MessageCircle, UserPlus, Bell, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import clsx from "clsx";
import { notifyReadAll, notifyReadOne } from "@/actions/notify.action";
import { Notification, NotificationType } from "@/types/notify.type";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

import { Button } from "@/components/ui/button";

// 1. Icon Mapping: Hiển thị icon dựa trên loại thông báo
const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case "like":
      return (
        <div className="p-2 bg-red-500/10 text-red-500 rounded-full">
          <Heart size={18} fill="currentColor" />
        </div>
      );
    case "comment":
      return (
        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-full">
          <MessageCircle size={18} />
        </div>
      );
    case "follow":
      return (
        <div className="p-2 bg-green-500/10 text-green-500 rounded-full">
          <UserPlus size={18} />
        </div>
      );
    case "share":
      return (
        <div className="p-2 bg-purple-500/10 text-purple-500 rounded-full">
          <Share2 size={18} />
        </div>
      );
    case "system":
    default:
      return (
        <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-full">
          <Bell size={18} />
        </div>
      );
  }
};

// --- Main Component ---
export default function Notifications() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const limit = 20;

  // Fetch data
  const { data, isLoading, mutate } = useSWR<Notification[]>(
    ["notification", page, activeTab],
    () => getNotification(page, activeTab === "unread"),
    { revalidateOnFocus: false }
  );

  // Logic tích lũy data (để làm tính năng Load More mượt mà hơn)
  // Lưu ý: Trong thực tế bạn nên dùng useSWRInfinite, ở đây tôi demo UI dựa trên logic cũ của bạn
  const [displayList, setDisplayList] = useState<Notification[]>([]);

  useEffect(() => {
    if (data) {
      if (page === 1) setDisplayList(data);
      else setDisplayList((prev) => [...prev, ...data]);
    }
  }, [data, page]);

  const handleLoadMore = () => setPage((prev) => prev + 1);
  const hasMore = data && data.length === limit;

  // Helper format time (e.g., "2 giờ trước")
  const getTimeAgo = (date?: Date) => {
    if (!date) return "";
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
  };

  return (
    <ScrollArea className="w-full overflow-hidden flex flex-col h-[700px]">
      {/* --- Header --- */}
      <div className="px-5 py-4 ">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Thông báo</h2>

          <Button
            onClick={async () => {
              await mutate((cur) => cur?.map((c) => ({ ...c, isRead: true })), {
                revalidate: false,
              });
              await notifyReadAll();
            }}
            variant="outline"
            className="cursor-pointer"
          >
            Đọc hết
          </Button>
        </div>

        {/* Tabs UI dạng Pills */}
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("all")}
            className={clsx(
              "px-4 py-1.5 text-sm font-medium rounded-full transition-colors",
              activeTab === "all" ? "bg-blue-600 text-white" : ""
            )}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={clsx(
              "px-4 py-1.5 text-sm font-medium rounded-full transition-colors",
              activeTab === "unread" ? "bg-blue-600 text-white" : ""
            )}
          >
            Chưa đọc
          </button>
        </div>
      </div>

      {/* --- Content List --- */}
      <div className="flex-1">
        {displayList.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Bell size={48} className="mb-4 opacity-20" />
            <p className="text-sm">Bạn chưa có thông báo nào.</p>
          </div>
        ) : (
          <div>
            {displayList.map((n, index) => (
              <Link
                href={
                  n.entityType === "post" ? `/app/feeds/${n.entityId}` : "#"
                }
                target="_blank"
                rel="noopener noreferrer"
                key={`${n.userId}-${index}`}
                onClick={async () => {
                  if (!n.isRead) {
                    await mutate(
                      (cur) =>
                        cur?.map((c) =>
                          c._id === n._id ? { ...c, isRead: true } : c
                        ),
                      { revalidate: false }
                    );
                    await notifyReadOne(n._id!);
                  }
                }}
                className={clsx(
                  "group flex gap-4 px-5 py-4 cursor-pointer relative",
                  !n.isRead && "bg-blue-50/50 dark:bg-blue-900/10"
                )}
              >
                {/* Icon Column */}
                <div className="shrink-0 mt-1">
                  <NotificationIcon type={n.type} />
                </div>

                {/* Content Column */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-semibold truncate pr-4">
                      {n.title}
                    </p>
                    {/* Time */}
                    <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                      {getTimeAgo(n.createdAt)}
                    </span>
                  </div>

                  <p
                    className={clsx(
                      "text-sm line-clamp-2",
                      !n.isRead ? "font-medium" : ""
                    )}
                  >
                    {n.message}
                  </p>

                  {/* Action Footer (Optional) */}
                  {!n.isRead && (
                    <div className="pt-1 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-medium">
                        Mới
                      </span>
                    </div>
                  )}
                </div>

                {/* Unread Indicator Dot */}
                {!n.isRead && (
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full shadow-lg shadow-blue-500/50"></div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Loading / Load More */}
        <div className="p-4 text-center">
          {isLoading ? (
            <span className="text-xs animate-pulse">Đang tải thêm...</span>
          ) : hasMore ? (
            <button
              onClick={handleLoadMore}
              className="text-xs font-medium hover:underline"
            >
              Xem thông báo cũ hơn
            </button>
          ) : null}
        </div>
      </div>
      <div className="h-[100px]"></div>
    </ScrollArea>
  );
}
