import { ModeToggle } from "@/components/shared/ModeToggle";
import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh h-full container mx-auto flex items-center justify-center">
      {children}
      <div className="fixed bottom-3 right-3">
        <ModeToggle />
      </div>
    </div>
  );
}
