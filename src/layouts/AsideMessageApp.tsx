/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import type React from "react";
import { useEffect, useState, useCallback, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageCircle,
  Plus,
  MoreHorizontal,
  Trash2,
  Loader2,
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
import { cn } from "@/lib/utils";
import { getFriendSuggestions } from "@/services/follow.service";
import { toast } from "sonner";
import {
  SkeletonConversation,
  PulseLoading,
} from "@/components/ui/loading-skeleton";
import { navigationItems } from "@/global/const";
import Link from "next/link";
import { Socket } from "socket.io-client";
import { getChatSocket } from "@/lib/chatSocket";

type AsideMessageAppProps = {
  currentUserId: string;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
  isShow: boolean;
};

type UserSummary = {
  id: string;
  username?: string;
  avatarUrl?: string;
  is_online?: boolean;
  last_seen?: string | null;
};

type ConversationMember = {
  user_id: string;
  user?: UserSummary;
};

type Conversation = {
  id: string;
  is_group: boolean;
  name: string | null;
  members?: ConversationMember[];
  last_message_at?: string;
  created_at?: string;
  last_message?: string | null;
  unread_count: number;
};

type UserPresence = {
  isOnline: boolean;
  lastSeen?: string | null;
};

type Friend = {
  user_id: string;
  username?: string;
  avatar_url?: string;
};

type FriendSuggestionsResponse = {
  mutualFriends: Friend[];
};

export default function AsideMessageAppEnhanced({
  currentUserId,
  isShow,
  setIsShow,
}: AsideMessageAppProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [userStatus, setUserStatus] = useState<Record<string, UserPresence>>(
    {}
  );
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [createMode, setCreateMode] = useState<"direct" | "group">("direct");
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [, setSocket] = useState<Socket | null>(null); // giữ reference, sau dùng thêm cũng được

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeId = searchParams.get("conv");

  // tránh spam toast khi chính mình xoá
  const isSelfDeleting = useRef(false);

  const apiBase =
    process.env.NEXT_PUBLIC_CHAT_API || "http://localhost:4004/api/v1/chat";
  const socketUrl =
    process.env.NEXT_PUBLIC_CHAT_SOCKET || "http://localhost:4004";

  // --- FETCH CONVERSATIONS ---
  const fetchConversations = useCallback(() => {
    if (!currentUserId) return;

    setIsLoadingConversations(true);
    axios
      .get(apiBase + `/conversations?user_id=${currentUserId}`)
      .then((res) => {
        const raw = (Array.isArray(res.data) ? res.data : res.data.data) || [];
        const rawConvs = raw as Conversation[];

        const mapped: Conversation[] = rawConvs.map((c) => ({
          ...c,
          last_message_at: c.last_message_at || c.created_at,
          unread_count: c.unread_count ?? 0,
        }));

        const statusByUser: Record<string, UserPresence> = {};
        mapped.forEach((c) =>
          c.members?.forEach((m) => {
            if (m.user && m.user.id !== currentUserId) {
              statusByUser[m.user.id] = {
                isOnline: Boolean(m.user.is_online),
                lastSeen: m.user.last_seen ?? undefined,
              };
            }
          })
        );

        setUserStatus((prev) => ({ ...prev, ...statusByUser }));

        setConversations(
          mapped.sort((a, b) => {
            const timeA = new Date(
              a.last_message_at ?? a.created_at ?? 0
            ).getTime();
            const timeB = new Date(
              b.last_message_at ?? b.created_at ?? 0
            ).getTime();
            return timeB - timeA;
          })
        );
      })
      .catch((e) => {
        console.error(e);
        toast.error("Lỗi tải danh sách chat");
      })
      .finally(() => setIsLoadingConversations(false));
  }, [currentUserId, apiBase]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // --- SOCKET REALTIME ---
  useEffect(() => {
    if (!currentUserId) return;

    const s = getChatSocket(currentUserId, socketUrl);
    setSocket(s);

    // join user room
    s.emit("join-user", { userId: currentUserId });

    const handlePresence = (d: any) => {
      setUserStatus((prev) => ({
        ...prev,
        [d.userId]: { isOnline: d.isOnline, lastSeen: d.lastSeen },
      }));
    };

    const handleNewConv = (newConv: any) => {
      setConversations((prev) => {
        if (prev.find((x) => x.id === newConv.id)) return prev;
        const mapped: Conversation = {
          ...newConv,
          last_message_at: newConv.last_message_at || newConv.created_at,
          unread_count: newConv.unread_count ?? 0,
        };
        return [mapped, ...prev];
      });
      toast("Bạn có cuộc trò chuyện mới");
    };

    // cập nhật last_message, unread_count, tên nhóm...
    const handleUpdate = (d: any) => {
      setConversations((prev) => {
        const exists = prev.find((c) => c.id === d.conversationId);
        if (!exists) return prev;

        const next = prev.map((c) => {
          if (c.id === d.conversationId) {
            const isCurrent = activeId === d.conversationId;
            const updated: Conversation = {
              ...c,
              name: d.newName ?? c.name,
              last_message: d.lastMessage ?? c.last_message,
              last_message_at:
                d.lastMessageAt ?? c.last_message_at ?? c.created_at,
              // nếu đang mở đoạn chat đó thì vẫn để 0
              unread_count: isCurrent
                ? 0
                : d.unreadCount ?? c.unread_count ?? 0,
            };
            return updated;
          }
          return c;
        });

        return next.sort((a, b) => {
          const timeA = new Date(
            a.last_message_at ?? a.created_at ?? 0
          ).getTime();
          const timeB = new Date(
            b.last_message_at ?? b.created_at ?? 0
          ).getTime();
          return timeB - timeA;
        });
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

  // --- OPTIMISTIC READ KHI CLICK VÀO CONVERSATION ---
  // Không gọi HTTP /read-all nữa, để socket "mark-read" bên MainMessage xử lý
  useEffect(() => {
    if (!activeId || !currentUserId) return;

    // chỉ reset UI local cho đoạn đang mở
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId && c.unread_count > 0 ? { ...c, unread_count: 0 } : c
      )
    );
  }, [activeId, currentUserId]);

  // --- DELETE CONVERSATION ---
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

  const handleDeleteClick = (
    conversationId: string,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    toast.custom(
      (t) => (
        <div className="bg-slate-950 border border-slate-700 p-4 rounded-xl shadow-2xl w-[356px] flex flex-col gap-3 backdrop-blur-sm">
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

  // --- FRIENDS & CREATE CONVERSATION ---
  const fetchFriends = async () => {
    setIsLoadingFriends(true);
    try {
      const res = (await getFriendSuggestions()) as FriendSuggestionsResponse;
      setFriends(res.mutualFriends || []);
    } catch {
      setFriends([]);
      toast.error("Lỗi tải danh sách bạn bè");
    } finally {
      setIsLoadingFriends(false);
    }
  };

  const handleCreate = async () => {
    if (!currentUserId) return;

    if (createMode === "direct" && selectedFriendIds.length !== 1) {
      return toast.error("Chọn 1 người");
    }

    if (
      createMode === "group" &&
      (selectedFriendIds.length < 2 || !groupName.trim())
    ) {
      return toast.error("Nhập tên nhóm và >= 2 người");
    }

    setIsCreating(true);
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
      const newId: string | undefined = res.data?.id;

      if (newId) {
        const q = new URLSearchParams(searchParams.toString());
        q.set("conv", newId);
        router.push(`${pathname}?${q.toString()}`);
        setOpenCreate(false);
        setSelectedFriendIds([]);
        setGroupName("");
        fetchConversations();
        toast.success("Tạo thành công");
      }
    } catch {
      toast.error("Tạo thất bại");
    } finally {
      setIsCreating(false);
    }
  };

  // --- FILTERED LIST ---
  const filtered = conversations.filter((c) => {
    const name = c.is_group
      ? c.name
      : c.members?.find((m) => m.user_id !== currentUserId)?.user?.username ||
        "User";
    return (name || "").toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      {isShow && (
        <div
          onClick={() => setIsShow(false)}
          className="absolute top-0 left-0 inset-0 z-20 bg-slate-950/70"
        ></div>
      )}
      <aside
        className={`flex w-80 flex-col bg-linear-to-b from-slate-950 via-slate-950 to-slate-900 border-r border-slate-800 h-full shadow-xl max-md:absolute top-0 z-30 transition-all ease-in-out duration-300 ${
          isShow ? "left-0" : "-left-full"
        }`}
      >
        {/* Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 bg-linear-to-r from-blue-600/20 via-slate-900 to-slate-900 backdrop-blur-sm">
          <div className="font-semibold flex items-center gap-2 text-slate-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg">
              <MessageCircle className="w-4 h-4" />
            </span>
            <span className="flex items-center gap-2">
              Messages{" "}
              <Badge className="bg-blue-600/30 text-blue-200 border-blue-600/50">
                {filtered.length}
              </Badge>
            </span>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-lg hover:bg-slate-800 transition-all"
            onClick={() => {
              setOpenCreate(true);
              fetchFriends();
            }}
          >
            <Plus className="text-slate-100" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
          <Input
            className="bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500 rounded-lg focus-visible:ring-blue-500"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Conversations List */}
        <div
          className={cn(
            "flex-1 overflow-y-auto bg-slate-950",
            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          )}
        >
          <div className="p-2 gap-1 flex flex-col">
            {isLoadingConversations ? (
              <>
                <SkeletonConversation />
                <SkeletonConversation />
                <SkeletonConversation />
                <SkeletonConversation />
              </>
            ) : filtered.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-slate-500">
                <div className="text-center">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Không có cuộc hội thoại</p>
                </div>
              </div>
            ) : (
              filtered.map((c) => {
                const name = c.is_group
                  ? c.name
                  : c.members?.find(
                      (m: ConversationMember) => m.user_id !== currentUserId
                    )?.user?.username || "User";

                const avatar = c.is_group
                  ? ""
                  : c.members?.find(
                      (m: ConversationMember) => m.user_id !== currentUserId
                    )?.user?.avatarUrl;

                const online = c.members?.some(
                  (m: ConversationMember) =>
                    m.user_id !== currentUserId &&
                    userStatus[m.user_id]?.isOnline === true
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
                        "flex w-full items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 hover:bg-slate-800/60 pr-10",
                        isActive
                          ? "bg-blue-600/20 border border-blue-600/50 shadow-lg"
                          : "bg-transparent hover:bg-slate-800/40"
                      )}
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10 shadow-sm">
                          <AvatarImage src={avatar ?? undefined} />
                          <AvatarFallback className="bg-linear-to-br from-blue-500 to-blue-600 text-white font-bold">
                            {name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        {online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 shadow-md" />
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
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
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
                            <span className="shrink-0 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold shadow-md">
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
                            className="h-8 w-8 rounded-lg hover:bg-slate-700 text-slate-400"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-slate-900 border-slate-800 text-slate-200 shadow-xl"
                        >
                          <DropdownMenuItem
                            className="text-red-500 focus:text-red-400 focus:bg-slate-800 cursor-pointer"
                            onClick={(e) => handleDeleteClick(c.id, e as any)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa đoạn chat
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Bottom navigation (mobile / shortcut) */}
        <div className="p-4.5 border-t bg-slate-950 border-slate-800">
          <div className="flex justify-around">
            {navigationItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                className={`${
                  item.href.includes("/messages")
                    ? "bg-flamee-primary text-white hover:bg-flamee-primary! hover:text-white"
                    : ""
                } p-2 flex flex-col items-center`}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="w-5 h-5" />
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </aside>

      {/* Create Conversation Dialog */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="sm:max-w-lg bg-slate-950 border-slate-800 text-slate-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-slate-50">
              Tạo cuộc trò chuyện
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-2 mb-4">
            <Button
              variant={createMode === "direct" ? "default" : "outline"}
              className={cn(
                "flex-1 rounded-lg transition-all",
                createMode === "direct"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "border-slate-700"
              )}
              onClick={() => {
                setCreateMode("direct");
                setSelectedFriendIds([]);
              }}
            >
              Chat 1-1
            </Button>
            <Button
              variant={createMode === "group" ? "default" : "outline"}
              className={cn(
                "flex-1 rounded-lg transition-all",
                createMode === "group"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "border-slate-700"
              )}
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
              className="bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500 rounded-lg mb-4"
            />
          )}
          <div className="max-h-60 overflow-y-auto space-y-2 p-2 bg-slate-900/30 rounded-lg">
            {isLoadingFriends ? (
              <div className="flex justify-center py-8">
                <PulseLoading size="sm" text="Đang tải..." />
              </div>
            ) : friends.length === 0 ? (
              <div className="text-center text-slate-500 py-8">
                Không tìm thấy bạn bè
              </div>
            ) : (
              friends.map((f) => (
                <div
                  key={f.user_id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedFriendIds((prev) =>
                      createMode === "direct"
                        ? [f.user_id]
                        : selectedFriendIds.includes(f.user_id)
                        ? prev.filter((id) => id !== f.user_id)
                        : [...prev, f.user_id]
                    );
                  }}
                >
                  <Checkbox
                    checked={selectedFriendIds.includes(f.user_id)}
                    className="border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={f.avatar_url || undefined} />
                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                      {f.username?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-slate-200">{f.username}</span>
                </div>
              ))
            )}
          </div>
          <DialogFooter className="gap-2 mt-4">
            <Button
              variant="ghost"
              onClick={() => setOpenCreate(false)}
              className="text-slate-400 hover:bg-slate-800"
            >
              Hủy
            </Button>
            <Button
              onClick={handleCreate}
              disabled={
                selectedFriendIds.length === 0 ||
                (createMode === "group" && !groupName.trim()) ||
                isCreating
              }
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  Tạo{" "}
                  {selectedFriendIds.length > 0 &&
                    `(${selectedFriendIds.length})`}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
