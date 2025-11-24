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
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
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

export default function HeaderApp() {
  const router = useRouter();
  const { setIsSidebarOpen } = useMenuStore();
  const { data: profile, isLoading } = useProfile();

  const avatarSrc =
    profile?.avatar_url ||
    "https://placehold.co/600x400/6366f1/ffffff?text=Avatar";
  const fullName = profile
    ? `${profile.lastName || ""} ${profile.firstName || ""}`.trim()
    : "Đang tải...";

  return (
    <header className="sticky top-0 z-50 shadow-lg border-b">
      <div className="px-3 min-[400px]:px-4 py-4 flex items-center justify-between">
        {/* ===== LEFT SECTION ===== */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-slate-200 hover:bg-slate-700"
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
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden md:flex text-slate-300 hover:text-blue-400 hover:bg-slate-700"
          >
            <Link href="/app/friends">
              <UserPlus className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden md:flex text-slate-300 hover:text-blue-400 hover:bg-slate-700"
          >
            <Link href="/app/messages">
              <MessageCircleMore className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden md:flex text-slate-300 hover:text-blue-400 hover:bg-slate-700"
          >
            <Link href="/app/notifications">
              <BellPlus className="h-5 w-5" />
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 sm:gap-3 hover:bg-slate-700 transition-colors"
              >
                <Avatar className="h-9 w-9 border-2 border-blue-400 cursor-pointer">
                  <AvatarImage
                    src={avatarSrc || "/placeholder.svg"}
                    alt={profile?.username || "user avatar"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold">
                    {profile?.username?.charAt(0)?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-semibold text-slate-100 truncate max-w-[120px]">
                    {isLoading ? "..." : fullName || "Người dùng"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {profile?.username || "user"}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 bg-slate-800 border-slate-700 text-slate-100"
            >
              {/* Profile Section */}
              <DropdownMenuItem asChild className="hover:bg-slate-700">
                <Link href="/app/users" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Trang cá nhân</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="hover:bg-slate-700">
                <Link
                  href="/app/users/edit"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Chỉnh sửa thông tin</span>
                </Link>
              </DropdownMenuItem>
              {/* 
              <DropdownMenuSeparator className="bg-slate-700" />

              <DropdownMenuItem asChild className="hover:bg-slate-700">
                <Link href="/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-slate-400" />
                  <span>Cài đặt tài khoản</span>
                </Link>
              </DropdownMenuItem> 
              */}

              <DropdownMenuSeparator className="bg-slate-700" />

              {/* Logout */}
              <DropdownMenuItem
                onClick={async () => {
                  await Logout();
                  router.push("/auth/signin");
                }}
                className="hover:bg-red-900/20 text-red-400 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
