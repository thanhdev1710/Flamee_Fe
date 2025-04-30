"use client";

import AvatarStep from "@/components/onboarding/steps/AvatarStep";
import BioStep from "@/components/onboarding/steps/BioStep";
import FavoriteStep from "@/components/onboarding/steps/FavoriteStep";
import { useOnboardingStore } from "@/store/onboardingStore";
import PersonalInfoStep from "@/components/onboarding/steps/PersionalInfoStep";

export default function OnboardingPage() {
  const { step } = useOnboardingStore();

  const steps = [
    <PersonalInfoStep key={0} />,
    <FavoriteStep key={1} />,
    <AvatarStep key={2} />,
    <BioStep key={3} />,
  ];

  return steps[step];
}
