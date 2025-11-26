"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import {
  Menu,
  Home,
  Users,
  Calendar,
  BookOpen,
  MessageCircle,
  Search,
  Bell,
  LogIn,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import useSWR from "swr";
import { getMyProfiles } from "@/services/user.service";

function MenuBar() {
  const {
    data: profile,
    isLoading,
    error,
  } = useSWR("my-profile", getMyProfiles);

  const isLoggedIn = profile && !error;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow">
            <Image
              width={100}
              height={100}
              src="/assets/images/logo.svg"
              alt="HUIT Social"
              className="h-5 w-5"
            />
          </div>
          <span className="text-xl font-bold text-primary">HUIT Social</span>
        </Link>

        {/* DESKTOP MENU */}
        <NavigationMenu className="hidden md:flex ml-10">
          <NavigationMenuList className="flex gap-6">
            {["Home", "About", "Events", "Contact"].map((item) => (
              <NavigationMenuItem key={item}>
                <NavigationMenuLink asChild>
                  <Link
                    href={`/${
                      item.toLowerCase() === "home" ? "" : item.toLowerCase()
                    }`}
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    {item}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* RIGHT SECTION (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Loading */}
          {isLoading && (
            <div className="text-sm text-muted-foreground animate-pulse">
              Loading...
            </div>
          )}

          {/* Logged in */}
          {isLoggedIn && (
            <Link
              href="/app/users"
              className="flex items-center gap-3 px-3 py-2 rounded-lg border hover:bg-muted transition"
            >
              <Image
                src={profile.avatar_url}
                alt="avatar"
                width={32}
                height={32}
                className="rounded-full h-8 w-8 object-cover"
              />
              <span className="font-medium">{profile.username}</span>
            </Link>
          )}

          {/* Not logged in */}
          {!isLoggedIn && !isLoading && (
            <>
              <Button variant="outline" asChild>
                <Link href="/auth/signin">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          {/* MOBILE SLIDE MENU */}
          <SheetContent side="right" className="w-[300px] p-0">
            {/* Header */}
            <div className="p-6 border-b flex items-center gap-3 bg-primary/5">
              <div className="rounded-xl bg-primary h-10 w-10 flex items-center justify-center shadow">
                <Image
                  src="/assets/images/logo.svg"
                  alt="HUIT logo"
                  width={100}
                  height={100}
                  className="h-6 w-6"
                />
              </div>
              <div>
                <p className="text-lg font-bold text-primary">HUIT Social</p>
                <p className="text-xs text-muted-foreground">
                  Student Community
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="p-6 flex-1">
              <nav className="space-y-2">
                {[
                  { icon: Home, label: "Home", href: "/" },
                  { icon: Users, label: "About", href: "/about" },
                  { icon: Calendar, label: "Events", href: "/events" },
                  { icon: BookOpen, label: "Blog", href: "/blog" },
                  { icon: MessageCircle, label: "Contact", href: "/contact" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary group"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted group-hover:bg-primary/20">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Quick actions */}
              <div className="mt-6 space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase">
                  Quick Actions
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-12 flex flex-col gap-1"
                  >
                    <Search className="h-4 w-4" />
                    <span className="text-xs">Search</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 flex flex-col gap-1"
                  >
                    <Bell className="h-4 w-4" />
                    <span className="text-xs">Notify</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="p-6 border-t">
              {!isLoggedIn ? (
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/auth/signin">
                      <LogIn className="mr-2 h-4 w-4" /> Sign in
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" asChild>
                    <Link href="/auth/signup">
                      <UserPlus className="mr-2 h-4 w-4" /> Sign up
                    </Link>
                  </Button>
                </div>
              ) : (
                <Button asChild className="w-full">
                  <Link href="/app/users">Go to Dashboard</Link>
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default MenuBar;
