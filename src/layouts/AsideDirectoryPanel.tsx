/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MoreVertical,
  Shield,
  UserPlus,
  LogOut,
  Trash2,
  UserMinus,
  UserCog,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { formatLastSeen } from "@/utils/time";
import { cn } from "@/lib/utils";
import { getFriendSuggestions } from "@/services/follow.service";
import type {
  GetFriendSuggestionsResult,
  ProfileSummary,
} from "@/types/follow.type";
import {
  SkeletonMembersPanel,
  PulseLoading,
} from "@/components/ui/loading-skeleton";
import type { Socket } from "socket.io-client";
import { getChatSocket } from "@/lib/chatSocket";
import { CLIENT_CONFIG } from "@/global/config";

type UserRole = "admin" | "member";

type UserBasic = {
  id: string;
  username?: string;
  fullname?: string;
  avatarUrl?: string | null;
  is_online?: boolean;
  last_seen?: string | Date | null;
  role: UserRole;
};

type ConversationMemberRaw = {
  conversation_id: string;
  user_id: string;
  role: UserRole;
  user?: {
    id: string;
    fullname: string | null;
    username: string | null;
    avatarUrl: string | null;
    is_online: boolean;
    last_seen: string | Date | null;
  } | null;
};

type ConversationItem = {
  id: string;
  is_group: boolean;
  members: ConversationMemberRaw[];
};

type ConfirmActionState =
  | { type: null; targetId?: undefined; targetName?: undefined }
  | { type: "leave"; targetId?: undefined; targetName?: undefined }
  | { type: "disband"; targetId?: undefined; targetName?: undefined }
  | { type: "kick" | "transfer"; targetId: string; targetName?: string };

type AsideDirectoryPanelProps = {
  currentUserId: string;
};

