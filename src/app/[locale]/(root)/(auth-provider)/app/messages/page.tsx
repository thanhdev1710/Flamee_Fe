"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import AsideMessageApp from "@/layouts/AsideMessageApp";
import MainMessage from "@/layouts/MainMessage";
import AsideDirectoryPanel from "@/layouts/AsideDirectoryPanel";
import { Menu } from "lucide-react";

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

export default function MessagesPage() {
  const [isShow, setIsShow] = useState(false);
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conv") || "";

  // Lấy user hiện tại bằng API /api/auth/me
  const { data: meData, isLoading: meLoading } = useSWR("me", getMe);

  // Lấy userId từ token hoặc query ?me=
  const userIdFromToken = meData?.user?.sub || "";
  const userId = searchParams.get("me") || userIdFromToken || "";

  if (meLoading) {
    return (
      <div className="flex h-svh items-center justify-center bg-slate-950 text-slate-100">
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
      <div className="flex h-svh items-center justify-center bg-slate-950 text-slate-100">
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
      <div className="flex h-svh overflow-hidden bg-slate-950 relative">
        {/* Sidebar Trái */}
        <AsideMessageApp
          isShow={isShow}
          setIsShow={setIsShow}
          currentUserId={userId}
        />

        {/* Khu vực chính hiển thị hướng dẫn chọn đoạn chat */}
        <Menu
          onClick={() => setIsShow(!isShow)}
          className="block md:hidden cursor-pointer hover:text-blue-400 absolute top-3 left-3"
        />
        <div className="flex-1 min-w-0 flex items-center justify-center border-l border-slate-800">
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
    <div className="flex h-svh overflow-hidden">
      {/* Sidebar Trái */}
      <AsideMessageApp
        isShow={isShow}
        setIsShow={setIsShow}
        currentUserId={userId}
      />

      {/* Chat Chính */}
      <main className="flex-1 min-w-0">
        <MainMessage
          conversationId={conversationId}
          userId={userId}
          isShow={isShow}
          setIsShow={setIsShow}
        />
      </main>

      {/* Sidebar Phải (Directory) */}
      <AsideDirectoryPanel currentUserId={userId} />
    </div>
  );
}
