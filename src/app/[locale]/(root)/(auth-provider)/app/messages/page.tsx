"use client";
import AsideDirectoryPanel from "@/layouts/AsideDirectoryPanel";
import AsideMessageApp from "@/layouts/AsideMessageApp";
import MainMessage from "@/layouts/MainMessage";
import { useState } from "react";

export default function Page() {
  const [openAside, setOpenAside] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AsideMessageApp />
      <MainMessage setOpenAside={setOpenAside} />
      <AsideDirectoryPanel openAside={openAside} setOpenAside={setOpenAside} />
    </div>
  );
}
