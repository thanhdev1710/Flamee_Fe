"use client";

import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { ThemeProvider } from "next-themes";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`antialiased relative`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center text-center p-4">
            <div className="animate-fade-in space-y-6">
              <div className="flex justify-center">
                <Logo size={64} />
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-destructive">
                😥 Có lỗi gì đó đã xảy ra
              </h1>

              <p className="text-muted-foreground max-w-md mx-auto">
                Đừng lo! Có thể chỉ là một sự cố nhỏ. Bạn có thể thử tải lại
                trang hoặc quay lại sau vài phút.
              </p>

              <Button
                variant="outline"
                className="gap-2"
                onClick={() => location.reload()}
              >
                <RotateCcw className="w-4 h-4" />
                Thử lại
              </Button>

              <p className="text-xs text-muted-foreground">
                Chi tiết lỗi: {error?.message || "Không rõ"}
              </p>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
