"use client";

import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import "./globals.css";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center text-center p-4">
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-center">
          <Logo size={64} />
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-destructive">
          😥 Something went wrong
        </h1>

        <p className="text-muted-foreground max-w-md mx-auto">
          Don&apos;t worry! It might just be a small hiccup. You can try
          reloading the page or come back in a few minutes.
        </p>

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => location.reload()}
        >
          <RotateCcw className="w-4 h-4" />
          Retry
        </Button>

        <p className="text-xs text-muted-foreground">
          Error details: {error?.message || "Unknown error"}
        </p>
      </div>
    </div>
  );
}
