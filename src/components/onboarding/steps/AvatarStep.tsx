"use client";

import { useState, useRef, useCallback } from "react";
import { Plus, Loader2 } from "lucide-react";
import Image from "next/image";
import { useOnboardingStore } from "@/store/onboardingStore";
import LayoutStep from "./LayoutStep";

export default function AvatarUploader() {
  const { avatar, setAvatar, lastName, firstName, nextStep, prevStep } =
    useOnboardingStore();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || isUploading) return;

      setIsUploading(true);

      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("lastName", lastName);
      formData.append("firstName", firstName);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const { url } = await res.json();
        setAvatar(url);
      } catch (error) {
        console.error("Upload failed", error);
      } finally {
        setIsUploading(false);
      }
    },
    [isUploading, setAvatar, firstName, lastName]
  );

  return (
    <LayoutStep onClickNext={nextStep} onClickPrev={prevStep}>
      <div className="max-w-md mx-auto text-center space-y-6 p-6">
        <h2 className="text-2xl font-bold text-flamee-primary">
          Ảnh đại diện của bạn
        </h2>

        <div
          className="relative mx-auto w-40 h-40 rounded-full border-4 border-dashed hover:border-flamee-primary transition duration-300 ease-in-out ring-2 ring-gray-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer overflow-hidden group"
          onClick={handleSelectFile}
        >
          {avatar && !isUploading && (
            <Image
              src={avatar}
              alt="Avatar"
              fill
              className="object-cover rounded-full transition duration-300"
            />
          )}

          {!avatar && !isUploading && (
            <div className="flex flex-col items-center justify-center w-full h-full text-gray-400 group-hover:text-flamee-primary transition">
              <Plus size={36} />
              <span className="text-sm mt-1">Tải ảnh</span>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 text-flamee-primary">
              <Loader2 className="animate-spin" size={32} />
              <span className="text-sm mt-1">Đang tải...</span>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </LayoutStep>
  );
}
