"use client";

import { useOnboardingStore } from "@/store/onboardingStore";
import LayoutStep from "./LayoutStep";
import { Textarea } from "@/components/ui/textarea";

export default function BioStep() {
  const { setBio, bio, prevStep, nextStep } = useOnboardingStore();

  return (
    <LayoutStep onClickNext={nextStep} onClickPrev={prevStep}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Giới thiệu bản thân</h1>
        <Textarea
          className="border p-2 w-full rounded h-28"
          placeholder="Giới thiệu bản thân bạn..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={5}
        />
      </div>
    </LayoutStep>
  );
}
