"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import AsideMessageApp from "@/layouts/AsideMessageApp";
import MainMessage from "@/layouts/MainMessage";
import AsideDirectoryPanel from "@/layouts/AsideDirectoryPanel";

// Hàm getMe lấy user hiện tại
async function getMe() {
  try {
    const response = await fetch("/api/auth/me");
    if (!response.ok) return {};
    return await response.json();
  } catch {
    return {};
  }
}

// SWR fetcher
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conv") || "";

  // Lấy user hiện tại bằng API /api/auth/me
  const { data: meData, isLoading: meLoading } = useSWR("me", getMe);

  // Lấy userId từ token hoặc query ?me=
  const userIdFromToken = meData?.user?.sub || "";
  const userId = searchParams.get("me") || userIdFromToken || "";

  // Base URL cho API và Socket (GIỮ NGUYÊN URL)
  const apiBase =
    process.env.NEXT_PUBLIC_CHAT_API || "http://localhost:4004/api/v1/chat";
  const socketUrl =
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4004";

  if (meLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="text-center space-y-2">
          <p className="text-sm text-slate-400">
            Đang tải thông tin người dùng...
          </p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="text-center space-y-2">
          <p className="text-sm text-slate-400">
            Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại để tiếp
            tục.
          </p>
        </div>
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950">
        {/* Sidebar Trái */}
        <AsideMessageApp currentUserId={userId} />

        {/* Khu vực chính hiển thị hướng dẫn chọn đoạn chat */}
        <div className="flex-1 min-w-0 flex items-center justify-center border-l border-slate-200 dark:border-slate-800">
          <div className="max-w-md text-center">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Chọn một đoạn hội thoại
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Hãy chọn một cuộc trò chuyện ở bên trái để bắt đầu nhắn tin.
            </p>
          </div>
        </div>

        {/* Sidebar Phải (Directory) */}
        <AsideDirectoryPanel currentUserId={userId} />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950">
      {/* Sidebar Trái */}
      <AsideMessageApp currentUserId={userId} />

      {/* Chat Chính */}
      <main className="flex-1 min-w-0 border-r border-slate-200 dark:border-slate-800">
        <MainMessage
          apiBase={apiBase}
          socketUrl={socketUrl}
          conversationId={conversationId}
          userId={userId}
        />
      </main>

      {/* Sidebar Phải (Directory) */}
      <AsideDirectoryPanel currentUserId={userId} />
    </div>
  );
}
import { formatLastSeen } from "@/utils/time";
