"use client";
import { useOnboardingStore } from "@/store/onboardingStore";
import { User, Heart, Camera, Edit, Check, IdCard } from "lucide-react";

export default function AsideOnboarding() {
  const { step } = useOnboardingStore();
  const steps = [
    { title: "Ảnh thẻ sinh viên", icon: <IdCard /> },
    { title: "Thông tin cá nhân", icon: <User /> },
    { title: "Sở thích", icon: <Heart /> },
    { title: "Ảnh đại diện", icon: <Camera /> },
    { title: "Giới thiệu bản thân", icon: <Edit /> },
    { title: "Tên người dùng", icon: <User /> },
  ];
  return (
    <aside className="hidden md:block w-md p-8">
      <h2 className="text-2xl font-bold mb-8">Thiết lập tài khoản</h2>
      <ol>
        {steps.map((label, index) => (
          <li key={index}>
            {index !== 0 && (
              <div className="bg-gray-200 h-12 w-0.5 ml-4 my-2"></div>
            )}
            <div
              className={`flex items-center ${
                index < step
                  ? "text-green-500"
                  : index === step
                  ? "font-bold text-flamee-primary"
                  : "text-gray-600"
              }`}
            >
              <div
                className={`w-8 h-8 mr-3 rounded-full flex items-center justify-center text-sm ${
                  index < step
                    ? "bg-green-500 text-white"
                    : index === step
                    ? "bg-flamee-primary text-white"
                    : ""
                }`}
              >
                {index < step ? (
                  <Check />
                ) : index === step ? (
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                ) : (
                  label.icon
                )}
              </div>
              <span className="ml-2">{label.title}</span>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
