import { NextRequest, NextResponse } from "next/server";
import { COOKIE } from "@/global/cookie";
import { verifyToken, refreshAccessToken } from "@/utils/jwt";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(COOKIE.access_token)?.value;
  const refreshToken = request.cookies.get(COOKIE.refresh_token)?.value;

  const accessCheck = accessToken
    ? await verifyToken(accessToken)
    : { status: false };

  // Nếu access token còn hợp lệ → session hợp lệ
  if (accessCheck.status) {
    return NextResponse.json({ message: "Session valid" }, { status: 200 });
  }

  // Nếu access token hết hạn nhưng refresh token còn → cấp lại access token
  const refreshCheck = refreshToken
    ? await verifyToken(refreshToken)
    : { status: false };

  if (refreshCheck.status && refreshToken) {
    try {
      const newAccessToken = await refreshAccessToken();

      const response = NextResponse.json(
        { message: "Session refreshed" },
        { status: 200 }
      );

      // Ghi đè lại cookie access token
      response.cookies.set(COOKIE.access_token, newAccessToken, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
      });

      return response;
    } catch (error) {
      console.error("Không thể refresh access token:", error);
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  }

  // Nếu cả 2 token đều không hợp lệ
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}
