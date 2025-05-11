"use client";

import AvatarStep from "@/components/onboarding/steps/AvatarStep";
import BioStep from "@/components/onboarding/steps/BioStep";
import FavoriteStep from "@/components/onboarding/steps/FavoriteStep";
import PersonalInfoStep from "@/components/onboarding/steps/PersionalInfoStep";
import { useOnboardingStore } from "@/store/onboardingStore";
import UsernameStep from "@/components/onboarding/steps/UsernameStep";
// import StudentCardStep from "@/components/onboarding/steps/StudentCardStep";

export default function OnboardingPage() {
  const { step } = useOnboardingStore();

  const steps = [
    // <StudentCardStep key={0} />,
    <PersonalInfoStep key={1} />,
    <FavoriteStep key={2} />,
    <AvatarStep key={3} />,
    <BioStep key={4} />,
    <UsernameStep key={5} />,
  ];

  return steps[step];
}
