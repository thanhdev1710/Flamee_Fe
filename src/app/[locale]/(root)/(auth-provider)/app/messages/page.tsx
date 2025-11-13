"use client";
import AsideMessageApp from "@/layouts/AsideMessageApp";
import MainMessage from "@/layouts/MainMessage";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const [openAside, setOpenAside] = useState(false);
  const search = useSearchParams();

  const conversationId = search.get("conv") || "";
  const userId = search.get("me") || "";

  const apiBase =
    process.env.NEXT_PUBLIC_CHAT_API || "http://localhost:3000/chat";
  const socketUrl =
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";
  const token = process.env.NEXT_PUBLIC_CHAT_TOKEN || "";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AsideMessageApp />
      <MainMessage
        setOpenAside={setOpenAside}
        conversationId={conversationId}
        userId={userId}
        apiBase={apiBase}
        socketUrl={socketUrl}
        authToken={token}
      />
    </div>
  );
}
