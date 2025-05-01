"use client";

// import AvatarStep from "@/components/onboarding/steps/AvatarStep";
// import BioStep from "@/components/onboarding/steps/BioStep";
// import FavoriteStep from "@/components/onboarding/steps/FavoriteStep";
// import PersonalInfoStep from "@/components/onboarding/steps/PersionalInfoStep";
import { useOnboardingStore } from "@/store/onboardingStore";
import UsernameStep from "@/components/onboarding/steps/UsernameStep";

export default function OnboardingPage() {
  const { step } = useOnboardingStore();

  const steps = [
    // <PersonalInfoStep key={0} />,
    // <FavoriteStep key={1} />,
    // <AvatarStep key={2} />,
    // <BioStep key={3} />,
    <UsernameStep key={0} />,
  ];

  return steps[step];
}
