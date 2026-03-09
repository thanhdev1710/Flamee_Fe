import Footer from "@/components/landing-page/Footer";
import MenuBar from "@/components/landing-page/MenuBar";
import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <main>
      <MenuBar />
      {children}
      <Footer />
    </main>
  );
}
