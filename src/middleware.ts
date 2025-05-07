import { COOKIE } from "@/global/cookie";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken, refreshAccessToken } from "./utils/jwt";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Lấy access token và refresh token từ cookie
  const token = request.cookies.get(COOKIE.access_token)?.value;
  const refreshToken = request.cookies.get(COOKIE.refresh_token)?.value;

  // Xác định xem request hiện tại có phải là auth page không
  const isAuthPage =
    pathname.startsWith("/auth") && pathname !== "/auth/verify-email";
  const isVerifyEmailPage = pathname === "/auth/verify-email";

  // Kiểm tra access token và refresh token
  const accessTokenValid = token
    ? await verifyToken(token)
    : { status: false, payload: null };
  const refreshTokenValid = refreshToken
    ? await verifyToken(refreshToken)
    : { status: false, payload: null };

  // Kiểm tra người dùng đã xác thực email hay chưa
  const isVerified =
    accessTokenValid.payload?.is_verified ||
    refreshTokenValid.payload?.is_verified;

  // ❌ Bỏ qua middleware nếu là route xác thực email qua token: /auth/verify-email/[token]
  if (!isVerified) {
    if (
      pathname.startsWith("/auth/verify-email/") &&
      pathname !== "/auth/verify-email"
    ) {
      return NextResponse.next();
    }
  }

  // Trường hợp người dùng đang truy cập vào các trang /auth/* (ngoại trừ /verify-email)
  if (isAuthPage) {
    // Nếu đã đăng nhập thì redirect về trang chủ
    if (accessTokenValid.status) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Nếu chưa đăng nhập thì cho phép vào trang /auth/*
    return NextResponse.next();
  }

  // Trường hợp người dùng truy cập trang xác thực email
  if (isVerifyEmailPage) {
    // Nếu đã xác thực email rồi thì redirect về trang chủ
    if (isVerified) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (
      pathname.startsWith("/auth/verify-email/") &&
      pathname !== "/auth/verify-email"
    ) {
      return NextResponse.next();
    }

    // Nếu chưa đăng nhập thì redirect về trang đăng nhập
    if (!accessTokenValid.status && !refreshTokenValid.status) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    // Nếu có token hợp lệ và chưa xác thực → cho phép truy cập verify-email
    return NextResponse.next();
  }

  // Trường hợp truy cập các route khác (ví dụ "/")
  if (!accessTokenValid.status) {
    // Nếu không có refresh token hợp lệ thì redirect về trang đăng nhập
    if (!refreshTokenValid.status) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    // Nếu refresh token hợp lệ, gọi API refresh token để lấy access token mới
    try {
      const newAccessToken = await refreshAccessToken();

      // Sau khi có access token mới, tạo lại cookie và tiếp tục request
      const response = NextResponse.next();
      response.cookies.set(COOKIE.access_token, newAccessToken, {
        httpOnly: true,
        path: "/",
      });
      return response;
    } catch (error) {
      console.error("Refresh token failed", error);
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  // Nếu người dùng chưa xác thực email → redirect về verify-email
  if (!isVerified) {
    return NextResponse.redirect(new URL("/auth/verify-email", request.url));
  }

  // Kiểm tra nếu người dùng đã vào trang onboarding rồi (tránh vòng lặp)
  const isOnboardingPage = pathname === "/onboarding";

  // Kiểm tra trạng thái profile
  const isProfile = accessTokenValid.payload?.is_profile;

  // Tránh vòng lặp: Nếu đã vào trang onboarding rồi, không cần redirect nữa
  if (!isProfile && !isOnboardingPage) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  if (isProfile && isOnboardingPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Nếu tất cả đều hợp lệ → cho phép truy cập
  return NextResponse.next();
}

// Áp dụng middleware cho các route cần kiểm soát
export const config = {
  matcher: ["/", "/onboarding", "/auth/:path*"],
};
