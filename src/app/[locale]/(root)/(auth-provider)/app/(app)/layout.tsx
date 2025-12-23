import AsideMenuApp from "@/layouts/AsideMenuApp";
import HeaderApp from "@/layouts/HeaderApp";
import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="max-h-svh h-svh overflow-hidden">
      <HeaderApp />

      <div className="flex h-full">
        <AsideMenuApp />
        <main className="w-full h-full">{children}</main>
      </div>
    </div>
  );
}
