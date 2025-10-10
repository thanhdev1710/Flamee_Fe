import { COOKIE } from "@/global/cookie";
import { cookies } from "next/headers";

export async function GET() {
  // Lấy cookie từ request
  const cookie = await cookies();
  const accessToken = cookie.get(COOKIE.access_token);
  const refreshToken = cookie.get(COOKIE.refresh_token);

  // Trả về token nếu có
  return new Response(
    JSON.stringify({
      accessToken: accessToken?.value || null,
      refreshToken: refreshToken?.value || null,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
