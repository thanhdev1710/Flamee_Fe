"use client";

import { Check, X, Info } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"; // Import từ Shadcn (không dùng radix thô)
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { checkPasswordStrength } from "@/types/formAuth.type";

export const PasswordTooltip = ({ password }: { password: string }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { role } = checkPasswordStrength(password);

  const checklist = [
    { label: "Tối thiểu 13 ký tự", key: "length" },
    { label: "Ít nhất 1 chữ thường (a-z)", key: "lowercase" },
    { label: "Ít nhất 1 chữ hoa (A-Z)", key: "uppercase" },
    { label: "Ít nhất 1 số (0-9)", key: "number" },
    { label: "Ít nhất 1 ký tự đặc biệt (!@#$...)", key: "special" },
  ];

  const Content = () => (
    <div className="bg-white text-sm text-gray-800 p-4 rounded-xl shadow-xl border w-[260px] z-10">
      <p className="font-semibold mb-3 text-gray-900">Yêu cầu mật khẩu:</p>
      <div className="space-y-2">
        {checklist.map(({ label, key }) => {
          const passed = role.includes(key);
          return (
            <div key={key} className="flex items-center gap-2">
              <span className={passed ? "text-green-500" : "text-red-500"}>
                {passed ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
              </span>
              <span>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return isMobile ? (
    <Popover>
      <PopoverTrigger>
        <Info className="text-gray-400 size-6 cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent side="top" align="start">
        <Content />
      </PopoverContent>
    </Popover>
  ) : (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger onClick={(e) => e.preventDefault()}>
          <Info className="text-gray-400 size-6 cursor-help" />
        </TooltipTrigger>
        <TooltipContent side="top" align="start">
          <Content />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