export default function AsideDirectoryPanelEnhanced({
  currentUserId,
}: AsideDirectoryPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conv");

  const [members, setMembers] = useState<UserBasic[]>([]);
  const [isGroup, setIsGroup] = useState(false);
  const [amIAdmin, setAmIAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [openAdd, setOpenAdd] = useState(false);
  const [friends, setFriends] = useState<ProfileSummary[]>([]);
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [isAddingMembers, setIsAddingMembers] = useState(false);

  const [confirmAction, setConfirmAction] = useState<ConfirmActionState>({
    type: null,
  });
  const [isExecuting, setIsExecuting] = useState(false);

  // =========================
  // FETCH INFO CONVERSATION
  // =========================
  const fetchInfo = useCallback(async () => {
    if (!conversationId || !currentUserId) return;

    setIsLoading(true);
    try {
      const res = await axios.get<
        ConversationItem[] | { data: ConversationItem[] }
      >(`${CLIENT_CONFIG.API.CHAT_URL}/conversations?user_id=${currentUserId}`);

      const all: ConversationItem[] = Array.isArray(res.data)
        ? res.data
        : Array.isArray((res.data as { data: ConversationItem[] }).data)
        ? (res.data as { data: ConversationItem[] }).data
        : [];

      const cur = all.find((c) => c.id === conversationId);

      if (!cur) {
        setMembers([]);
        setIsGroup(false);
        setAmIAdmin(false);
        return;
      }

      setIsGroup(cur.is_group);

      if (cur.members && cur.members.length > 0) {
        const formattedMembers: UserBasic[] = cur.members.map((m) => {
          const u = m.user;
          return {
            id: u?.id ?? m.user_id,
            username: u?.username ?? undefined,
            fullname: u?.fullname ?? undefined,
            avatarUrl: u?.avatarUrl ?? null,
            is_online: u?.is_online ?? false,
            last_seen: u?.last_seen ?? null,
            role: m.role ?? "member",
          };
        });

        setMembers(formattedMembers);

        const myInfo = formattedMembers.find((m) => m.id === currentUserId);
        setAmIAdmin(myInfo?.role === "admin");
      } else {
        setMembers([]);
        setAmIAdmin(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi tải thông tin hội thoại");
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, currentUserId]);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  const fetchInfoRef = useRef(fetchInfo);
  useEffect(() => {
    fetchInfoRef.current = fetchInfo;
  }, [fetchInfo]);

  // =========================
  // SOCKET REALTIME
  // =========================
  useEffect(() => {
    if (!currentUserId || !conversationId) return;

    const socket: Socket = getChatSocket(currentUserId);
    // join vào room của cuộc trò chuyện
    socket.emit("join-room", conversationId);

    // user-presence: cập nhật online / last_seen
    const handlePresence = (d: any) => {
      setMembers((prev) =>
        prev.map((m) =>
          String(m.id) === String(d.userId)
            ? { ...m, is_online: d.isOnline, last_seen: d.lastSeen }
            : m
        )
      );
    };

    // members-added: thêm thành viên mới vào danh sách
    const handleMembersAdded = (data: any) => {
      if (data.conversationId !== conversationId) return;

      const newMembers: UserBasic[] = (data.members || []).map((u: any) => ({
        id: u.id,
        username: u.username,
        fullname: u.fullname,
        avatarUrl: u.avatarUrl,
        is_online: u.is_online,
        last_seen: u.last_seen,
        role: "member",
      }));

      setMembers((prev) => {
        const ids = prev.map((m) => m.id);
        const unique = newMembers.filter((nm) => !ids.includes(nm.id));
        return [...prev, ...unique];
      });
    };

    // member-removed / member-left: loại khỏi danh sách
    const handleMemberRemoved = (data: any) => {
      if (data.conversationId !== conversationId) return;
      setMembers((prev) => prev.filter((m) => m.id !== data.userId));
    };

    // conversation-updated: dùng cho thay đổi role
    const handleConvUpdated = (data: any) => {
      if (data.conversationId !== conversationId) return;
      if (data.event === "role-change") {
        // reload lại info để cập nhật quyền admin/member
        fetchInfoRef.current();
      }
    };

    socket.on("user-presence", handlePresence);
    socket.on("members-added", handleMembersAdded);
    socket.on("member-removed", handleMemberRemoved);
    socket.on("member-left", handleMemberRemoved);
    socket.on("conversation-updated", handleConvUpdated);

    return () => {
      socket.off("user-presence", handlePresence);
      socket.off("members-added", handleMembersAdded);
      socket.off("member-removed", handleMemberRemoved);
      socket.off("member-left", handleMemberRemoved);
      socket.off("conversation-updated", handleConvUpdated);
    };
  }, [currentUserId, conversationId]);

  // =========================
  // ADD MEMBER
  // =========================
  const handleOpenAddMember = () => {
    setTimeout(async () => {
      setOpenAdd(true);
      setSelectedFriendIds([]);
      setIsLoadingFriends(true);

      try {
        const res: GetFriendSuggestionsResult = await getFriendSuggestions();
        const allFriends = res.mutualFriends || [];

        const currentMemberIds = members.map((m) => m.id);
        const available = allFriends.filter(
          (f) => !currentMemberIds.includes(f.user_id)
        );
        setFriends(available);
      } catch (error) {
        console.error(error);
        toast.error("Lỗi tải danh sách bạn bè");
        setFriends([]);
      } finally {
        setIsLoadingFriends(false);
      }
    }, 0);
  };

  const submitAddMember = async () => {
    if (selectedFriendIds.length === 0 || !conversationId) return;

    const addedFriends: UserBasic[] = friends
      .filter((f) => selectedFriendIds.includes(f.user_id))
      .map((f) => ({
        id: f.user_id,
        username: f.username,
        fullname: `${f.lastName ?? ""} ${f.firstName ?? ""}`.trim(),
        avatarUrl: f.avatar_url,
        is_online: false,
        last_seen: new Date(),
        role: "member",
      }));

    // Optimistic update
    setMembers((prev) => [...prev, ...addedFriends]);
    setOpenAdd(false);
    setIsAddingMembers(true);

    try {
      await axios.post(`${CLIENT_CONFIG.API.CHAT_URL}/group/add`, {
        conversationId,
        memberIds: selectedFriendIds,
      });
      toast.success("Đã thêm thành viên");
    } catch (error) {
      console.error(error);
      toast.error("Thêm thất bại");
      // rollback
      setMembers((prev) =>
        prev.filter((m) => !selectedFriendIds.includes(m.id))
      );
    } finally {
      setIsAddingMembers(false);
    }
  };

  // =========================
  // CONFIRM ACTION DIALOG
  // =========================
  const openConfirmDialog = (
    type: ConfirmActionState["type"],
    targetId?: string,
    targetName?: string
  ) => {
    // dùng setTimeout để tránh xung đột sự kiện với DropdownMenu
    setTimeout(() => {
      if (type === "kick" || type === "transfer") {
        if (!targetId) return;
        setConfirmAction({ type, targetId, targetName });
      } else {
        setConfirmAction({ type });
      }
    }, 0);
  };

  const executeAction = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!confirmAction.type || !conversationId) return;

    const { type, targetId, targetName } = confirmAction;
    const targetCid = conversationId;
    setConfirmAction({ type: null });
    setIsExecuting(true);

    try {
      if (type === "leave") {
        await axios.post(
          `${CLIENT_CONFIG.API.CHAT_URL}/group/leave`,
          { conversationId: targetCid },
          { headers: { "x-user-id": currentUserId } }
        );
        toast.success("Đã rời nhóm");
        router.push(pathname);
      } else if (type === "disband") {
        await axios.post(
          `${CLIENT_CONFIG.API.CHAT_URL}/group/disband`,
          { conversationId: targetCid },
          { headers: { "x-user-id": currentUserId } }
        );
        toast.success("Đã giải tán nhóm");
        router.push(pathname);
      } else if (type === "kick" && targetId) {
        // optimistic remove
        setMembers((prev) => prev.filter((m) => m.id !== targetId));
        await axios.post(`${CLIENT_CONFIG.API.CHAT_URL}/group/remove`, {
          conversationId: targetCid,
          userId: targetId,
        });
        toast.success(`Đã mời ${targetName ?? "thành viên"} ra khỏi nhóm`);
      } else if (type === "transfer" && targetId) {
        await axios.post(
          `${CLIENT_CONFIG.API.CHAT_URL}/group/transfer`,
          { conversationId: targetCid, newOwnerId: targetId },
          { headers: { "x-user-id": currentUserId } }
        );
        toast.success(`Đã chuyển quyền trưởng nhóm`);
        // reload info để cập nhật role
        fetchInfoRef.current();
      }
    } catch (error) {
      console.error(error);
      toast.error("Hành động thất bại.");
      if (type === "kick") {
        // rollback list
        fetchInfoRef.current();
      }
    } finally {
      setIsExecuting(false);
    }
  };

  // =========================
  // RENDER
  // =========================

  if (!conversationId) {
    return (
      <div className="hidden xl:flex w-80 border-l border-slate-800 bg-linear-to-b from-slate-950 to-slate-900 items-center justify-center text-slate-500 text-sm">
        Chọn một đoạn chat để xem chi tiết
      </div>
    );
  }

  if (!isGroup) return null;

  return (
    <>
      <aside className="hidden xl:flex w-80 flex-col border-l border-slate-800 bg-linear-to-b from-slate-950 to-slate-900 text-slate-100 h-full shadow-xl">
        {/* Header */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between bg-linear-to-r from-blue-600/20 via-slate-900 to-slate-900 backdrop-blur-sm">
          <h3 className="text-xs font-semibold tracking-wide text-slate-300 uppercase">
            💬 Thông tin hội thoại
          </h3>
          {isGroup && (
            <Badge
              variant="outline"
              className="border-blue-600/50 text-blue-300 bg-blue-600/10"
            >
              {members.length} thành viên
            </Badge>
          )}
        </div>

        {/* Members List */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <SkeletonMembersPanel />
          ) : (
            <>
              {isGroup && (
                <Button
                  variant="outline"
                  className="w-full mb-4 border-dashed border-slate-700 hover:bg-slate-800 hover:text-blue-400 transition-all rounded-lg bg-transparent"
                  onClick={handleOpenAddMember}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Thêm thành viên
                </Button>
              )}

              <div className="space-y-1">
                <h4 className="text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-wider">
                  Danh sách thành viên
                </h4>

                {members.map((m) => (
                  <div
                    key={m.id}
                    className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/60 transition-all duration-150"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative">
                        <Avatar className="w-8 h-8 shadow-sm">
                          <AvatarImage src={m.avatarUrl || undefined} />
                          <AvatarFallback className="bg-blue-600 text-white text-xs">
                            {m.fullname?.[0] ?? m.username?.[0] ?? "U"}
                          </AvatarFallback>
                        </Avatar>

                        {m.is_online && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-md" />
                        )}
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium truncate max-w-[100px] text-slate-100">
                            {m.fullname || m.username || "Thành viên"}
                          </span>

                          {m.role === "admin" && (
                            <Shield
                              className="w-3.5 h-3.5 text-amber-400 shrink-0"
                              fill="currentColor"
                            />
                          )}
                        </div>

                        <span className="text-[10px] text-slate-500">
                          {m.is_online
                            ? "🟢 Online"
                            : `🔘 ${formatLastSeen(m.last_seen ?? null)}`}
                        </span>
                      </div>
                    </div>

                    {isGroup && m.id !== currentUserId && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-slate-700"
                          >
                            <MoreVertical className="w-4 h-4 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          className="w-48 bg-slate-900 border-slate-800 text-slate-200 shadow-xl"
                        >
                          <DropdownMenuLabel className="text-slate-400">
                            Tùy chọn
                          </DropdownMenuLabel>

                          <DropdownMenuItem className="text-slate-300 focus:bg-slate-800">
                            Xem trang cá nhân
                          </DropdownMenuItem>

                          {amIAdmin && (
                            <>
                              <DropdownMenuSeparator className="bg-slate-800" />

                              <DropdownMenuItem
                                className="text-amber-500 focus:text-amber-400 focus:bg-slate-800 cursor-pointer"
                                onClick={() =>
                                  openConfirmDialog(
                                    "transfer",
                                    m.id,
                                    m.fullname || m.username
                                  )
                                }
                              >
                                <UserCog className="w-4 h-4 mr-2" />
                                Chuyển quyền Admin
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="text-red-500 focus:text-red-400 focus:bg-slate-800 cursor-pointer"
                                onClick={() =>
                                  openConfirmDialog(
                                    "kick",
                                    m.id,
                                    m.fullname || m.username
                                  )
                                }
                              >
                                <UserMinus className="w-4 h-4 mr-2" />
                                Mời ra khỏi nhóm
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 backdrop-blur-sm">
          {isGroup &&
            (amIAdmin ? (
              <Button
                variant="destructive"
                className="w-full text-white hover:bg-red-900/20 rounded-lg border"
                onClick={() => openConfirmDialog("disband")}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Giải tán nhóm
              </Button>
            ) : (
              <Button
                variant="destructive"
                className="w-full text-white hover:bg-red-900/20 rounded-lg border"
                onClick={() => openConfirmDialog("leave")}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Rời nhóm
              </Button>
            ))}
        </div>
      </aside>

      {/* ADD MEMBER DIALOG */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-slate-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-slate-50">Thêm thành viên</DialogTitle>
            <DialogDescription className="text-slate-400 text-sm">
              Chọn bạn bè để thêm vào nhóm.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {isLoadingFriends ? (
              <div className="flex justify-center py-8">
                <PulseLoading size="md" text="Đang tải bạn bè..." />
              </div>
            ) : friends.length === 0 ? (
              <div className="text-center text-slate-500 py-8">
                Không tìm thấy bạn bè nào chưa vào nhóm.
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                {friends.map((f) => (
                  <div
                    key={f.user_id}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedFriendIds((prev) =>
                        prev.includes(f.user_id)
                          ? prev.filter((id) => id !== f.user_id)
                          : [...prev, f.user_id]
                      );
                    }}
                  >
                    <Checkbox
                      checked={selectedFriendIds.includes(f.user_id)}
                      className="border-slate-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded"
                    />

                    <Avatar className="w-8 h-8">
                      <AvatarImage src={f.avatar_url || undefined} />
                      <AvatarFallback className="bg-blue-600 text-white text-xs">
                        {f.username?.[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-200">
                        {f.username}
                      </div>
                      <div className="text-xs text-slate-500">
                        {`${f.lastName ?? ""} ${f.firstName ?? ""}`.trim()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setOpenAdd(false)}
              className="text-slate-400 hover:bg-slate-800 rounded-lg"
            >
              Hủy
            </Button>

            <Button
              onClick={submitAddMember}
              disabled={selectedFriendIds.length === 0 || isAddingMembers}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg"
            >
              {isAddingMembers ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang thêm...
                </>
              ) : (
                <>
                  Thêm{" "}
                  {selectedFriendIds.length > 0 &&
                    `(${selectedFriendIds.length})`}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CONFIRM DIALOG */}
      <AlertDialog
        open={!!confirmAction.type}
        onOpenChange={(open) => !open && setConfirmAction({ type: null })}
      >
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-100 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-50">
              Xác nhận hành động
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              {confirmAction.type === "leave" &&
                "Bạn có chắc chắn muốn rời khỏi cuộc trò chuyện này?"}
              {confirmAction.type === "disband" &&
                "Hành động này sẽ xóa vĩnh viễn nhóm và toàn bộ tin nhắn. Không thể hoàn tác."}
              {confirmAction.type === "kick" &&
                `Bạn có chắc chắn muốn mời "${confirmAction.targetName}" ra khỏi nhóm?`}
              {confirmAction.type === "transfer" &&
                `Bạn có chắc chắn muốn chuyển quyền trưởng nhóm cho "${confirmAction.targetName}"?`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 rounded-lg">
              Hủy
            </AlertDialogCancel>

            <AlertDialogAction
              className={cn(
                "rounded-lg transition-all",
                confirmAction.type === "transfer"
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              )}
              onClick={executeAction}
              disabled={isExecuting}
            >
              {isExecuting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : confirmAction.type === "transfer" ? (
                "Chuyển quyền"
              ) : (
                "Xác nhận"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
