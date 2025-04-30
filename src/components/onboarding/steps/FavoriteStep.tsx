"use client";

import { useOnboardingStore } from "@/store/onboardingStore";
import { useState } from "react";

const allFavorites = [
  "Đọc sách",
  "Du lịch",
  "Chơi game",
  "Thể thao",
  "Xem phim",
  "Nấu ăn",
];

export default function FavoriteStep() {
  const { setFavorites, nextStep, prevStep } = useOnboardingStore();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleFavorite = (hobby: string) => {
    setSelected((prev) =>
      prev.includes(hobby) ? prev.filter((h) => h !== hobby) : [...prev, hobby]
    );
  };

  const handleNext = () => {
    setFavorites(selected);
    nextStep();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Sở thích</h1>
      <div className="grid grid-cols-2 gap-4">
        {allFavorites.map((hobby) => (
          <button
            key={hobby}
            onClick={() => toggleFavorite(hobby)}
            className={`p-2 rounded border ${
              selected.includes(hobby) ? "bg-pink-500 text-white" : ""
            }`}
          >
            {hobby}
          </button>
        ))}
      </div>
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
