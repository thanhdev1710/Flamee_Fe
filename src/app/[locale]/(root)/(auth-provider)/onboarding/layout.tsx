import AsideOnboarding from "@/components/onboarding/Aside";
import { ModeToggle } from "@/components/shared/ModeToggle";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh h-full container mx-auto flex items-center justify-center">
      <div className="flex justify-between w-full">
        <AsideOnboarding />
        <main className="w-full p-8">{children}</main>
      </div>
      <div className="fixed bottom-3 right-3">
        <ModeToggle />
      </div>
    </div>
  );
}
