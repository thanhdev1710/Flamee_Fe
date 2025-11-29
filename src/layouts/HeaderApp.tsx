"use client";

import { Logout } from "@/actions/auth.action";
import { Logo } from "@/components/shared/Logo";
import { SearchCommand } from "@/components/shared/SearchCommand";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfile } from "@/services/user.hook";
import { useMenuStore } from "@/store/onMenuStore";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Menu,
  BellPlus,
  UserPlus,
  MessageCircleMore,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { disconnectSocket } from "@/lib/chatSocket";

export default function HeaderApp() {
  const router = useRouter();

  const { setIsSidebarOpen } = useMenuStore();
  const { data: profile, isLoading } = useProfile();

  const avatarSrc = profile?.avatar_url || "";
  const fullName = profile
    ? `${profile.lastName || ""} ${profile.firstName || ""}`.trim()
    : "Đang tải...";

  return (
    <header className="sticky top-0 z-50 shadow border-b">
      <div className="px-3 min-[400px]:px-4 py-4 flex items-center justify-between">
        {/* ===== LEFT SECTION ===== */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden hover:bg-slate-700"
            onClick={() => setIsSidebarOpen()}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <Logo size={28} />
          </div>
        </div>

        {/* ===== SEARCH SECTION ===== */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <SearchCommand />
        </div>

        {/* ===== RIGHT SECTION ===== */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button asChild variant="ghost" size="sm" className="hidden md:flex">
            <Link href="/app/friends">
              <UserPlus className="h-5 w-5" />
            </Link>
          </Button>

          <Button asChild variant="ghost" size="sm" className="hidden md:flex">
            <Link href="/app/messages">
              <MessageCircleMore className="h-5 w-5" />
            </Link>
          </Button>

          <Button asChild variant="ghost" size="sm" className="hidden md:flex">
            <Link href="/app/notifications">
              <BellPlus className="h-5 w-5" />
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 sm:gap-3 cursor-pointer"
              >
                <Avatar className="size-8 border-2 border-blue-400 flex items-center justify-center rounded-full overflow-hidden">
                  <AvatarImage
                    src={avatarSrc}
                    alt={profile?.username || "user avatar"}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {profile?.lastName?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-semibold truncate max-w-[120px]">
                    {isLoading ? "..." : fullName || "Người dùng"}
                  </span>
                  <span className="text-xs">{profile?.username || "user"}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              {/* Profile Section */}
              <DropdownMenuItem asChild>
                <Link href="/app/users" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Trang cá nhân</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/app/users/edit"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Chỉnh sửa thông tin</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Logout */}
              <DropdownMenuItem
                onClick={async () => {
                  await Logout();
                  disconnectSocket(); // chủ động hủy socket khi logout
                  router.push("/auth/signin");
                }}
                className="group hover:bg-red-900! cursor-pointer"
              >
                <LogOut className="h-4 w-4 text-red-400 group-hover:text-white" />
                <span className="text-red-400 group-hover:text-white">
                  Đăng xuất
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
