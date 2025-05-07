import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useSessionCheck(intervalInMinutes: number = 15) {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include",
        });

        const msg = await res.json();

        console.log(msg.message);

        if (res.status === 401) {
          router.push("/auth/signin");
        }
      } catch (err) {
        console.error("Lỗi khi kiểm tra session", err);
        router.push("/auth/signin");
      }
    };

    // Gọi lần đầu
    checkSession();

    // Thiết lập kiểm tra định kỳ
    const intervalMs = intervalInMinutes * 60 * 1000;
    const intervalId = setInterval(checkSession, intervalMs);

    return () => clearInterval(intervalId);
  }, [router, intervalInMinutes]);
}
