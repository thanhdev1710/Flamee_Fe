"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
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
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { formatLastSeen } from "@/utils/time";
import { cn } from "@/lib/utils";
import { getChatSocket } from "@/lib/chatSocket";
import {
  MoreVertical,
  Shield,
  UserPlus,
  LogOut,
  Trash2,
  UserMinus,
  UserCog,
} from "lucide-react";
import { toast } from "sonner";
import { getFriendSuggestions } from "@/services/follow.service";

type AsideDirectoryPanelProps = {
  currentUserId: string;
};

export default function AsideDirectoryPanel({
  currentUserId,
}: AsideDirectoryPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conv");

  const [members, setMembers] = useState<any[]>([]);
  const [isGroup, setIsGroup] = useState(false);
  const [amIAdmin, setAmIAdmin] = useState(false);

  const [openAdd, setOpenAdd] = useState(false);
  const [friends, setFriends] = useState<any[]>([]);
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);

  const [confirmAction, setConfirmAction] = useState<{
    type: "leave" | "disband" | "kick" | "transfer" | null;
    targetId?: string;
    targetName?: string;
  }>({ type: null });

  const apiBase =
    process.env.NEXT_PUBLIC_CHAT_API || "http://localhost:4004/api/v1/chat";
  const socketUrl =
    process.env.NEXT_PUBLIC_CHAT_SOCKET || "http://localhost:4004";

  // --- FETCH DATA ---
  const fetchInfo = useCallback(async () => {
    if (!conversationId || !currentUserId) return;
    try {
      const res = await axios.get(
        `${apiBase}/conversations?user_id=${currentUserId}`
      );
      const all = Array.isArray(res.data) ? res.data : res.data.data || [];
      const cur = all.find((c: any) => c.id === conversationId);
      if (cur) {
        setIsGroup(cur.is_group);
        if (cur.members) {
          const formattedMembers = cur.members.map((m: any) => ({
            id: m.user_id,
            username: m.user?.username,
            fullname: m.user?.fullname,
            avatarUrl: m.user?.avatarUrl,
            is_online: m.user?.is_online,
            last_seen: m.user?.last_seen,
            role: m.role || "member",
          }));
          setMembers(formattedMembers);
          const myInfo = formattedMembers.find(
            (m: any) => m.id === currentUserId
          );
          setAmIAdmin(myInfo?.role === "admin");
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [conversationId, currentUserId, apiBase]);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);
  const fetchInfoRef = useRef(fetchInfo);
  useEffect(() => {
    fetchInfoRef.current = fetchInfo;
  }, [fetchInfo]);

  // --- SOCKET ---
  useEffect(() => {
    if (!currentUserId || !conversationId) return;
    const s = getChatSocket(currentUserId, socketUrl);
    s.emit("join-room", conversationId);

    const handlePresence = (d: any) => {
      setMembers((prev) =>
        prev.map((m) =>
          String(m.id) === String(d.userId)
            ? { ...m, is_online: d.isOnline, last_seen: d.lastSeen }
            : m
        )
      );
    };
    const handleMembersAdded = (data: any) => {
      if (data.conversationId !== conversationId) return;
      const newMembers = data.members.map((u: any) => ({
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
        const unique = newMembers.filter((nm: any) => !ids.includes(nm.id));
        return [...prev, ...unique];
      });
    };
    const handleMemberRemoved = (data: any) => {
      if (data.conversationId !== conversationId) return;
      setMembers((prev) => prev.filter((m) => m.id !== data.userId));
    };
    const handleConvUpdated = (data: any) => {
      if (data.conversationId !== conversationId) return;
      if (data.event === "role-change") fetchInfoRef.current();
    };

    s.on("user-presence", handlePresence);
    s.on("members-added", handleMembersAdded);
    s.on("member-removed", handleMemberRemoved);
    s.on("member-left", handleMemberRemoved);
    s.on("conversation-updated", handleConvUpdated);

    return () => {
      s.off("user-presence", handlePresence);
      s.off("members-added", handleMembersAdded);
      s.off("member-removed", handleMemberRemoved);
      s.off("member-left", handleMemberRemoved);
      s.off("conversation-updated", handleConvUpdated);
    };
  }, [currentUserId, socketUrl, conversationId]);

  // ============================
  // [FIX ĐƠ UI 1] Dùng setTimeout cho Open Dialog Add
  // ============================
  const handleOpenAddMember = () => {
    // setTimeout(..., 0) giúp tách luồng sự kiện, tránh xung đột render
    setTimeout(async () => {
      setOpenAdd(true);
      setSelectedFriendIds([]);
      try {
        const res: any = await getFriendSuggestions();
        const allFriends = res.mutualFriends || [];
        const currentMemberIds = members.map((m) => m.id);
        const available = allFriends.filter(
          (f: any) => !currentMemberIds.includes(f.user_id)
        );
        setFriends(available);
      } catch {
        toast.error("Lỗi tải danh sách bạn bè");
      }
    }, 0);
  };

  const submitAddMember = async () => {
    if (selectedFriendIds.length === 0) return;

    // Optimistic Update
    const addedFriends = friends
      .filter((f) => selectedFriendIds.includes(f.user_id))
      .map((f) => ({
        id: f.user_id,
        username: f.username,
        fullname: f.fullname,
        avatarUrl: f.avatar_url,
        is_online: false,
        last_seen: new Date(),
        role: "member",
      }));
    setMembers((prev) => [...prev, ...addedFriends]);
    setOpenAdd(false);

    try {
      await axios.post(`${apiBase}/group/add`, {
        conversationId,
        memberIds: selectedFriendIds,
      });
      toast.success("Đã thêm thành viên");
    } catch {
      toast.error("Thêm thất bại");
      setMembers((prev) =>
        prev.filter((m) => !selectedFriendIds.includes(m.id))
      );
    }
  };

  // ============================
  // [FIX ĐƠ UI 2] Hàm mở Dialog từ Dropdown
  // ============================
  const openConfirmDialog = (
    type: "leave" | "disband" | "kick" | "transfer",
    targetId?: string,
    targetName?: string
  ) => {
    // setTimeout là CHÌA KHÓA để fix lỗi đơ khi mở từ DropdownMenu
    setTimeout(() => {
      setConfirmAction({ type, targetId, targetName });
    }, 0);
  };

  const executeAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirmAction.type) return;

    const { type, targetId, targetName } = confirmAction;
    const targetCid = conversationId;
    setConfirmAction({ type: null }); // Đóng ngay

    try {
      if (type === "leave") {
        await axios.post(
          `${apiBase}/group/leave`,
          { conversationId: targetCid },
          { headers: { "x-user-id": currentUserId } }
        );
        toast.success("Đã rời nhóm");
        router.push(pathname);
      } else if (type === "disband") {
        await axios.post(
          `${apiBase}/group/disband`,
          { conversationId: targetCid },
          { headers: { "x-user-id": currentUserId } }
        );
        toast.success("Đã giải tán nhóm");
        router.push(pathname);
      } else if (type === "kick" && targetId) {
        setMembers((prev) => prev.filter((m) => m.id !== targetId));
        await axios.post(`${apiBase}/group/remove`, {
          conversationId: targetCid,
          userId: targetId,
        });
        toast.success(`Đã mời ${targetName} ra khỏi nhóm`);
      } else if (type === "transfer" && targetId) {
        await axios.post(
          `${apiBase}/group/transfer`,
          { conversationId: targetCid, newOwnerId: targetId },
          { headers: { "x-user-id": currentUserId } }
        );
        toast.success(`Đã chuyển quyền trưởng nhóm`);
        fetchInfo();
      }
    } catch {
      toast.error("Hành động thất bại.");
      if (type === "kick") fetchInfo();
    }
  };

  if (!conversationId)
    return (
      <div className="hidden xl:flex w-80 border-l border-slate-800 bg-[#050816] items-center justify-center text-slate-500 text-sm">
        Chọn một đoạn chat để xem chi tiết
      </div>
    );

  return (
    <>
      <aside className="hidden xl:flex w-80 flex-col border-l border-slate-800 bg-[#050816] text-slate-100 h-full">
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between bg-[#050816]">
          <h3 className="text-xs font-semibold tracking-wide text-slate-300">
            THÔNG TIN HỘI THOẠI
          </h3>
          {isGroup && (
            <Badge
              variant="outline"
              className="border-slate-700 text-slate-400"
            >
              {members.length} mem
            </Badge>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {isGroup && (
            <Button
              variant="outline"
              className="w-full mb-4 border-dashed border-slate-700 hover:bg-slate-800 hover:text-blue-400"
              onClick={handleOpenAddMember}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Thêm thành viên
            </Button>
          )}
          <div className="space-y-1">
            <h4 className="text-[11px] font-bold text-slate-500 mb-2 uppercase">
              Danh sách thành viên
            </h4>
            {members.map((m: any) => (
              <div
                key={m.id}
                className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-900/60 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={m.avatarUrl} />
                      <AvatarFallback>{m.fullname?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    {m.is_online && (
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-slate-900" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium truncate max-w-[100px]">
                        {m.fullname || m.username}
                      </span>
                      {m.role === "admin" && (
                        <Shield
                          className="w-3 h-3 text-yellow-500"
                          fill="currentColor"
                        />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {m.is_online ? "Online" : formatLastSeen(m.last_seen)}
                    </span>
                  </div>
                </div>
                {isGroup && m.id !== currentUserId && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 bg-slate-900 border-slate-800 text-slate-200"
                    >
                      <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
                      <DropdownMenuItem>Xem trang cá nhân</DropdownMenuItem>
                      {amIAdmin && (
                        <>
                          <DropdownMenuSeparator className="bg-slate-800" />
                          {/* [FIX ĐƠ UI] Sử dụng openConfirmDialog bọc trong setTimeout */}
                          <DropdownMenuItem
                            className="text-yellow-500 focus:text-yellow-400 focus:bg-slate-800"
                            onClick={() =>
                              openConfirmDialog("transfer", m.id, m.fullname)
                            }
                          >
                            <UserCog className="w-4 h-4 mr-2" />
                            Chuyển quyền Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 focus:text-red-400 focus:bg-slate-800"
                            onClick={() =>
                              openConfirmDialog("kick", m.id, m.fullname)
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
        </div>
        <div className="p-4 border-t border-slate-800 bg-[#050816]">
          {isGroup &&
            (amIAdmin ? (
              // [FIX ĐƠ UI]
              <Button
                variant="destructive"
                className="w-full bg-red-900/20 hover:bg-red-900/40 text-red-500 hover:text-red-400 border border-red-900/50"
                onClick={() => openConfirmDialog("disband")}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Giải tán nhóm
              </Button>
            ) : (
              // [FIX ĐƠ UI]
              <Button
                variant="ghost"
                className="w-full text-red-400 hover:text-red-300 hover:bg-red-900/20"
                onClick={() => openConfirmDialog("leave")}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Rời nhóm
              </Button>
            ))}
        </div>
      </aside>

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle>Thêm thành viên</DialogTitle>
            <DialogDescription className="text-slate-400 text-sm">
              Chọn bạn bè để thêm vào nhóm.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {friends.length === 0 ? (
              <div className="text-center text-slate-500 py-4">
                Không tìm thấy bạn bè nào chưa vào nhóm.
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                {friends.map((f) => (
                  <div
                    key={f.user_id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-slate-800 cursor-pointer"
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
                      className="border-slate-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={f.avatar_url} />
                      <AvatarFallback>{f.username?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{f.username}</div>
                      <div className="text-xs text-slate-500">{f.fullname}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setOpenAdd(false)}
              className="text-slate-400"
            >
              Hủy
            </Button>
            <Button
              onClick={submitAddMember}
              disabled={selectedFriendIds.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Thêm{" "}
              {selectedFriendIds.length > 0 && `(${selectedFriendIds.length})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!confirmAction.type}
        onOpenChange={(open) => !open && setConfirmAction({ type: null })}
      >
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hành động</AlertDialogTitle>
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
            <AlertDialogCancel className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                confirmAction.type === "transfer"
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-red-600 hover:bg-red-700"
              )}
              onClick={(e) => executeAction(e)}
            >
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
