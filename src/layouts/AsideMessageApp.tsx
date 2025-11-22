"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageCircle,
  Plus,
  MoreHorizontal,
  Trash2,
  Pencil,
} from "lucide-react";
import axios from "axios";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Socket } from "socket.io-client";
import { cn } from "@/lib/utils";
import { getFriendSuggestions } from "@/services/follow.service";
import { getChatSocket } from "@/lib/chatSocket";
import { toast } from "sonner";

type AsideMessageAppProps = {
  currentUserId: string;
};

export default function AsideMessageApp({
  currentUserId,
}: AsideMessageAppProps) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [userStatus, setUserStatus] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [openRename, setOpenRename] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [renameTargetId, setRenameTargetId] = useState<string | null>(null);
  const [renaming, setRenaming] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [friends, setFriends] = useState<any[]>([]);
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [createMode, setCreateMode] = useState<"direct" | "group">("direct");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeId = searchParams.get("conv");

  // Ref để tránh spam thông báo khi mình tự xóa
  const isSelfDeleting = useRef(false);

  const apiBase =
    process.env.NEXT_PUBLIC_CHAT_API || "http://localhost:4004/api/v1/chat";
  const socketUrl =
    process.env.NEXT_PUBLIC_CHAT_SOCKET || "http://localhost:4004";

  // --- FETCH DATA ---
  const fetchConversations = useCallback(() => {
    if (!currentUserId) return;
    axios
      .get(`${apiBase}/conversations?user_id=${currentUserId}`)
      .then((res) => {
        const raw = Array.isArray(res.data) ? res.data : res.data.data || [];
        const mapped = raw.map((c: any) => ({
          ...c,
          last_message_at: c.last_message_at || c.created_at,
          unread_count: c.unread_count || 0,
        }));

        const st: any = {};
        mapped.forEach((c: any) =>
          c.members?.forEach((m: any) => {
            if (m.user && m.user.id !== currentUserId)
              st[m.user.id] = {
                isOnline: m.user.is_online,
                lastSeen: m.user.last_seen,
              };
          })
        );
        setUserStatus((prev) => ({ ...prev, ...st }));
        setConversations(
          mapped.sort(
            (a: any, b: any) =>
              new Date(b.last_message_at).getTime() -
              new Date(a.last_message_at).getTime()
          )
        );
      })
      .catch((e) => console.error(e));
  }, [currentUserId, apiBase]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // --- SOCKET ---
  useEffect(() => {
    if (!currentUserId) return;
    const s = getChatSocket(currentUserId, socketUrl);
    setSocket(s);
    s.emit("join-user", { userId: currentUserId });

    const handlePresence = (d: any) => {
      setUserStatus((prev) => ({
        ...prev,
        [d.userId]: { isOnline: d.isOnline, lastSeen: d.lastSeen },
      }));
    };

    // [NEW] Xử lý khi được thêm vào nhóm (Hiện "Chưa có tin nhắn")
    const handleNewConv = (newConv: any) => {
      setConversations((prev) => {
        if (prev.find((x) => x.id === newConv.id)) return prev;
        // Backend đã gửi last_message="" cho người mới
        return [newConv, ...prev];
      });
      toast("Bạn có cuộc trò chuyện mới");
    };

    // [FIX LOOP] Loại bỏ fetchConversations trong hàm này để tránh đơ UI
    const handleUpdate = (d: any) => {
      setConversations((prev) => {
        const exists = prev.find((c) => c.id === d.conversationId);

        // Nếu không tìm thấy hội thoại thì giữ nguyên (tránh loop)
        if (!exists) return prev;

        const next = prev.map((c) => {
          if (c.id === d.conversationId) {
            const isCurrent = activeId === d.conversationId;
            return {
              ...c,
              // 👇 CẬP NHẬT TÊN NHÓM NGAY KHI SERVER GỬI newName
              name: d.newName ?? c.name,
              last_message: d.lastMessage ?? c.last_message,
              last_message_at: d.lastMessageAt ?? c.last_message_at,
              unread_count: isCurrent ? 0 : d.unreadCount ?? c.unread_count,
            };
          }
          return c;
        });

        return next.sort(
          (a, b) =>
            new Date(b.last_message_at).getTime() -
            new Date(a.last_message_at).getTime()
        );
      });
    };

    const handleRemoveConv = (d: any) => {
      setConversations((prev) => {
        const exists = prev.find((c) => c.id === d.conversationId);
        if (exists && !isSelfDeleting.current) {
          toast.error(
            "Cuộc trò chuyện đã bị xóa hoặc bạn bị mời ra khỏi nhóm."
          );
        }
        return prev.filter((c) => c.id !== d.conversationId);
      });
      if (activeId === d.conversationId) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("conv");
        router.push(`${pathname}?${params.toString()}`);
      }
    };

    s.on("user-presence", handlePresence);
    s.on("new-conversation", handleNewConv);
    s.on("conversation-updated", handleUpdate);
    s.on("conversation-updated-unread", handleUpdate);
    s.on("conversation-removed", handleRemoveConv);

    return () => {
      s.off("user-presence", handlePresence);
      s.off("new-conversation", handleNewConv);
      s.off("conversation-updated", handleUpdate);
      s.off("conversation-updated-unread", handleUpdate);
      s.off("conversation-removed", handleRemoveConv);
    };
  }, [currentUserId, socketUrl, activeId, pathname, searchParams, router]);

  // --- OPTIMISTIC READ ---
  useEffect(() => {
    if (activeId && currentUserId) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId && c.unread_count > 0
            ? { ...c, unread_count: 0 }
            : c
        )
      );
      axios
        .post(
          `${apiBase}/${activeId}/read-all`,
          {},
          { headers: { "x-user-id": currentUserId } }
        )
        .catch(() => {});
    }
  }, [activeId, currentUserId, apiBase]);

  // --- ACTIONS ---
  const executeDelete = async (conversationId: string) => {
    isSelfDeleting.current = true;
    try {
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      if (activeId === conversationId) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("conv");
        router.push(`${pathname}?${params.toString()}`);
      }
      await axios.post(
        `${apiBase}/${conversationId}/delete`,
        {},
        { headers: { "x-user-id": currentUserId } }
      );
      toast.success("Đã xóa đoạn hội thoại");
    } catch (error) {
      console.error(error);
      toast.error("Xóa thất bại");
      fetchConversations();
    } finally {
      setTimeout(() => {
        isSelfDeleting.current = false;
      }, 1000);
    }
  };

  const handleDeleteClick = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.custom(
      (t) => (
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl shadow-2xl w-[356px] flex flex-col gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Xác nhận xóa đoạn chat?
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Bạn sẽ không thể xem lại tin nhắn cũ.
            </p>
          </div>
          <div className="flex gap-2 justify-end mt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast.dismiss(t)}
              className="h-8 px-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-8 px-3 bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                executeDelete(conversationId);
                toast.dismiss(t);
              }}
            >
              Xóa ngay
            </Button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  // --- CREATE & FILTER ---
  const fetchFriends = async () => {
    try {
      const res: any = await getFriendSuggestions();
      setFriends(res.mutualFriends || []);
    } catch {
      setFriends([]);
    }
  };
  const handleCreate = async () => {
    if (!currentUserId) return;
    if (createMode === "direct" && selectedFriendIds.length !== 1)
      return toast.error("Chọn 1 người");
    if (
      createMode === "group" &&
      (selectedFriendIds.length < 2 || !groupName.trim())
    )
      return toast.error("Nhập tên nhóm và >= 2 người");
    try {
      const payload =
        createMode === "direct"
          ? { userAId: currentUserId, userBId: selectedFriendIds[0] }
          : {
              isGroup: true,
              name: groupName.trim(),
              createdBy: currentUserId,
              memberIds: [...selectedFriendIds, currentUserId],
            };
      const res = await axios.post(`${apiBase}/create`, payload);
      if (res.data?.id) {
        const q = new URLSearchParams(searchParams.toString());
        q.set("conv", res.data.id);
        router.push(`${pathname}?${q.toString()}`);
        setOpenCreate(false);
        setSelectedFriendIds([]);
        setGroupName("");
        fetchConversations();
        toast.success("Tạo thành công");
      }
    } catch {
      toast.error("Tạo thất bại");
    }
  };

  const filtered = conversations.filter((c) => {
    const name = c.is_group
      ? c.name
      : c.members?.find((m: any) => m.user_id !== currentUserId)?.user
          ?.username || "User";
    return (name || "").toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <aside className="hidden md:flex w-80 flex-col bg-[#050816] border-r border-slate-800 h-full">
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
          <div className="font-semibold flex items-center gap-2 text-slate-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
              <MessageCircle className="w-4 h-4" />
            </span>
            <span className="flex items-center gap-2">
              Messages{" "}
              <Badge className="bg-slate-800 text-[11px]">
                {filtered.length}
              </Badge>
            </span>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full hover:bg-slate-700"
            onClick={() => {
              setOpenCreate(true);
              fetchFriends();
            }}
          >
            <Plus className="text-slate-100" />
          </Button>
        </div>
        <div className="p-3 border-b border-slate-800 bg-[#050816]">
          <Input
            className="bg-slate-900/60 border-slate-700 text-slate-100 placeholder:text-slate-500 rounded-full"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div
          className={cn(
            "flex-1 overflow-y-auto bg-[#050816]",
            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          )}
        >
          <div className="p-2 gap-1 flex flex-col">
            {filtered.map((c) => {
              const name = c.is_group
                ? c.name
                : c.members?.find((m: any) => m.user_id !== currentUserId)?.user
                    ?.username || "User";
              const avatar = c.is_group
                ? ""
                : c.members?.find((m: any) => m.user_id !== currentUserId)?.user
                    ?.avatarUrl;
              const online = c.members?.some(
                (m: any) =>
                  m.user_id !== currentUserId && userStatus[m.user_id]?.isOnline
              );
              const isActive = activeId === c.id;
              return (
                <div key={c.id} className="relative group">
                  <button
                    onClick={() => {
                      const q = new URLSearchParams(searchParams.toString());
                      q.set("conv", c.id);
                      router.push(`${pathname}?${q.toString()}`);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 p-3 rounded-2xl text-left transition-all duration-150 hover:bg-slate-900/80 pr-10",
                      isActive
                        ? "bg-slate-900 border border-slate-700 shadow-sm"
                        : "bg-transparent"
                    )}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={avatar} />
                        <AvatarFallback className="bg-emerald-500 text-white font-bold">
                          {name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      {online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span
                          className={cn(
                            "truncate text-sm text-slate-100 max-w-[120px]",
                            c.unread_count > 0 && "font-semibold"
                          )}
                        >
                          {name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {c.last_message_at
                            ? new Date(c.last_message_at).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )
                            : ""}
                        </span>
                      </div>
                      <div className="flex justify-between items-center gap-2 mt-0.5">
                        <span
                          className={cn(
                            "truncate text-xs",
                            c.unread_count >= 2
                              ? "text-blue-400 font-semibold"
                              : "text-slate-400"
                          )}
                        >
                          {c.unread_count >= 2
                            ? `${c.unread_count} tin nhắn chưa đọc`
                            : c.last_message || "Chưa có tin nhắn"}
                        </span>
                        {c.unread_count > 0 && (
                          <span className="shrink-0 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            {c.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-slate-800 text-slate-400"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-slate-900 border-slate-800 text-slate-200"
                      >
                        <DropdownMenuItem
                          className="text-red-500 focus:text-red-400 focus:bg-slate-800 cursor-pointer"
                          onClick={(e) => handleDeleteClick(c.id, e)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xóa đoạn chat
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="sm:max-w-lg bg-slate-950 border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle>Tạo cuộc trò chuyện</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2 mb-3">
            <Button
              variant={createMode === "direct" ? "default" : "outline"}
              className="flex-1"
              onClick={() => {
                setCreateMode("direct");
                setSelectedFriendIds([]);
              }}
            >
              Chat 1-1
            </Button>
            <Button
              variant={createMode === "group" ? "default" : "outline"}
              className="flex-1"
              onClick={() => {
                setCreateMode("group");
                setSelectedFriendIds([]);
              }}
            >
              Nhóm
            </Button>
          </div>
          {createMode === "group" && (
            <Input
              placeholder="Tên nhóm"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mb-3 bg-slate-900 border-slate-700"
            />
          )}
          <div
            className={cn(
              "h-56 border border-slate-700 rounded p-2 overflow-y-auto",
              "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            )}
          >
            {friends.map((f) => (
              <div
                key={f.user_id}
                onClick={() => {
                  setSelectedFriendIds((prev) =>
                    createMode === "direct"
                      ? [f.user_id]
                      : selectedFriendIds.includes(f.user_id)
                      ? prev.filter((id) => id !== f.user_id)
                      : [...prev, f.user_id]
                  );
                }}
                className="flex items-center gap-2 p-2 hover:bg-slate-900 cursor-pointer rounded-md"
              >
                <Checkbox
                  checked={selectedFriendIds.includes(f.user_id)}
                  className="border-slate-500 data-[state=checked]:bg-blue-600"
                />
                <Avatar className="w-8 h-8">
                  <AvatarImage src={f.avatar_url} />
                  <AvatarFallback>{f.username?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm">{f.username}</span>
                  {f.username && (
                    <span className="text-xs text-slate-500">{f.username}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Tạo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
