import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { ModeToggle } from "@/components/shared/ModeToggle";

export const metadata = {
  title: "404 - Trang không tồn tại | Flamee",
  description:
    "Trang bạn tìm kiếm không tồn tại. Quay về trang chủ và thử lại.",
  robots: "noindex, nofollow",
  openGraph: {
    title: "404 - Trang không tồn tại | Flamee",
    description:
      "Trang bạn tìm kiếm không tồn tại. Quay về trang chủ và thử lại.",
    type: "website",
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center text-center p-4">
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-center">
          <Logo size={64} />
        </div>

        <h1 className="text-4xl font-bold tracking-tight">
          😵‍💫 Ủa? Flamee không biết trang này luôn á!
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          🕳️ Bạn vừa mở cánh cửa vào hư vô... <br /> 🏡 Nhưng đừng lo! Flamee sẽ
          giúp bạn quay về nhà ngay
        </p>

        <Link href="/">
          <Button className="gap-2 cursor-pointer">
            🚀 Quay về nhà liền thui!
          </Button>
        </Link>
      </div>
      <div className="fixed bottom-3 right-3">
        <ModeToggle />
      </div>
    </div>
  );
}
