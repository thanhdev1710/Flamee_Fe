/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";
import { Socket } from "socket.io-client";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Phone,
  Video as VideoIcon,
  Send,
  Trash2,
  Reply,
  X,
  CheckCheck,
  Pencil,
  Menu,
} from "lucide-react";
import { formatLastSeen, formatMessageTime } from "@/utils/time";
import { toast } from "sonner";
import { getChatSocket } from "@/lib/chatSocket";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string | number;
  sender_id: string | number;
  message: string;
  status: "show" | "recall";
  createdAt: string;
  readBy?: { userId: string; read_at: string | null }[];
  sender?: {
    id: string | number;
    username: string;
    fullname: string;
    avatarUrl: string;
  };
  replyTo?: { id: string; message: string; sender: { username: string } };
};

type PartnerStatus = {
  isOnline: boolean;
  lastSeen: string | null;
};

type ConversationUser = {
  id: string | number;
  username?: string;
  fullname?: string;
  avatarUrl?: string;
  is_online?: boolean;
  last_seen?: string | null;
};

type ConversationMember = {
  user_id: string | number;
  user?: ConversationUser;
};

type Conversation = {
  id: string;
  is_group: boolean;
  name?: string | null;
  members?: ConversationMember[];
};

type Props = {
  apiBase: string;
  socketUrl: string;
  conversationId: string;
  userId: string;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
  isShow: boolean;
};

const TypingBubble = () => (
  <div className="flex items-center gap-1 px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-full w-fit mb-2 ml-10">
    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-75" />
    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150" />
  </div>
);

// Skeleton khi đang tải tin nhắn lần đầu
const MessageSkeletonList = ({ count = 4 }: { count?: number }) => {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={cn(
            "flex w-full gap-2",
            idx % 2 === 0 ? "justify-start" : "justify-end"
          )}
        >
          {idx % 2 === 0 && (
            <div className="h-7 w-7 rounded-full bg-slate-800 animate-pulse mt-2" />
          )}
          <div
            className={cn(
              "max-w-[70%] flex flex-col gap-1",
              idx % 2 !== 0 ? "items-end" : "items-start"
            )}
          >
            <div className="px-4 py-3 rounded-2xl bg-slate-800/70 animate-pulse w-40 sm:w-56" />
            <div className="h-2 w-10 bg-slate-800/60 rounded-full animate-pulse" />
          </div>
          {idx % 2 !== 0 && (
            <div className="h-7 w-7 rounded-full bg-slate-800 animate-pulse mt-2" />
          )}
        </div>
      ))}
    </div>
  );
};

