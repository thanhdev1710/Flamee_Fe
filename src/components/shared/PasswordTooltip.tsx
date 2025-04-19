import { Check, X, Info } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { checkPasswordStrength } from "@/types/formAuth.type";

export const PasswordTooltip = ({ password }: { password: string }) => {
  const { role } = checkPasswordStrength(password);

  const checklist = [
    { label: "Tối thiểu 13 ký tự", key: "length" },
    { label: "Ít nhất 1 chữ thường (a-z)", key: "lowercase" },
    { label: "Ít nhất 1 chữ hoa (A-Z)", key: "uppercase" },
    { label: "Ít nhất 1 số (0-9)", key: "number" },
    { label: "Ít nhất 1 ký tự đặc biệt (!@#$...)", key: "special" },
  ];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger onClick={(e) => e.preventDefault()}>
          <Info className="text-gray-400 size-6 cursor-help" />
        </TooltipTrigger>
        <TooltipContent className="bg-white text-sm text-gray-800 p-4 rounded-xl shadow-xl border -translate-x-10 z-10">
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
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
