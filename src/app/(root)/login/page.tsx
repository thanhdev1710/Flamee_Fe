import FormLogin from "@/components/shared/FormLogin";
import { Logo } from "@/components/shared/Logo";
import React from "react";

export default function page() {
  return (
    <main className=" h-svh">
      <div className="w-full h-full mx-auto flex justify-center">
        <div className="max-md:hidden w-full h-full flex items-center justify-center bg-black">
          a
        </div>
        <div className="max-w-[400px] w-full shrink-0 h-full p-10">
          <Logo size={30} />
          <p className="font-semibold mb-6 mt-12 text-2xl">
            Rất vui được gặp lại bạn
          </p>

          <FormLogin />
        </div>
      </div>
    </main>
  );
}
