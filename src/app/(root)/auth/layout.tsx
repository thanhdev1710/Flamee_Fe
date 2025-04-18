import { Logo } from "@/components/shared/Logo";
import Image from "next/image";
import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <main className=" h-svh">
      <div className="w-full h-full mx-auto flex justify-center ">
        <div className="max-md:hidden w-full h-full flex items-center justify-center relative">
          <Image
            alt="Ảnh chính trang đăng nhập"
            src="/assets/images/bg-login.avif"
            priority
            fill
            className="w-full h-full object-cover -scale-x-100"
            sizes="66vw"
          />
        </div>
        <div className="max-w-[400px] w-full shrink-0 h-full p-10">
          <Logo size={30} />

          {children}
        </div>
      </div>
    </main>
  );
}
