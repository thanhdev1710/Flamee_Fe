import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import {
  Home,
  Users,
  Calendar,
  BookOpen,
  MessageCircle,
  Search,
  Bell,
  LogIn,
  UserPlus,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import Image from "next/image";

function MenuBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Image
              width={100}
              height={100}
              src="/assets/images/logo.svg"
              alt="Flamee logo"
              className="h-5 w-5"
            />
          </div>
          <span className="text-xl font-bold text-primary">Flamee</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="space-x-6">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/about"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  About
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/events"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Events
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/blog"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Blog
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/contact"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Contact
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Button variant="outline" asChild>
            <Link href="/auth/signin">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signup">Sign up</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[320px] p-0">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
                <Link href="/" className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg">
                    <Image
                      width={100}
                      height={100}
                      src="/assets/images/logo.svg"
                      alt="Flamee logo"
                      className="h-6 w-6"
                    />
                  </div>
                  <div>
                    <span className="text-xl font-bold text-primary">
                      Flamee
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Social Platform
                    </p>
                  </div>
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 p-6">
                <nav className="space-y-2">
                  <Link
                    href="/"
                    className="flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted group-hover:bg-primary/20 transition-colors">
                      <Home className="h-4 w-4" />
                    </div>
                    <span>Home</span>
                  </Link>

                  <Link
                    href="/about"
                    className="flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted group-hover:bg-primary/20 transition-colors">
                      <Users className="h-4 w-4" />
                    </div>
                    <span>About</span>
                  </Link>

                  <Link
                    href="/events"
                    className="flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted group-hover:bg-primary/20 transition-colors">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <span>Events</span>
                  </Link>

                  <Link
                    href="/blog"
                    className="flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted group-hover:bg-primary/20 transition-colors">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <span>Blog</span>
                  </Link>

                  <Link
                    href="/contact"
                    className="flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted group-hover:bg-primary/20 transition-colors">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                    <span>Contact</span>
                  </Link>
                </nav>

                {/* Divider */}
                <div className="my-6 border-t"></div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Quick Actions
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-12 flex-col space-y-1"
                    >
                      <Search className="h-4 w-4" />
                      <span className="text-xs">Search</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-12 flex-col space-y-1"
                    >
                      <Bell className="h-4 w-4" />
                      <span className="text-xs">Notifications</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Footer with Auth Buttons */}
              <div className="p-6 border-t bg-muted/30">
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/auth/signin">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign in
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" asChild>
                    <Link href="/auth/signup">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign up
                    </Link>
                  </Button>
                </div>

                {/* Social Links */}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-3">
                    Follow us
                  </p>
                  <div className="flex space-x-3">
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Instagram className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default MenuBar;
