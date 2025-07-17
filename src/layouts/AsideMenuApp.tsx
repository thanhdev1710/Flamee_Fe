"use client";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { navigationItems } from "@/global/const";
import Link from "next/link";
import { useMenuStore } from "@/store/onMenuStore";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AsideMenuApp() {
  const pathname = usePathname();
  const { isSidebarOpen, setIsSidebarOpen } = useMenuStore();
  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen()}
        />
      )}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-background shadow-lg transform transition-transform duration-300 ease-in-out
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          lg:shadow-none lg:border-r
        `}
      >
        <div className="p-4 lg:hidden flex justify-between items-center border-b">
          <div className="flex items-center gap-2">
            <Logo size={24} />
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen()}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {navigationItems.map((item, index) => (
            <Button
              key={index}
              variant={pathname.includes(item.href) ? "default" : "ghost"}
              className={`w-full justify-start gap-3 ${
                pathname.includes(item.href)
                  ? "hover:bg-flamee-primary bg-flamee-primary text-white"
                  : ""
              }`}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </aside>
    </>
  );
}
