"use client";

import { getOnboardingData, useOnboardingStore } from "@/store/onboardingStore";
import LayoutStep from "./LayoutStep";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { createUserSchema } from "@/types/user.type";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/utils";
import { getSuggestUsername } from "@/services/user.service";
import { createProfile } from "@/actions/user.action";
import { useRouter } from "next/navigation";
import { refreshAccessToken } from "@/utils/jwt";

export default function UsernameStep() {
  const router = useRouter();
  const username = useOnboardingStore((state) => state.username);
  const setUsername = useOnboardingStore((state) => state.setUsername);
  const prevStep = useOnboardingStore((state) => state.prevStep);
  const [localUsername, setLocalUsername] = useState(username);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [usernameStatus, setUsernameStatus] = useState<
    "available" | "taken" | "invalid" | "checking" | null
  >(null);
  const nameDebounce = useDebounce(localUsername, 0.5);

  useEffect(() => {
    async function fetchData() {
      const userCheck = createUserSchema.pick({ username: true });
      const result = userCheck.safeParse({ username: nameDebounce });

      if (!nameDebounce) {
        setUsernameStatus(null);
        return;
      }

      if (!result.success) {
        setUsernameStatus("invalid");
        return;
      }

      setUsernameStatus("checking");

      try {
        const data = await getSuggestUsername(nameDebounce);

        if (data.length > 0) {
          setSuggestions(data);
          setUsernameStatus("taken");
        } else {
          setSuggestions([]);
          setUsernameStatus("available");
        }
      } catch {
        setUsernameStatus("available");
      }
    }

    fetchData();
  }, [nameDebounce]);

  // Hàm xử lý input: loại bỏ @ nếu người dùng nhập vào
  const handleUsernameChange = (value: string) => {
    setLocalUsername(value); // Chỉ cập nhật trạng thái local
  };

  const handleNext = async () => {
    // 1) Validate
    const userCheck = createUserSchema.pick({ username: true });
    const result = userCheck.safeParse({ username: localUsername });

    if (!result.success) {
      toast.error(result.error.errors[0].message, { richColors: true });
      return;
    }

    setUsername(localUsername);

    // 2) Promise wrapper — chạy 1 lần duy nhất
    const promise = (async () => {
      const err = await createProfile(getOnboardingData());
      if (err) throw new Error(err);
      return true;
    })();

    // 3) Toast lắng nghe promise, KHÔNG chạy thêm lần nào
    toast.promise(promise, {
      loading: "Đang tạo hồ sơ...",
      success: "Tạo hồ sơ thành công!",
      error: (err) => err.message || "Tạo hồ sơ thất bại",
    });

    // 4) Chờ promise ĐÃ TẠO (không chạy lại promise)
    try {
      await promise;
      await refreshAccessToken();
      router.push("/app/feeds");
    } catch {
      // toast đã show error rồi
    }
  };

  const handlePrev = () => {
    setUsername(localUsername);
    prevStep();
  };

  return (
    <LayoutStep isFinish onClickNext={handleNext} onClickPrev={handlePrev}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Tạo tên người dùng</h1>
        <p className="text-muted-foreground text-sm">
          Đây là cách người khác sẽ tìm thấy bạn. Bạn có thể thay đổi sau.
        </p>

        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Tên người dùng
          </label>

          <div className="relative">
            <Input
              id="username"
              className={`!pl-8 border p-2 w-full rounded focus:outline-none ${
                usernameStatus === "invalid"
                  ? "border-red-500"
                  : usernameStatus === "available"
                  ? "border-green-500"
                  : usernameStatus === "taken"
                  ? "border-red-500"
                  : ""
              }`}
              placeholder="example123"
              value={localUsername}
              onChange={(e) => handleUsernameChange(e.target.value)}
            />
            <span className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400">
              @
            </span>
          </div>
          {/* Thông báo trạng thái */}
          {usernameStatus === "available" && (
            <p className="text-sm text-green-600">✅ Tên này có thể sử dụng</p>
          )}
          {usernameStatus === "taken" && (
            <p className="text-sm text-red-600">❌ Tên này đã được sử dụng</p>
          )}
          {usernameStatus === "invalid" && (
            <p className="text-sm text-red-600">⚠️ Tên không hợp lệ</p>
          )}
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