export default function MainMessage({
  apiBase,
  socketUrl,
  conversationId,
  userId,
  isShow,
  setIsShow,
}: Props) {
  // [CẤU HÌNH] API Base riêng cho Video Call
  const videoApiBase =
    process.env.NEXT_PUBLIC_VIDEO_API || "http://localhost:4004/api/v1/video";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  // State Chat
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [partnerStatus, setPartnerStatus] = useState<PartnerStatus>({
    isOnline: false,
    lastSeen: null,
  });
  const [conversation, setConversation] = useState<Conversation | null>(null);

  // Loading state
  const [initialLoading, setInitialLoading] = useState(true);

  // Đổi tên nhóm
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [renaming, setRenaming] = useState(false);

  // State Pagination
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [oldestCursor, setOldestCursor] = useState<string | null>(null);

  // State Actions
  const [deletingMessage, setDeletingMessage] = useState<ChatMessage | null>(
    null
  );
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);

  // Refs
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Refs for Typing Logic
  const sendTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const receiveTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingEmit = useRef<number>(0);

  const { locale } = useParams();

  const openVideoCallWindow = useCallback(
    (roomCode: string) => {
      const width = 1000;
      const height = 700;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;

      const url = `/${locale}/app/video-call/${roomCode}?userId=${userId}`;

      window.open(
        url,
        `VideoCall_${roomCode}`,
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=no,status=no`
      );
    },
    [locale, userId]
  );

  const lastReadMessageId = useMemo(() => {
    const mine = messages.filter(
      (m) => String(m.senderId || m.sender_id) === String(userId)
    );
    const readOnes = mine.filter((m) =>
      m.readBy?.some((r) => String(r.userId) !== String(userId))
    );
    return readOnes.length ? readOnes[readOnes.length - 1].id : null;
  }, [messages, userId]);

  // Reset states khi đổi conversation
  useEffect(() => {
    setIsPartnerTyping(false);
    if (sendTypingTimeoutRef.current)
      clearTimeout(sendTypingTimeoutRef.current);
    if (receiveTypingTimeoutRef.current)
      clearTimeout(receiveTypingTimeoutRef.current);
  }, [conversationId]);

  // =========================
  // SOCKET INITIALIZATION
  // =========================
  useEffect(() => {
    if (!userId || !conversationId) return;

    const socket = getChatSocket(userId, socketUrl);
    socketRef.current = socket;

    socket.emit("join-room", conversationId);

    const handleNewMessage = (msg: any) => {
      if (msg.conversation_id !== conversationId) return;
      setIsPartnerTyping(false);

      const shaped: ChatMessage = {
        id: msg.id,
        conversationId: msg.conversation_id,
        senderId: msg.senderId || msg.sender_id,
        sender_id: msg.sender_id,
        message: msg.message,
        status: msg.status || "show",
        createdAt: msg.created_at || msg.createdAt || new Date().toISOString(),
        readBy: (msg.readReceipts || []).map((r: any) => ({
          userId: String(r.user_id),
          read_at: r.read_at,
        })),
        sender: msg.sender,
        replyTo: msg.replyTo,
      };

      setMessages((prev) => {
        if (prev.find((m) => m.id === shaped.id)) return prev;
        return [...prev, shaped];
      });

      const sId = String(msg.senderId || msg.sender_id);
      if (sId !== String(userId)) {
        socket.emit("mark-read", {
          conversationId,
          readerId: userId,
          messageIds: [msg.id],
        });
      }
    };

    const handleMessageUpdated = (msg: any) => {
      if (msg.conversationId !== conversationId) return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id
            ? {
                ...m,
                status: msg.status || m.status,
                message:
                  msg.status === "recall"
                    ? "Tin nhắn đã được thu hồi"
                    : m.message,
              }
            : m
        )
      );
    };

    const handleMessagesRead = ({
      conversationId: cid,
      readerId,
      messageIds,
      readAt,
    }: any) => {
      if (cid !== conversationId) return;
      setMessages((prev) =>
        prev.map((m) => {
          if (!messageIds.includes(m.id)) return m;
          const exists = m.readBy?.some(
            (r) => String(r.userId) === String(readerId)
          );
          if (exists) return m;
          return {
            ...m,
            readBy: [
              ...(m.readBy || []),
              { userId: String(readerId), read_at: readAt },
            ],
          };
        })
      );
    };

    const handleTyping = (data: any) => {
      if (data.conversationId !== conversationId) return;
      if (String(data.userId) === String(userId)) return;

      const isTyping = Boolean(data.isTyping);
      setIsPartnerTyping(isTyping);

      if (receiveTypingTimeoutRef.current)
        clearTimeout(receiveTypingTimeoutRef.current);
      if (isTyping) {
        receiveTypingTimeoutRef.current = setTimeout(
          () => setIsPartnerTyping(false),
          5000
        );
      }
    };

    const handleUserPresence = ({
      userId: uid,
      isOnline,
      lastSeen,
    }: {
      userId: string;
      isOnline: boolean;
      lastSeen: string | null;
    }) => {
      if (conversation && !conversation.is_group) {
        const partner = conversation.members?.find((m) => m.user_id === uid);
        if (partner) {
          setPartnerStatus({ isOnline, lastSeen });
        }
      }
    };

    // [VIDEO CALL] Lắng nghe cuộc gọi đến
    const handleIncomingCall = (data: any) => {
      if (data.conversationId !== conversationId) return;
      if (data.callerId === userId) return;

      toast.custom(
        (t) => (
          <div className="bg-slate-950 border border-slate-700 p-4 rounded-lg shadow-xl w-80 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                VC
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-100">
                  Cuộc gọi đến
                </div>
                <div className="text-xs text-slate-400">
                  {data.callerName || "Người gọi"} đang gọi bạn
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toast.dismiss(t)}
              >
                Từ chối
              </Button>
              <Button
                size="sm"
                className="bg-green-600 text-white"
                onClick={() => {
                  toast.dismiss(t);
                  openVideoCallWindow(data.roomCode);
                }}
              >
                Tham gia
              </Button>
            </div>
          </div>
        ),
        { duration: 20000 }
      );
    };

    const handleConversationUpdated = (d: {
      conversationId: string;
      newName?: string;
    }) => {
      if (d.conversationId !== conversationId) return;
      if (!d.newName) return;

      setConversation((prev) => (prev ? { ...prev, name: d.newName } : prev));
    };

    socket.on("conversation-updated", handleConversationUpdated);
    socket.on("new-message", handleNewMessage);
    socket.on("message-updated", handleMessageUpdated);
    socket.on("messages-read", handleMessagesRead);
    socket.on("user-presence", handleUserPresence);
    socket.on("typing", handleTyping);
    socket.on("incoming-call", handleIncomingCall);

    return () => {
      socket.emit("leave-room", conversationId);
      socket.off("new-message", handleNewMessage);
      socket.off("message-updated", handleMessageUpdated);
      socket.off("messages-read", handleMessagesRead);
      socket.off("user-presence", handleUserPresence);
      socket.off("typing", handleTyping);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("conversation-updated", handleConversationUpdated);
    };
  }, [conversationId, userId, socketUrl, conversation, openVideoCallWindow]);

  // =========================
  // FETCH DATA & SCROLL
  // =========================
  useEffect(() => {
    if (!userId || !conversationId) return;

    const fetchData = async () => {
      setInitialLoading(true);
      try {
        const resC = await axios.get(
          `${apiBase}/conversations?user_id=${userId}`
        );
        const listRaw =
          (Array.isArray(resC.data) ? resC.data : resC.data.data) || [];
        const list = listRaw as Conversation[];
        const current = list.find((c) => c.id === conversationId) || null;
        setConversation(current);

        if (current && !current.is_group) {
          const other = current.members?.find(
            (m) => String(m.user_id) !== String(userId)
          );
          if (other?.user) {
            setPartnerStatus({
              isOnline: Boolean(other.user.is_online),
              lastSeen: other.user.last_seen ?? null,
            });
          }
        }

        const resM = await axios.get(`${apiBase}/${conversationId}/history`, {
          params: { userId, limit: 30 },
        });
        const raw = resM.data || [];
        const shaped: ChatMessage[] = raw.map((m: any) => ({
          id: m.id,
          conversationId: m.conversation_id,
          senderId: m.senderId || m.sender_id,
          sender_id: m.sender_id,
          message: m.message,
          status: m.status || "show",
          createdAt: m.created_at || m.createdAt || new Date().toISOString(),
          readBy: (m.readReceipts || m.read_by || []).map((r: any) => ({
            userId: String(r.user_id || r.userId),
            read_at: r.read_at,
          })),
          sender: m.sender,
          replyTo: m.replyTo,
        }));

        setMessages(shaped);
        if (shaped.length > 0) {
          setOldestCursor(shaped[0].createdAt);
          if (shaped.length < 30) setHasMore(false);
        } else {
          setHasMore(false);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, [conversationId, userId, apiBase]);

  useEffect(() => {
    if (!bottomRef.current) return;
    bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, conversationId, userId]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !messages.length) return;

    const unreadIds = messages
      .filter((m) => {
        const sender = String(m.senderId || m.sender_id);
        return (
          sender !== String(userId) &&
          !m.readBy?.some((r) => String(r.userId) === String(userId))
        );
      })
      .map((m) => m.id);

    if (!unreadIds.length) return;

    socket.emit("mark-read", {
      conversationId,
      readerId: userId,
      messageIds: unreadIds,
    });
  }, [messages, conversationId, userId]);

  // =========================
  // ACTIONS
  // =========================

  const handleOpenRename = () => {
    if (!conversation?.is_group) return;
    setNewGroupName(conversation.name || "");
    setIsRenameOpen(true);
  };

  const handleRenameGroup = async () => {
    if (!conversation?.is_group) return;

    const trimmed = newGroupName.trim();
    if (!trimmed) {
      toast.error("Vui lòng nhập tên nhóm mới");
      return;
    }

    setRenaming(true);
    try {
      const res = await axios.post(
        `${apiBase}/group/rename`,
        {
          conversationId,
          newName: trimmed,
        },
        {
          headers: {
            "x-user-id": userId,
          },
        }
      );

      const serverName = res.data?.newName ?? trimmed;

      setConversation((prev) => (prev ? { ...prev, name: serverName } : prev));

      toast.success("Đổi tên nhóm thành công");
      setIsRenameOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(
        (err as any)?.response?.data?.message ||
          "Đổi tên nhóm thất bại, vui lòng thử lại"
      );
    } finally {
      setRenaming(false);
    }
  };

  // [VIDEO CALL] Bắt đầu cuộc gọi
  const handleStartCall = async () => {
    try {
      const res = await axios.post(`${videoApiBase}/create`, {
        conversationId,
        hostId: userId,
      });

      if (res.data.success || res.data.room) {
        const code = res.data.room?.room_code || res.data.roomCode;
        openVideoCallWindow(code);
      }
    } catch {
      toast.error("Lỗi tạo cuộc gọi");
    }
  };

  const loadMore = async () => {
    if (!hasMore || loadingMore || !oldestCursor) return;
    setLoadingMore(true);
    try {
      const res = await axios.get(`${apiBase}/${conversationId}/history`, {
        params: { userId, limit: 20, cursor: oldestCursor },
      });
      const raw = res.data || [];
      const shaped: ChatMessage[] = raw.map((m: any) => ({
        id: m.id,
        conversationId: m.conversation_id,
        senderId: m.senderId || m.sender_id,
        sender_id: m.sender_id,
        message: m.message,
        status: m.status || "show",
        createdAt: m.created_at || m.createdAt || new Date().toISOString(),
        readBy: (m.readReceipts || m.read_by || []).map((r: any) => ({
          userId: String(r.user_id || r.userId),
          read_at: r.read_at,
        })),
        sender: m.sender,
        replyTo: m.replyTo,
      }));
      setMessages((prev) => [...shaped.reverse(), ...prev]);
      if (shaped.length < 20) setHasMore(false);
      if (shaped.length > 0) setOldestCursor(shaped[0].createdAt);
    } catch {
      toast.error("Lỗi tải tin nhắn cũ");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const txt = input.trim();
    setInput("");
    const replyBackup = replyingTo;
    setReplyingTo(null);

    if (socketRef.current) {
      socketRef.current.emit("typing", {
        conversationId,
        userId,
        isTyping: false,
      });
      if (sendTypingTimeoutRef.current)
        clearTimeout(sendTypingTimeoutRef.current);
    }

    try {
      const res = await axios.post(`${apiBase}/send`, {
        conversationId,
        senderId: userId,
        message: txt,
        replyToId: replyBackup?.id,
      });
      const created = res?.data;
      if (created && created.id) {
        const shaped: ChatMessage = {
          id: created.id,
          conversationId: created.conversation_id || conversationId,
          senderId: created.senderId || created.sender_id || userId,
          sender_id: created.sender_id || userId,
          message: created.message,
          status: created.status || "show",
          createdAt:
            created.created_at || created.createdAt || new Date().toISOString(),
          readBy: (created.readReceipts || []).map((r: any) => ({
            userId: String(r.user_id),
            read_at: r.read_at,
          })),
          sender: created.sender,
          replyTo: created.replyTo,
        };
        setMessages((prev) => {
          if (prev.find((m) => m.id === shaped.id)) return prev;
          return [...prev, shaped];
        });
      }
    } catch {
      toast.error("Gửi tin nhắn thất bại");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    const now = Date.now();
    const socket = socketRef.current;
    if (!socket) return;

    if (now - lastTypingEmit.current > 400) {
      socket.emit("typing", {
        conversationId,
        userId,
        isTyping: value.trim().length > 0,
      });
      lastTypingEmit.current = now;
    }
    if (sendTypingTimeoutRef.current)
      clearTimeout(sendTypingTimeoutRef.current);
    sendTypingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", { conversationId, userId, isTyping: false });
    }, 2000);
  };

  const handleConfirmDelete = async () => {
    if (!deletingMessage) return;
    try {
      await axios.post(
        `${apiBase}/message/${deletingMessage.id}/delete`,
        {},
        { headers: { "x-user-id": userId } }
      );
      setDeletingMessage(null);
    } catch {
      toast.error("Thu hồi tin nhắn thất bại");
    }
  };

  const title = conversation?.is_group
    ? conversation.name || "Nhóm"
    : conversation?.members?.find((m) => String(m.user_id) !== String(userId))
        ?.user?.username || "Đối tác";

  console.log(isShow, setIsShow);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#050816] via-[#020617] to-[#000000] text-slate-50">
      {/* HEADER */}
      <div className="h-16 border-b border-slate-800 px-4 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 z-10">
        <div className="flex items-center gap-3">
          <div>
            <Menu onClick={() => setIsShow(true)} className="block md:hidden" />
          </div>
          <div className="relative">
            <Avatar className="h-10 w-10 shadow-sm">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-tr from-blue-500 to-indigo-500 text-white font-bold">
                {title?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {partnerStatus.isOnline && !conversation?.is_group && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full" />
            )}
          </div>
          <div>
            <div className="font-semibold text-slate-100">{title}</div>
            <div className="text-xs text-slate-400">
              {conversation?.is_group ? (
                `${conversation.members?.length || 0} thành viên`
              ) : isPartnerTyping ? (
                <span className="text-blue-400 font-medium animate-pulse">
                  Đang nhập...
                </span>
              ) : partnerStatus.isOnline ? (
                <span className="text-green-400">Đang hoạt động</span>
              ) : (
                formatLastSeen(partnerStatus.lastSeen)
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {conversation?.is_group && (
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full hover:bg-slate-700 text-slate-300"
              onClick={handleOpenRename}
            >
              <Pencil className="w-4 h-4" />
            </Button>
          )}

          <Button
            size="icon"
            variant="ghost"
            className="rounded-full hover:bg-slate-700 text-slate-300"
            onClick={handleStartCall}
          >
            <Phone />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full hover:bg-slate-700 text-slate-300"
            onClick={handleStartCall}
          >
            <VideoIcon />
          </Button>
        </div>
      </div>

      {/* DIALOG ĐỔI TÊN NHÓM */}
      <Dialog
        open={isRenameOpen}
        onOpenChange={(open) => {
          setIsRenameOpen(open);
          if (!open && conversation?.is_group) {
            setNewGroupName(conversation.name || "");
          }
        }}
      >
        <DialogContent className="bg-slate-950 border border-slate-800">
          <DialogHeader>
            <DialogTitle>Đổi tên nhóm</DialogTitle>
          </DialogHeader>

          <div className="mt-3 space-y-2">
            <label className="text-xs text-slate-400">Tên nhóm mới</label>
            <Input
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Nhập tên nhóm mới..."
              className="bg-slate-900 border-slate-700 text-sm"
            />
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRenameOpen(false)}
              className="h-8 px-3 text-slate-300 hover:bg-slate-800"
            >
              Hủy
            </Button>
            <Button
              size="sm"
              disabled={renaming}
              onClick={handleRenameGroup}
              className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {renaming ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-3 flex flex-col gap-2">
          {hasMore && !initialLoading && (
            <div className="flex justify-center mb-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-slate-700 text-slate-300 hover:bg-slate-800"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? "Đang tải..." : "Tải thêm tin nhắn cũ"}
              </Button>
            </div>
          )}

          {/* Loading lần đầu: hiển thị skeleton */}
          {initialLoading && !messages.length ? (
            <MessageSkeletonList />
          ) : (
            <>
              {messages.map((msg) => {
                const rawSenderId = msg.senderId || msg.sender_id;
                const isMine = String(rawSenderId) === String(userId);
                const isRecalled = msg.status === "recall";
                const isReadByOthers = msg.readBy?.some(
                  (r) => String(r.userId) !== String(userId)
                );

                const isLastRead =
                  msg.id === lastReadMessageId && Boolean(isReadByOthers);

                const readers =
                  isLastRead && conversation
                    ? (msg.readBy || [])
                        .filter((r) => String(r.userId) !== String(userId))
                        .map(
                          (r) =>
                            conversation.members?.find(
                              (m) =>
                                m.user && String(m.user.id) === String(r.userId)
                            )?.user
                        )
                        .filter(Boolean)
                    : [];

                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex w-full group gap-2",
                      isMine ? "justify-end" : "justify-start"
                    )}
                  >
                    {!isMine && (
                      <Avatar className="h-7 w-7 mt-5">
                        <AvatarImage src={msg.sender?.avatarUrl} />
                        <AvatarFallback className="bg-slate-700 text-xs font-bold text-slate-100">
                          {msg.sender?.username?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={cn(
                        "max-w-[70%] relative",
                        isMine ? "order-1" : "order-2"
                      )}
                    >
                      {msg.replyTo && (
                        <div className="text-xs bg-slate-800/70 text-slate-200 p-1.5 rounded mb-1 border-l-2 border-blue-500">
                          <div className="font-bold text-blue-400">
                            {msg.replyTo.sender?.username || "User"}
                          </div>
                          <div className="line-clamp-2">
                            {msg.replyTo.message}
                          </div>
                        </div>
                      )}

                      <div
                        className={cn(
                          "px-4 py-2 rounded-2xl text-sm shadow-sm",
                          isMine
                            ? "bg-blue-600 text-white rounded-br-sm"
                            : "bg-slate-900 text-slate-100 border border-slate-700 rounded-bl-sm",
                          isRecalled &&
                            "italic text-slate-500 bg-slate-800 border-none"
                        )}
                      >
                        {isRecalled ? "Tin nhắn đã thu hồi" : msg.message}
                      </div>

                      <div
                        className={cn(
                          "text-[10px] flex gap-1 mt-1 text-slate-400 items-center",
                          isMine ? "justify-end" : "justify-start"
                        )}
                      >
                        <span>{formatMessageTime(msg.createdAt)}</span>
                        {isMine && !isRecalled && isLastRead && (
                          <CheckCheck size={14} className="text-blue-500" />
                        )}
                      </div>

                      {isMine && isLastRead && readers.length > 0 && (
                        <div className="flex justify-end mt-1 gap-1">
                          {readers.map((u, idx) =>
                            u ? (
                              <Avatar
                                key={`${msg.id}-reader-${u.id}-${idx}`}
                                className="h-4 w-4 border border-slate-900"
                              >
                                <AvatarImage src={u.avatarUrl || ""} />
                                <AvatarFallback className="text-[9px] bg-slate-700 text-slate-100">
                                  {u.username?.[0]?.toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                            ) : null
                          )}
                        </div>
                      )}

                      {!isRecalled && (
                        <div
                          className={cn(
                            "opacity-0 group-hover:opacity-100 absolute top-0 flex gap-1 transition-opacity",
                            isMine ? "-left-16" : "-right-10"
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => setReplyingTo(msg)}
                            className="w-6 h-6 rounded-full bg-slate-800/80 flex items-center justify-center hover:bg-slate-700"
                          >
                            <Reply size={14} />
                          </button>
                          {isMine && (
                            <button
                              type="button"
                              onClick={() => setDeletingMessage(msg)}
                              className="w-6 h-6 rounded-full bg-slate-800/80 flex items-center justify-center hover:bg-red-600/80 text-red-200"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isPartnerTyping && <TypingBubble />}

              <div ref={bottomRef} />
            </>
          )}
        </div>
      </div>

      {/* INPUT */}
      <div className="p-4 bg-[#050816] border-t border-slate-800">
        {replyingTo && (
          <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg mb-2 border-l-4 border-blue-500 shadow-sm">
            <div className="text-sm overflow-hidden">
              <div className="text-xs text-slate-400 mb-1">Đang trả lời</div>
              <div className="text-xs font-medium text-slate-200 line-clamp-1">
                {replyingTo.sender?.username || "Tin nhắn"}
              </div>
              <div className="text-xs text-slate-300 line-clamp-1">
                {replyingTo.message}
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="text-slate-400 hover:text-slate-200"
              onClick={() => setReplyingTo(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder={
              initialLoading ? "Đang tải tin nhắn..." : "Nhập tin nhắn..."
            }
            disabled={initialLoading}
            className="flex-1 rounded-full border-slate-700 bg-slate-900/80 text-slate-100 placeholder:text-slate-500 focus-visible:ring-blue-500 disabled:opacity-60"
          />
          <Button
            type="submit"
            size="icon"
            disabled={initialLoading}
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-transform active:scale-95 disabled:opacity-60"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>

      {/* MODAL THU HỒI */}
      {deletingMessage && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-xl shadow-xl p-5 w-full max-w-sm border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-100 mb-2">
              Thu hồi tin nhắn?
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Tin nhắn sẽ bị thu hồi đối với tất cả mọi người trong cuộc trò
              chuyện.
            </p>
            <div className="bg-slate-800/70 rounded-lg px-3 py-2 text-xs text-slate-200 mb-4">
              {deletingMessage.message}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeletingMessage(null)}
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="bg-red-600 hover:bg-red-700"
                onClick={handleConfirmDelete}
              >
                Thu hồi
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
