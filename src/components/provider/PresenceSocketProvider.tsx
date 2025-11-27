/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { getChatSocket } from "@/lib/chatSocket";
import { usePresenceStore } from "@/store/presenceStore";
import { useProfile } from "@/services/user.hook";

export function PresenceSocketProvider() {
  const { data: profile } = useProfile();
  const setPresence = usePresenceStore((s) => s.setPresence);
  const setInitialPresence = usePresenceStore((s) => s.setInitialPresence);

  useEffect(() => {
    if (!profile?.user_id) return;

    const userId = String(profile.user_id);
    const socket = getChatSocket(userId);

    const handleInit = (list: any[]) => {
      setInitialPresence(list);
    };

    const handlePresence = (data: any) => {
      setPresence(String(data.userId), {
        isOnline: data.isOnline,
        lastSeen: data.lastSeen ?? null,
      });
    };

    socket.on("presence-init", handleInit);
    socket.on("user-presence", handlePresence);

    // Yêu cầu server gửi snapshot ban đầu khi bạn quay trở lại web
    socket.emit("presence-request");

    return () => {
      socket.off("presence-init", handleInit);
      socket.off("user-presence", handlePresence);
    };
  }, [profile?.user_id]);

  return null;
}
