"use client";

import { useOnboardingStore } from "@/store/onboardingStore";

export default function BioStep() {
  const { setBio, bio, prevStep } = useOnboardingStore();

  const handleDone = () => {
    // TODO: Submit hoặc chuyển về trang chính
    alert("Đã hoàn tất onboarding!");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Giới thiệu bản thân</h1>
      <textarea
        className="border p-2 w-full rounded"
        placeholder="Giới thiệu bản thân bạn..."
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        rows={5}
      />
      <div className="flex gap-4">
        <button onClick={prevStep} className="p-2 rounded border w-full">
          Quay lại
        </button>
        <button
          onClick={handleDone}
          className="bg-pink-500 text-white p-2 rounded w-full"
        >
          Hoàn tất
        </button>
      </div>
    </div>
  );
}
