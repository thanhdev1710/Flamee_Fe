"use client";

import { useState, useRef, useCallback } from "react";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useOnboardingStore } from "@/store/onboardingStore";

export default function AvatarUploader() {
  const { avatar, setAvatar, lastName, firstName } = useOnboardingStore();
  const [isUploading, setIsUploading] = useState(false); // Trạng thái upload
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
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-flamee-primary">
        Chọn ảnh đại diện
      </h2>

      <button
        onClick={handleSelectFile}
        className="size-[260px] cursor-pointer rounded-full overflow-hidden border-4 border-dashed hover:border-flamee-primary transition ring-1 ring-gray-200 shadow-lg"
      >
        {avatar ? (
          <Image
            width={300}
            height={300}
            src={avatar}
            alt="Ảnh đại diện"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Plus size={40} />
            <span className="text-sm mt-1">Thêm ảnh</span>
          </div>
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
