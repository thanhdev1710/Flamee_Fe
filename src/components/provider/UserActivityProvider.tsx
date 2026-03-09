"use client";

import { useEffect } from "react";
import { useProfile } from "@/services/user.hook";
import { getChatSocket } from "@/lib/chatSocket";

export function UserActivityProvider() {
  const { data: profile } = useProfile();

  useEffect(() => {
    if (!profile?.user_id) return;

    const userId = String(profile.user_id);
    const socket = getChatSocket(userId);

    // Join để server track presence
    socket.on("connect", () => {
      socket.emit("join-user", { userId });
    });

    // Heartbeat cập nhật last_seen
    const interval = setInterval(() => {
      socket.emit("user-activity");
    }, 30_000);

    return () => {
      clearInterval(interval);
      // Không disconnect — session vẫn giữ cho đến logout
    };
  }, [profile?.user_id]);

  return null;
}
