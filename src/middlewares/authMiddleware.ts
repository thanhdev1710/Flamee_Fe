// middlewares/authMiddleware.ts
import { COOKIE } from "@/global/cookie";
import { verifyToken, refreshAccessToken } from "@/utils/jwt";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "../i18n/routing";

export default async function authMiddleware(
  request: NextRequest,
  locale: string,
  i18nResponse: NextResponse<unknown>
) {
  const { pathname } = request.nextUrl;

  // --- bóc prefix locale để so khớp chuẩn ---
  const matched = routing.locales.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  const cleanPath = matched
    ? pathname.replace(new RegExp(`^/${matched}`), "") || "/"
    : pathname;

  // helper: tạo URL có prefix locale
  const withLocale = (p: string) => {
    const path = p.startsWith("/") ? p : `/${p}`;
    return path.startsWith(`/${locale}/`) || path === `/${locale}`
      ? path
      : `/${locale}${path}`;
  };

  // helper: tránh tự-redirect (đang ở đúng URL rồi thì next)
  const redirectIfChanged = (destPath: string) => {
    const dest = new URL(withLocale(destPath), request.url);
    if (dest.pathname === pathname) return i18nResponse;

    const res = NextResponse.redirect(dest);

    // GIỮ LẠI TẤT CẢ HEADER CỦA i18nMiddleware
    for (const [key, value] of i18nResponse.headers) {
      res.headers.set(key, value);
    }

    return res;
  };

  // Lấy token
  const token = request.cookies.get(COOKIE.access_token)?.value;
  const refreshToken = request.cookies.get(COOKIE.refresh_token)?.value;

  const accessTokenValid = token
    ? await verifyToken(token)
    : { status: false, payload: null };
  const refreshTokenValid = refreshToken
    ? await verifyToken(refreshToken)
    : { status: false, payload: null };

  const isVerified =
    accessTokenValid.payload?.is_verified ||
    refreshTokenValid.payload?.is_verified;

  // --- xác định các nhóm route trên cleanPath (đÃ bỏ locale) ---
  const isAuthPage =
    cleanPath.startsWith("/auth") && cleanPath !== "/auth/verify-email";
  const isVerifyEmailPage = cleanPath === "/auth/verify-email";
  const isVerifyEmailTokenRoute =
    cleanPath.startsWith("/auth/verify-email/") &&
    cleanPath !== "/auth/verify-email";

  // Bỏ qua verify-email bằng token
  if (!isVerified && isVerifyEmailTokenRoute) {
    return i18nResponse;
  }

  // Nhóm /auth/*
  if (isAuthPage) {
    if (accessTokenValid.status) {
      // đã đăng nhập → về /app/feeds (theo locale)
      return redirectIfChanged("/app/feeds");
    }
    return i18nResponse; // chưa đăng nhập → vào trang auth bình thường
  }

  // Trang /auth/verify-email
  if (isVerifyEmailPage) {
    if (isVerified) {
      return redirectIfChanged("/app/feeds");
    }
    if (!accessTokenValid.status && !refreshTokenValid.status) {
      return redirectIfChanged("/auth/signin");
    }
    return i18nResponse;
  }

  // Các route khác (ví dụ /app/feeds)
  if (!accessTokenValid.status) {
    if (!refreshTokenValid.status) {
      return redirectIfChanged("/auth/signin");
    }
    try {
      const newAccessToken = await refreshAccessToken();
      const res = i18nResponse;
      res.cookies.set(COOKIE.access_token, newAccessToken, {
        httpOnly: true,
        path: "/",
      });
      return res;
    } catch (e) {
      console.error("Refresh token failed", e);
      return redirectIfChanged("/auth/signin");
    }
  }

  if (!isVerified) {
    return redirectIfChanged("/auth/verify-email");
  }

  const isOnboardingPage = cleanPath === "/onboarding";
  const isProfile = accessTokenValid.payload?.is_profile;

  if (!isProfile && !isOnboardingPage) {
    return redirectIfChanged("/onboarding");
  }

  if (isProfile && isOnboardingPage) {
    return redirectIfChanged("/app/feeds");
  }

  return i18nResponse;
}
