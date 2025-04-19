import { COOKIE } from "@/global/cookie";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE.access_token);
  const { pathname } = request.nextUrl;

  // Tránh vòng lặp redirect
  const isAuthPage = pathname.startsWith("/auth");

  if (isAuthPage && token) {
    // Nếu đã đăng nhập thì không được vào /auth/*
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isAuthPage && !token) {
    // Nếu chưa đăng nhập thì không được vào các trang khác
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/:path*"],
};
