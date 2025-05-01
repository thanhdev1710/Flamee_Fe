"use client";

import { useOnboardingStore } from "@/store/onboardingStore";
import LayoutStep from "./LayoutStep";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { createUserSchema } from "@/types/user.type";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/utils";
import { getSuggestUsername } from "@/services/user.service";

export default function UsernameStep() {
  const { username, setUsername, prevStep, nextStep } = useOnboardingStore();
  const [localUsername, setLocalUsername] = useState(username); // local state to store username temporarily
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const nameDebounce = useDebounce(localUsername, 0.5);

  useEffect(() => {
    async function fetchData() {
      const userCheck = createUserSchema.pick({ username: true });
      const result = userCheck.safeParse({ username: nameDebounce });

      if (!result.success) {
        return;
      }

      const data = await getSuggestUsername(nameDebounce);

      setSuggestions(data || []);
    }
    fetchData();
  }, [nameDebounce]);

  // Hàm xử lý input: loại bỏ @ nếu người dùng nhập vào
  const handleUsernameChange = (value: string) => {
    setLocalUsername(value); // Chỉ cập nhật trạng thái local
  };

  const handleNext = () => {
    // Kiểm tra tính hợp lệ của username khi nhấn Next
    const userCheck = createUserSchema.pick({ username: true });
    const result = userCheck.safeParse({ username: localUsername });

    if (!result.success) {
      const errorMessage = result.error.errors[0].message;
      toast.error(errorMessage, {
        richColors: true,
      });
      return;
    }

    // Nếu tên hợp lệ, lưu vào store
    setUsername(localUsername);
    nextStep();
  };

  const handlePrev = () => {
    // Kiểm tra tính hợp lệ của username khi nhấn Next
    const userCheck = createUserSchema.pick({ username: true });
    const result = userCheck.safeParse({ username: localUsername });

    if (!result.success) {
      const errorMessage = result.error.errors[0].message;
      toast.error(errorMessage, {
        richColors: true,
      });
      return;
    }

    // Nếu tên hợp lệ, lưu vào store
    setUsername(localUsername);
    prevStep();
  };

  return (
    <LayoutStep onClickNext={handleNext} onClickPrev={handlePrev}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Tạo tên người dùng</h1>
        <p className="text-muted-foreground text-sm">
          Đây là cách người khác sẽ tìm thấy bạn. Bạn có thể thay đổi sau.
        </p>

        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Tên người dùng
          </label>

          <Input
            id="username"
            className="pl-7 border p-2 w-full rounded"
            placeholder="example123"
            value={localUsername}
            onChange={(e) => handleUsernameChange(e.target.value)}
          />
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-600">
              Gợi ý tên khả dụng:
            </p>
            <div className="flex gap-2 flex-wrap">
              {suggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  onClick={() => setLocalUsername(suggestion)} // Cập nhật local khi chọn gợi ý
                  className="text-sm"
                >
                  <Sparkles className="w-4 h-4 mr-1" />@{suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </LayoutStep>
  );
}
