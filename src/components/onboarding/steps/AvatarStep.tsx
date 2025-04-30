"use client";

import { useState, useRef } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function AvatarUploader() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const { url } = await res.json();
      setAvatarUrl(url);
    } catch {
      toast.error("Tải ảnh thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-flamee-primary">
        Chọn ảnh đại diện
      </h2>

      <button
        onClick={handleSelectFile}
        className="size-[260px] cursor-pointer rounded-full overflow-hidden border-4 border-dashed hover:border-flamee-primary transition ring-1 ring-gray-200 shadow-lg"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
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
