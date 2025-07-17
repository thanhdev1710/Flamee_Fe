"use client";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMenuStore } from "@/store/onMenuStore";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  Menu,
  Search,
  BellPlus,
  UserPlus,
  MessageCircleMore,
} from "lucide-react";
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
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search" className="pl-10 border-none" />
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
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>CT</AvatarFallback>
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
