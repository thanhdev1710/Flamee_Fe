"use client";

import AvatarStep from "@/components/onboarding/steps/AvatarStep";
// import BioStep from "@/components/onboarding/steps/BioStep";
// import FavoriteStep from "@/components/onboarding/steps/FavoriteStep";
// import PersonalInfoStep from "@/components/onboarding/steps/PersionalInfoStep";
import { getOnboardingData, useOnboardingStore } from "@/store/onboardingStore";

export default function OnboardingPage() {
  const { step } = useOnboardingStore();
  console.log(getOnboardingData());

  const steps = [
    // <PersonalInfoStep key={0} />,
    // <FavoriteStep key={1} />,
    <AvatarStep key={0} />,
    // <BioStep key={3} />,
  ];

  return steps[step];
}
