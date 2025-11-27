"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

import { useOnboardingStore } from "@/store/onboardingStore";
import LayoutStep from "./LayoutStep";
import CropImage from "@/components/shared/CropImage";

export default function AvatarUploader() {
  const avatarUrl = useOnboardingStore((state) => state.avatar_url);
  const setAvatarUrl = useOnboardingStore((state) => state.setAvatarUrl);
  const nextStep = useOnboardingStore((state) => state.nextStep);
  const prevStep = useOnboardingStore((state) => state.prevStep);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = useCallback(
    async (file: File) => {
      if (!file || isUploading) return;

      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload-local", {
          method: "POST",
          body: formData,
        });

        const { url } = await res.json();
        setAvatarUrl(url);
        toast.success("Ảnh đã được cập nhật!");
      } catch {
        toast.error("Tải ảnh lên thất bại. Vui lòng thử lại.", {
          richColors: true,
        });
      } finally {
        setIsUploading(false);
      }
    },
    [isUploading, setAvatarUrl]
  );

  const handleNext = () => {
    if (!avatarUrl) {
      toast.error("Vui lòng chọn trước khi tiếp tục.", {
        richColors: true,
      });
      return;
    }
    nextStep();
  };

  return (
    <LayoutStep onClickNext={handleNext} onClickPrev={prevStep}>
      <div className="max-w-md mx-auto text-center space-y-6 p-6">
        <h2 className="text-3xl font-bold text-flamee-primary">
          Chọn ảnh đại diện
        </h2>
        <p className="text-gray-600">
          Hãy chọn ảnh rõ mặt để mọi người nhận ra bạn dễ hơn!
        </p>

        <CropImage
          imgDefault={avatarUrl}
          action={async (file) => {
            await handleFileChange(file);
          }}
          aspect={1}
          isCircular
        />

        {avatarUrl && (
          <p className="text-green-600 font-medium">
            ✅ Ảnh đã được lưu! Bạn có thể tiếp tục.
          </p>
        )}
      </div>
    </LayoutStep>
  );
}
