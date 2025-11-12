"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Plus, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Conversation = {
  id: string;
  name?: string;
  is_group?: boolean;
  updated_at?: string | Date;
  last_message?: string;
  unread_count?: number;
};

export default function AsideMessageApp() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const qs = useSearchParams();

  const apiBase = process.env.NEXT_PUBLIC_CHAT_API || "http://localhost:3000/chat";
  const userId = qs.get("me") || "";

  async function fetchConversations() {
    try {
      setLoading(true);
      let url = `${apiBase}/conversations${
        userId ? `?user_id=${encodeURIComponent(userId)}` : ""
      }`;
      let res = await axios.get(url);
      let data: Conversation[] =
        Array.isArray(res.data) ? res.data : res.data.data || res.data.conversations || [];
      if (!data?.length && userId) {
        url = `${apiBase}/conversations?userId=${encodeURIComponent(userId)}`;
        res = await axios.get(url);
        data = Array.isArray(res.data)
          ? res.data
          : res.data.data || res.data.conversations || [];
      }
      setConversations(data || []);
    } catch (e) {
      console.error("load conversations error", e);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, userId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) =>
      (c.name || `Room ${c.id}`).toLowerCase().includes(q)
    );
  }, [search, conversations]);

  function openConversation(c: Conversation) {
    const query = new URLSearchParams(qs.toString());
    query.set("conv", c.id);
    if (userId) query.set("me", userId);
    router.push(`${pathname}?${query.toString()}`);
  }

  return (
    <aside className="hidden md:flex w-80 flex-col border-r bg-white">
      <div className="h-14 border-b px-3 flex items-center justify-between">
        <div className="font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" /> Chats
          <Badge variant="secondary" className="ml-2">
            {loading ? "…" : filtered.length}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost">
            <Plus className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                window.history.back();
              }
            }}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-3">
        <Input
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2 pb-4 space-y-1">
          {!loading && filtered.length === 0 && (
            <div className="text-sm text-gray-500 px-2 py-3">
              Không có cuộc trò chuyện
            </div>
          )}
          {filtered.map((c) => {
            const title = c.name || `Room ${c.id}`;
            const unread = c.unread_count || 0;
            return (
              <button
                key={c.id}
                onClick={() => openConversation(c)}
                className="w-full text-left px-2 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-3"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src="/placeholder.svg?height=36&width=36"
                    alt={title}
                  />
                  <AvatarFallback>
                    {title.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{title}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {c.last_message || "—"}
                  </div>
                </div>
                {unread > 0 && (
                  <Badge className="bg-indigo-600 text-white">{unread}</Badge>
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
