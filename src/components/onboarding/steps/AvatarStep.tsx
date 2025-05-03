"use client";

import { useState, useCallback } from "react";

import { useOnboardingStore } from "@/store/onboardingStore";
import LayoutStep from "./LayoutStep";
import CropImage from "@/components/shared/CropImage";

export default function AvatarUploader() {
  const { avatar, setAvatar, lastName, firstName, nextStep, prevStep } =
    useOnboardingStore();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = useCallback(
    async (file: File) => {
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

        <CropImage
          imgDefault={avatar}
          action={async (file) => {
            await handleFileChange(file);
          }}
          aspect={1}
          isCircular
        />
      </div>
    </LayoutStep>
  );
}
