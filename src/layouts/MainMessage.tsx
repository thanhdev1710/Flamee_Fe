"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Menu,
  Phone,
  MoreVertical,
  Paperclip,
  ImageIcon,
  Smile,
  Send,
} from "lucide-react";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";

type Props = {
  setOpenAside: Dispatch<SetStateAction<boolean>>;
  conversationId: string;
  userId: string;
  apiBase: string;
  socketUrl: string;
  authToken?: string;
};

type Attachment = {
  id: string;
  file_url: string;
  file_type?: "image" | "video" | "file" | "audio";
};

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  message_type: "text" | "file";
  created_at: string | Date;
  updated_at?: string | Date;
  attachments?: Attachment[];
  read_at?: string | Date;
  status?: "show" | "recall" | "delete" | "sent";
};

function authHeaders(token?: string) {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

export default function MainMessage({
  setOpenAside,
  conversationId,
  userId,
  apiBase,
  socketUrl,
  authToken,
}: Props) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const isMine = (m: Message) => String(m.sender_id) === String(userId);
  const created = (m: Message) => new Date(m.created_at);
  const isRead = (m: Message) => !!m.read_at || m.status === "sent";

  // Load message history
  useEffect(() => {
    if (!conversationId) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${apiBase}/${encodeURIComponent(conversationId)}/history`,
          { headers: authHeaders(authToken) }
        );
        const arr: Message[] = Array.isArray(res.data)
          ? res.data
          : res.data.messages || res.data.data || [];
        if (!cancelled) setMessages(arr);
      } catch (e) {
        console.error("load history error", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [conversationId, apiBase, authToken]);

  // Auto scroll
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages.length]);

  // Socket.IO realtime
  useEffect(() => {
    const s = io(socketUrl, {
      auth: authToken ? { token: authToken } : undefined,
      transports: ["websocket"],
    });
    socketRef.current = s;

    s.on("connect", () => {
      if (conversationId && userId) {
        s.emit("join", { conversation_id: conversationId, user_id: userId });
      }
    });

    s.on("message:new", (m: Message) => setMessages((prev) => [...prev, m]));

    s.on("typing", (p: any) => {
      const active = p?.is_typing && String(p.user_id) !== String(userId);
      setTyping(!!active);
    });

    s.on("read", () => {
      setMessages((prev) =>
        prev.map((x) => ({ ...x, read_at: new Date().toISOString() }))
      );
    });

    return () => {
      s.disconnect();
    };
  }, [socketUrl, conversationId, userId, authToken]);

  async function sendText() {
    const text = message.trim();
    if (!text || !conversationId) return;
    try {
      const body = {
        conversation_id: conversationId,
        sender_id: userId,
        message: text,
        message_type: "text" as const,
      };
      const res = await axios.post(`${apiBase}/send`, body, {
        headers: authHeaders(authToken),
      });
      const saved: Message = res.data?.data || res.data?.message || body;
      setMessages((prev) => [...prev, saved]);
      setMessage("");
      socketRef.current?.emit("read", {
        conversation_id: conversationId,
        user_id: userId,
      });
    } catch (e) {
      console.error("send error", e);
    }
  }

  function renderBubbleContent(m: Message) {
    if (m.message_type === "file" && m.attachments?.length) {
      const a = m.attachments[0];
      if (a.file_type === "image")
        return (
          <img
            src={a.file_url}
            alt="image"
            className="max-w-[240px] rounded-xl"
          />
        );
      if (a.file_type === "video")
        return (
          <video
            src={a.file_url}
            controls
            className="max-w-[260px] rounded-xl"
          />
        );
      if (a.file_type === "audio") return <audio src={a.file_url} controls />;
      return (
        <a
          href={a.file_url}
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          Tệp đính kèm
        </a>
      );
    }
    return <div className="whitespace-pre-wrap break-words">{m.message}</div>;
  }

  function emitTyping() {
    socketRef.current?.emit("typing", {
      conversation_id: conversationId,
      user_id: userId,
      is_typing: true,
    });
    setTimeout(() => {
      socketRef.current?.emit("typing", {
        conversation_id: conversationId,
        user_id: userId,
        is_typing: false,
      });
    }, 1200);
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b bg-white">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <button className="md:hidden" onClick={() => setOpenAside(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="font-semibold">Messages</div>
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            <MoreVertical className="w-5 h-5" />
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div ref={listRef} className="max-w-3xl mx-auto p-4 space-y-4">
          {loading && (
            <div className="text-sm text-gray-500">Đang tải lịch sử…</div>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-end gap-2 ${
                isMine(m) ? "justify-end" : ""
              }`}
            >
              {!isMine(m) && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="@u" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-2xl px-4 py-2 shadow ${
                  isMine(m)
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {renderBubbleContent(m)}
                <div
                  className={`mt-1 text-[11px] ${
                    isMine(m) ? "text-indigo-100/90" : "text-gray-600"
                  }`}
                >
                  {created(m).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  <span className="mx-2">•</span>
                  {isRead(m) ? "Đã đọc" : "Đã gửi"}
                </div>
              </div>
              {isMine(m) && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="@me" />
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {typing && <div className="text-xs text-gray-500">Đang nhập…</div>}
        </div>
      </ScrollArea>

      <div className="border-t bg-white">
        <div className="max-w-3xl mx-auto p-3 flex items-center gap-2">
          <button className="p-2">
            <Paperclip className="w-5 h-5" />
          </button>
          <button className="p-2">
            <ImageIcon className="w-5 h-5" />
          </button>
          <Input
            placeholder="Type your message..."
            className="flex-1"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              emitTyping();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendText();
              }
            }}
          />
          <button className="p-2">
            <Smile className="w-5 h-5" />
          </button>
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4"
            onClick={sendText}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
