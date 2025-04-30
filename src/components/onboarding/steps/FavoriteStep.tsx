"use client";

import { useOnboardingStore } from "@/store/onboardingStore";
import { useState } from "react";
import LayoutStep from "./LayoutStep";
import { allFavorites } from "@/global/const";

export default function FavoriteStep() {
  const { setFavorites, nextStep, prevStep, favorites } = useOnboardingStore();
  const [selected, setSelected] = useState<string[]>(favorites);

  const toggleFavorite = (label: string) => {
    setSelected((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const handleNext = () => {
    setFavorites(selected);
    nextStep();
  };

  const handlePrev = () => {
    setFavorites(selected);
    prevStep();
  };

  return (
    <LayoutStep onClickNext={handleNext} onClickPrev={handlePrev}>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold text-flamee-primary">
          Sở thích của bạn
        </h1>
        <p className="text-gray-500">Chọn những sở thích bạn yêu thích nhất.</p>

        <div className="grid lg:grid-cols-[repeat(auto-fit,minmax(160px,1fr))] grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2">
          {allFavorites.map(({ label, icon: Icon }) => {
            const isSelected = selected.includes(label);
            return (
              <button
                key={label}
                onClick={() => toggleFavorite(label)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border text-sm font-medium transition hover:shadow-md ${
                  isSelected
                    ? "bg-flamee-primary text-white border-flamee-primary"
                    : "hover:bg-flamee-primary/10"
                }`}
              >
                <Icon
                  size={18}
                  className={`${
                    isSelected ? "text-white" : "text-flamee-primary"
                  }`}
                />

                <span className="mt-1 text-xs">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </LayoutStep>
  );
}
