import { CONFIG } from "@/global/config";
import { jwtVerify } from "jose";

// Hàm kiểm tra tính hợp lệ của token
export const verifyToken = async (jwt: string) => {
  const secret = new TextEncoder().encode(CONFIG.AUTH.JWT_SECRET);
  const nowInSec = Math.floor(Date.now() / 1000);
  try {
    const { payload } = await jwtVerify(jwt, secret, {
      algorithms: ["HS512"],
    });
    // Nếu token hết hạn thì trả về không hợp lệ
    if (payload.exp && nowInSec > payload.exp)
      return { status: false, payload };
    return { status: true, payload };
  } catch {
    // Nếu lỗi verify thì coi như token không hợp lệ
    return { status: false, payload: null };
  }
};

export const refreshAccessToken = async () => {
  const res = await fetch(
    `${CONFIG.API.BASE_URL}${CONFIG.API.VERSION}/auth/refresh-token`,
    {
      method: "POST",
      headers: {
        "X-API-KEY": CONFIG.API.X_API_KEY,
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Refresh token failed");
  }

  const data = await res.json();
  return data.token;
};
