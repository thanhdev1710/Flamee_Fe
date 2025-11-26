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

// ================= TYPES =================
type ReadByEntry = {
  userId: string;
  read_at: string | null;
};

type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string | number;
  sender_id?: string | number;
  message: string;
  status: "show" | "recall";
  createdAt: string;
  readBy?: ReadByEntry[];
  sender?: {
    id: string | number;
    username?: string;
    fullname?: string;
    avatarUrl?: string;
  };
  replyTo?: {
    id: string;
    message: string;
    sender: { username?: string; fullname?: string };
  };
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

// =============== UI PHỤ ===============
const TypingBubble = () => (
  <div className="flex items-center gap-1 px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-full w-fit mb-2 ml-10 animate-in fade-in zoom-in duration-300">
    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-75" />
    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150" />
  </div>
);

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
        </div>
      ))}
    </div>
  );
};

// =============== MAIN ===============
export default function MainMessage({
  apiBase,
  socketUrl,
  conversationId,
  userId,
  isShow,
  setIsShow,
}: Props) {
  const videoApiBase = process.env.NEXT_PUBLIC_VIDEO_API;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [partnerStatus, setPartnerStatus] = useState<PartnerStatus>({
    isOnline: false,
    lastSeen: null,
  });
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [oldestCursor, setOldestCursor] = useState<string | null>(null);
  const [deletingMessage, setDeletingMessage] = useState<ChatMessage | null>(
    null
  );
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const sendTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const receiveTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingEmit = useRef<number>(0);
  const { locale } = useParams();

  // =======================
  //  TIN MỚI NHẤT ĐÃ ĐỌC → cho avatar "Đã xem"
  // =======================
  const lastReadMessageId = useMemo(() => {
    const mine = messages.filter(
      (m) => String(m.senderId || m.sender_id) === String(userId)
    );
    const readOnes = mine.filter((m) =>
      m.readBy?.some(
        (r) => String(r.userId) !== String(userId) && r.read_at != null
      )
    );
    if (!readOnes.length) return null;
    return readOnes[readOnes.length - 1].id;
  }, [messages, userId]);

  // =======================
  // VIDEO CALL
  // =======================
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
        `width=${width},height=${height},top=${top},left=${left},resizable=yes`
      );
    },
    [locale, userId]
  );

  const handleStartCall = async () => {
    try {
      const res = await axios.post(`${videoApiBase}/create`, {
        conversationId,
        hostId: userId,
      });
      if (res.data?.room || res.data?.roomCode) {
        openVideoCallWindow(res.data.room?.room_code || res.data.roomCode);
      }
    } catch {
      toast.error("Lỗi tạo cuộc gọi");
    }
  };

  // =======================
  // SOCKET
  // =======================
  useEffect(() => {
    if (!userId || !conversationId) return;

    const socket = getChatSocket(userId, socketUrl);
    socketRef.current = socket;

    socket.emit("join-room", conversationId);

    const handleNewMessage = (msg: any) => {
      if (String(msg.conversation_id) !== String(conversationId)) return;

      setIsPartnerTyping(false);

      const shaped: ChatMessage = {
        id: msg.id,
        conversationId: String(msg.conversation_id),
        senderId: msg.senderId || msg.sender_id,
        sender_id: msg.sender_id,
        message: msg.message,
        status: msg.status || "show",
        createdAt: msg.createdAt || msg.created_at || new Date().toISOString(),
        readBy: (msg.readReceipts || msg.read_by || []).map((r: any) => ({
          userId: String(r.user_id || r.userId),
          read_at: r.read_at,
        })),
        sender: msg.sender,
        replyTo: msg.replyTo
          ? {
              id: msg.replyTo.id,
              message: msg.replyTo.message,
              sender: {
                username: msg.replyTo.sender?.username,
                fullname: msg.replyTo.sender?.fullname,
              },
            }
          : undefined,
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

    const handleMessagesRead = (data: any) => {
      const { conversationId: cid, readerId, messageIds, readAt } = data;
      if (String(cid) !== String(conversationId)) return;

      setMessages((prev) =>
        prev.map((m) => {
          if (!messageIds.includes(m.id)) return m;
          const nextReadBy = [...(m.readBy || [])];
          const idx = nextReadBy.findIndex(
            (r) => String(r.userId) === String(readerId)
          );
          const time = readAt || new Date().toISOString();
          if (idx !== -1) {
            nextReadBy[idx] = { ...nextReadBy[idx], read_at: time };
          } else {
            nextReadBy.push({ userId: String(readerId), read_at: time });
          }
          return { ...m, readBy: nextReadBy };
        })
      );
    };

    const handleTyping = (data: any) => {
      if (String(data.conversationId) !== String(conversationId)) return;
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

    const handleUserPresence = (data: any) => {
      if (conversation && !conversation.is_group) {
        const partner = conversation.members?.find(
          (m) => String(m.user_id) === String(data.userId)
        );
        if (partner) {
          setPartnerStatus({
            isOnline: data.isOnline,
            lastSeen: data.lastSeen,
          });
        }
      }
    };

    const handleMessageUpdated = (msg: any) => {
      if (String(msg.conversationId) !== String(conversationId)) return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id
            ? {
                ...m,
                status: msg.status,
                message:
                  msg.status === "recall" ? "Tin nhắn đã thu hồi" : m.message,
              }
            : m
        )
      );
    };

    const handleConversationUpdated = (d: any) => {
      if (String(d.conversationId) === String(conversationId) && d.newName) {
        setConversation((prev) => (prev ? { ...prev, name: d.newName } : prev));
      }
    };

    const handleIncomingCall = (data: any) => {
      if (
        String(data.conversationId) !== String(conversationId) ||
        String(data.callerId) === String(userId)
      )
        return;

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
                  {data.callerName} đang gọi...
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

    socket.on("new-message", handleNewMessage);
    socket.on("messages-read", handleMessagesRead);
    socket.on("typing", handleTyping);
    socket.on("user-presence", handleUserPresence);
    socket.on("message-updated", handleMessageUpdated);
    socket.on("conversation-updated", handleConversationUpdated);
    socket.on("incoming-call", handleIncomingCall);

    return () => {
      socket.emit("leave-room", conversationId);
      socket.off("new-message", handleNewMessage);
      socket.off("messages-read", handleMessagesRead);
      socket.off("typing", handleTyping);
      socket.off("user-presence", handleUserPresence);
      socket.off("message-updated", handleMessageUpdated);
      socket.off("conversation-updated", handleConversationUpdated);
      socket.off("incoming-call", handleIncomingCall);
    };
  }, [conversationId, userId, socketUrl, conversation, openVideoCallWindow]);

  // =======================
  // SCROLL BOTTOM KHI CÓ TIN MỚI
  // =======================
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages.length, conversationId]);

  // =======================
  // AUTO MARK READ (CLIENT)
  // =======================
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !messages.length) return;

    const unreadIds = messages
      .filter((m) => {
        const sender = String(m.senderId || m.sender_id);
        const isMine = sender === String(userId);
        const isReadByMe = m.readBy?.some(
          (r) => String(r.userId) === String(userId) && r.read_at
        );
        return !isMine && !isReadByMe;
      })
      .map((m) => m.id);

    if (unreadIds.length > 0) {
      socket.emit("mark-read", {
        conversationId,
        readerId: userId,
        messageIds: unreadIds,
      });
    }
  }, [messages, conversationId, userId]);

  // =======================
  // FETCH INITIAL (khi đổi conv → reset)
  // =======================
  useEffect(() => {
    if (!userId || !conversationId) return;

    const LIMIT = 30;

    const fetchData = async () => {
      setInitialLoading(true);
      setMessages([]);
      setHasMore(true);
      setOldestCursor(null);

      try {
        const [resC, resM] = await Promise.all([
          axios.get(`${apiBase}/conversations?user_id=${userId}`),
          axios.get(`${apiBase}/${conversationId}/history`, {
            params: { userId, limit: LIMIT },
          }),
        ]);

        const listRaw = (
          Array.isArray(resC.data) ? resC.data : resC.data.data
        ) as Conversation[];
        const current =
          listRaw?.find((c) => String(c.id) === String(conversationId)) || null;
        setConversation(current || null);

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

        const rawMsgs = resM.data || [];
        const shaped: ChatMessage[] = rawMsgs.map((m: any) => ({
          id: m.id,
          conversationId: String(m.conversation_id),
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
          replyTo: m.replyTo
            ? {
                id: m.replyTo.id,
                message: m.replyTo.message,
                sender: {
                  username: m.replyTo.sender?.username,
                  fullname: m.replyTo.sender?.fullname,
                },
              }
            : undefined,
        }));

        // BACKEND đã trả ASC (cũ → mới) do rows.reverse() rồi
        setMessages(shaped);

        if (shaped.length > 0) {
          setOldestCursor(shaped[0].createdAt); // tin cũ nhất hiện tại
          if (shaped.length < LIMIT) setHasMore(false);
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

  // =======================
  // HANDLERS
  // =======================
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    const now = Date.now();
    const socket = socketRef.current;
    if (socket && now - lastTypingEmit.current > 400) {
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
      socket?.emit("typing", { conversationId, userId, isTyping: false });
    }, 2000);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const txt = input.trim();
    const replyId = replyingTo?.id;
    setInput("");
    setReplyingTo(null);

    socketRef.current?.emit("typing", {
      conversationId,
      userId,
      isTyping: false,
    });

    try {
      await axios.post(`${apiBase}/send`, {
        conversationId,
        senderId: userId,
        message: txt,
        replyToId: replyId,
      });
    } catch {
      toast.error("Gửi thất bại");
    }
  };

  const loadMore = async () => {
    if (!hasMore || loadingMore || !oldestCursor) return;
    setLoadingMore(true);
    try {
      const LIMIT = 20;
      const res = await axios.get(`${apiBase}/${conversationId}/history`, {
        params: { userId, limit: LIMIT, cursor: oldestCursor },
      });
      const raw = res.data || [];
      const shaped: ChatMessage[] = raw.map((m: any) => ({
        id: m.id,
        conversationId: String(m.conversation_id),
        senderId: m.senderId || m.sender_id,
        sender_id: m.sender_id,
        message: m.message,
        status: m.status || "show",
        createdAt: m.created_at || m.createdAt,
        readBy: (m.readReceipts || m.read_by || []).map((r: any) => ({
          userId: String(r.user_id || r.userId),
          read_at: r.read_at,
        })),
        sender: m.sender,
        replyTo: m.replyTo
          ? {
              id: m.replyTo.id,
              message: m.replyTo.message,
              sender: {
                username: m.replyTo.sender?.username,
                fullname: m.replyTo.sender?.fullname,
              },
            }
          : undefined,
      }));

      if (shaped.length > 0) {
        // shaped là chunk cũ hơn (ASC) → prepend vào đầu
        setMessages((prev) => [...shaped, ...prev]);
        setOldestCursor(shaped[0].createdAt);
      }
      if (shaped.length < LIMIT) setHasMore(false);
    } catch {
      toast.error("Lỗi tải tin cũ");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleRenameGroup = async () => {
    if (!conversation?.is_group || !newGroupName.trim()) return;
    setRenaming(true);
    try {
      await axios.post(
        `${apiBase}/group/rename`,
        {
          conversationId,
          newName: newGroupName.trim(),
        },
        { headers: { "x-user-id": userId } }
      );
      setIsRenameOpen(false);
      toast.success("Đổi tên thành công");
    } catch {
      toast.error("Lỗi đổi tên");
    } finally {
      setRenaming(false);
    }
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
      toast.error("Lỗi thu hồi");
    }
  };

  const title = conversation?.is_group
    ? conversation.name
    : conversation?.members?.find((m) => String(m.user_id) !== String(userId))
        ?.user?.username || "Chat";

  // =======================
  // RENDER
  // =======================
  return (
    <div className="flex flex-col h-full bg-linear-to-b from-[#050816] via-[#020617] to-[#000000] text-slate-50 relative">
      {/* HEADER */}
      <div className="h-16 border-b border-slate-800 px-4 flex items-center justify-between bg-slate-900/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <Menu
            onClick={() => setIsShow(!isShow)}
            className="block md:hidden cursor-pointer hover:text-blue-400"
          />
          <div className="relative">
            <Avatar className="h-10 w-10 border border-slate-700">
              <AvatarImage src="" />
              <AvatarFallback className="bg-blue-600 font-bold">
                {title?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!conversation?.is_group && partnerStatus.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full shadow-lg shadow-green-500/50" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm md:text-base">{title}</span>
            <span className="text-[10px] md:text-xs text-slate-400">
              {conversation?.is_group ? (
                `${conversation.members?.length ?? 0} thành viên`
              ) : isPartnerTyping ? (
                <span className="text-blue-400 font-medium animate-pulse">
                  Đang soạn tin...
                </span>
              ) : partnerStatus.isOnline ? (
                <span className="text-green-400">Đang hoạt động</span>
              ) : (
                formatLastSeen(partnerStatus.lastSeen)
              )}
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          {conversation?.is_group && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setNewGroupName(conversation.name || "");
                setIsRenameOpen(true);
              }}
            >
              <Pencil className="w-4 h-4" />
            </Button>
          )}
          <Button size="icon" variant="ghost" onClick={handleStartCall}>
            <Phone className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleStartCall}>
            <VideoIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 scroll-smooth">
        {hasMore && !initialLoading && (
          <div className="flex justify-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-slate-400 hover:text-white"
              onClick={loadMore}
              disabled={loadingMore}
            >
              {loadingMore ? "Đang tải..." : "Tải tin nhắn cũ"}
            </Button>
          </div>
        )}

        {initialLoading ? (
          <MessageSkeletonList />
        ) : (
          <div className="flex flex-col gap-1.5">
            {messages.map((msg) => {
              const isMine =
                String(msg.senderId || msg.sender_id) === String(userId);
              const isRecalled = msg.status === "recall";

              const isReadByOthers = msg.readBy?.some(
                (r) => String(r.userId) !== String(userId) && r.read_at
              );
              const isLastRead =
                isMine && isReadByOthers && msg.id === lastReadMessageId;

              const readers =
                isLastRead && conversation
                  ? (msg.readBy || [])
                      .filter(
                        (r) => String(r.userId) !== String(userId) && r.read_at
                      )
                      .map(
                        (r) =>
                          conversation.members?.find(
                            (m) => String(m.user_id) === String(r.userId)
                          )?.user
                      )
                      .filter(Boolean)
                  : [];

              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex w-full group animate-in fade-in slide-in-from-bottom-2 duration-300",
                    isMine ? "justify-end" : "justify-start"
                  )}
                >
                  {!isMine && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarImage src={msg.sender?.avatarUrl} />
                      <AvatarFallback className="bg-slate-700 text-[10px]">
                        {msg.sender?.username?.[0] || msg.sender?.fullname?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      "flex flex-col max-w-[75%] md:max-w-[60%] relative",
                      isMine ? "items-end" : "items-start"
                    )}
                  >
                    {msg.replyTo && (
                      <div className="mb-1 px-3 py-1.5 bg-slate-800/50 rounded-lg border-l-2 border-blue-500 text-xs text-slate-300 cursor-pointer hover:bg-slate-800">
                        <span className="font-bold text-blue-400 block">
                          {msg.replyTo.sender?.username ||
                            msg.replyTo.sender?.fullname}
                        </span>
                        <span className="line-clamp-1 italic">
                          {msg.replyTo.message}
                        </span>
                      </div>
                    )}

                    <div
                      className={cn(
                        "px-4 py-2 text-sm shadow-md wrap-break-word",
                        isMine
                          ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
                          : "bg-slate-800 text-slate-100 rounded-2xl rounded-tl-sm border border-slate-700",
                        isRecalled &&
                          "bg-transparent border border-slate-600 text-slate-400 italic"
                      )}
                    >
                      {isRecalled ? "Tin nhắn đã thu hồi" : msg.message}
                    </div>

                    <div className="flex items-center gap-1 mt-0.5 px-1">
                      <span className="text-[9px] text-slate-500">
                        {formatMessageTime(msg.createdAt)}
                      </span>
                      {/* ✅ Hiển thị cho TẤT CẢ tin nhắn mình gửi đã được người khác đọc */}
                      {isMine && !isRecalled && isReadByOthers && (
                        <CheckCheck className="w-3 h-3 text-blue-400" />
                      )}
                    </div>

                    {/* Hàng avatar "Đã xem" chỉ gắn vào tin mới nhất đã đọc */}
                    {isLastRead && readers.length > 0 && (
                      <div className="flex items-center justify-end -space-x-1 mt-1">
                        {readers.map((u: any, idx: number) => (
                          <Avatar
                            key={idx}
                            className="w-3 h-3 border border-black ring-1 ring-slate-800"
                          >
                            <AvatarImage src={u?.avatarUrl} />
                            <AvatarFallback className="text-[5px]">
                              {u?.username?.[0] || u?.fullname?.[0]}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    )}

                    {!isRecalled && (
                      <div
                        className={cn(
                          "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1",
                          isMine ? "-left-14" : "-right-14"
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => setReplyingTo(msg)}
                          className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                          <Reply size={12} />
                        </button>
                        {isMine && (
                          <button
                            type="button"
                            onClick={() => setDeletingMessage(msg)}
                            className="p-1.5 rounded-full bg-slate-800 hover:bg-red-900/50 text-red-400"
                          >
                            <Trash2 size={12} />
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
          </div>
        )}
      </div>

      {/* INPUT */}
      <div className="p-3 md:p-4 bg-[#050816] border-t border-slate-800/50 z-20">
        {replyingTo && (
          <div className="flex justify-between items-center bg-slate-900/80 p-2 rounded-lg mb-2 border-l-4 border-blue-500 animate-in slide-in-from-bottom-2">
            <div className="text-xs">
              <div className="text-slate-400">
                Đang trả lời{" "}
                <span className="font-bold text-slate-200">
                  {replyingTo.sender?.username || replyingTo.sender?.fullname}
                </span>
              </div>
              <div className="text-slate-300 line-clamp-1 italic">
                {replyingTo.message}
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => setReplyingTo(null)}
            >
              <X size={14} />
            </Button>
          </div>
        )}

        <form onSubmit={handleSend} className="flex gap-2 items-end">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Nhập tin nhắn..."
            className="rounded-xl border-slate-700 bg-slate-900 text-slate-100 focus-visible:ring-blue-500"
            disabled={initialLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-xl bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition-all active:scale-95"
            disabled={!input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>

      {/* DIALOG THU HỒI */}
      {deletingMessage && (
        <Dialog
          open={!!deletingMessage}
          onOpenChange={(o) => !o && setDeletingMessage(null)}
        >
          <DialogContent className="bg-slate-950 border-slate-800 text-slate-100">
            <DialogHeader>
              <DialogTitle>Thu hồi tin nhắn?</DialogTitle>
            </DialogHeader>
            <div className="text-sm text-slate-400">
              Tin nhắn sẽ bị gỡ khỏi cuộc trò chuyện với tất cả thành viên.
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setDeletingMessage(null)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Thu hồi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* DIALOG ĐỔI TÊN NHÓM */}
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent className="bg-slate-950 border-slate-800">
          <DialogHeader>
            <DialogTitle>Đổi tên nhóm</DialogTitle>
          </DialogHeader>
          <Input
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Tên nhóm mới..."
            className="bg-slate-900 border-slate-700"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsRenameOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleRenameGroup} disabled={renaming}>
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
