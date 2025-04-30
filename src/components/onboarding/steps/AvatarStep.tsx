"use client";

import { useOnboardingStore } from "@/store/onboardingStore";
import { useState } from "react";

export default function AvatarStep() {
  const { setAvatar, nextStep, prevStep } = useOnboardingStore();
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      setAvatar(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    nextStep();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Ảnh đại diện</h1>
      {preview && (
        <img src={preview} className="w-32 h-32 rounded-full object-cover" />
      )}
      <input type="file" accept="image/*" onChange={handleFile} />
      <div className="flex gap-4">
        <button onClick={prevStep} className="p-2 rounded border w-full">
          Quay lại
        </button>
        <button
          onClick={handleNext}
          className="bg-pink-500 text-white p-2 rounded w-full"
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
}
