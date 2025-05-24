import { Logo } from "@/components/shared/Logo";
import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <main className="w-full">
      <div className="w-full h-full mx-auto flex justify-center">
        <div className="max-md:hidden md:w-2/5 flex items-center justify-center">
          <Logo isText={false} size={360} />
        </div>

        <div className="md:w-3/5 w-full h-full flex items-center justify-center">
          <div className="w-full h-full md:p-6 p-3">
            <Logo size={52} />
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
