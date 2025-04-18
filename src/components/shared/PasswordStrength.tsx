import { checkPasswordStrength } from "@/types/formAuth.type";
import React from "react";

export default function PasswordStrength({ password }: { password: string }) {
  const colors = [
    "bg-red-400",
    "bg-red-400",
    "bg-yellow-400",
    "bg-yellow-400",
    "bg-green-400",
  ];
  return (
    <div className="flex gap-1">
      {Array.from({
        length: 5,
      }).map((_, i) => {
        const { strength } = checkPasswordStrength(password);
        const color = colors[strength - 1];
        return (
          <div
            className={`w-full h-1 rounded-full bg-gray-200 ${
              strength > i && color
            }`}
            key={i}
          ></div>
        );
      })}
    </div>
  );
}
