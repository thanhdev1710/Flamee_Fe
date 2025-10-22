"use client";

import { Logout } from "@/actions/auth.action";
import { Logo } from "@/components/shared/Logo";
import { SearchCommand } from "@/components/shared/SearchCommand";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/services/user.hook";
import { useMenuStore } from "@/store/onMenuStore";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Menu, BellPlus, UserPlus, MessageCircleMore } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HeaderApp() {
  const router = useRouter();
  const { setIsSidebarOpen } = useMenuStore();
  const { data: profile, isLoading } = useProfile();
  console.log(profile);

  // ✅ Tạo biến avatar + fullname fallback
  const avatarSrc =
    profile?.avatar_url ||
    "https://placehold.co/600x400/6366f1/ffffff?text=Avatar";
  const fullName = profile
    ? `${profile.lastName || ""} ${profile.firstName || ""}`.trim()
    : "Đang tải...";

  return (
    <header className="bg-background shadow-sm border-b px-3 min-[400px]:px-4 py-3 flex items-center justify-between relative">
      {/* ===== LEFT SECTION ===== */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={() => setIsSidebarOpen()}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <Logo size={24} />
          <span className="hidden sm:block font-semibold text-lg">Flamee</span>
        </div>
      </div>

      {/* ===== SEARCH SECTION ===== */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <SearchCommand />
      </div>

      {/* ===== RIGHT SECTION ===== */}
      <div className="flex items-center gap-3">
        {/* Nút điều hướng */}
        <Button asChild variant="ghost" size="sm" className="hidden md:flex">
          <Link href="/friends">
            <UserPlus className="h-5 w-5" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="hidden md:flex">
          <Link href="/messages">
            <MessageCircleMore className="h-5 w-5" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="hidden md:flex">
          <Link href="/notifications">
            <BellPlus className="h-5 w-5" />
          </Link>
        </Button>

        {/* Avatar & User Info */}
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border">
            <AvatarImage
              src={avatarSrc}
              alt={profile?.username || "user avatar"}
              className="object-cover"
            />
            <AvatarFallback>
              {profile?.username?.charAt(0)?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-medium truncate max-w-[140px]">
              {isLoading ? "Đang tải..." : fullName || "Người dùng"}
            </span>
            <Button
              onClick={async () => {
                await Logout();
                router.push("/auth/signin");
              }}
              variant="link"
              className="text-xs text-gray-500 p-0 h-auto cursor-pointer"
            >
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
