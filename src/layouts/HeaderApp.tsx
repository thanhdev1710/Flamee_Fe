"use client";
import { Logo } from "@/components/shared/Logo";
import { SearchCommand } from "@/components/shared/SearchCommand";
import { Button } from "@/components/ui/button";
import { useMenuStore } from "@/store/onMenuStore";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Menu, BellPlus, UserPlus, MessageCircleMore } from "lucide-react";
import Link from "next/link";

export default function HeaderApp() {
  const { setIsSidebarOpen } = useMenuStore();
  return (
    <header className="bg-background shadow-sm border-b px-3 min-[400px]:px-4 py-3 flex items-center justify-between relative">
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
        </div>
      </div>

      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="w-full">
          <SearchCommand />
        </div>
      </div>

      <div className="flex items-center gap-3">
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
        <div className="flex items-center gap-2">
          <Avatar asChild className="h-8 w-8">
            <Link href="/users">
              <AvatarImage
                className="w-full h-full object-cover rounded-full"
                src="https://placehold.co/600x400/6366f1/ffffff?text=Cover+Photo"
              />
              <AvatarFallback>CT</AvatarFallback>
            </Link>
          </Avatar>
          <div className="hidden sm:block">
            <div className="text-sm font-medium">Chi Thành</div>
            <div className="text-xs text-gray-500">Log out</div>
          </div>
        </div>
      </div>
    </header>
  );
}
