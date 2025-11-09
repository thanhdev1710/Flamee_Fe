import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkSession } from "@/actions/auth.action";

export function useSessionCheck(intervalInMinutes: number = 15) {
  const router = useRouter();

  useEffect(() => {
    // Gọi lần đầu
    checkSession();

    // Thiết lập kiểm tra định kỳ
    const intervalMs = intervalInMinutes * 60 * 1000;
    const intervalId = setInterval(checkSession, intervalMs);

    return () => clearInterval(intervalId);
  }, [router, intervalInMinutes]);
}
