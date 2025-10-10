// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import authMiddleware from "./middlewares/authMiddleware";
import { i18nMiddleware } from "./middlewares/i18nMiddleware";
import { routing } from "./i18n/routing";

const AUTH_PATHS = ["/app", "/onboarding", "/auth"];

function parseLocale(pathname: string) {
  const locale = routing.locales.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  const hasLocale = Boolean(locale);
  const cleanPath = hasLocale
    ? pathname.replace(new RegExp(`^/${locale}`), "") || "/"
    : pathname;
  return { hasLocale, locale, cleanPath };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { hasLocale, locale, cleanPath } = parseLocale(pathname);

  if (!hasLocale) {
    // Chưa có locale → để i18n thêm prefix
    return i18nMiddleware(request);
  }

  const shouldApplyAuth = AUTH_PATHS.some(
    (p) => cleanPath === p || cleanPath.startsWith(`${p}/`)
  );

  if (shouldApplyAuth) {
    // Truyền locale cho auth
    return await authMiddleware(request, locale || "vi");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
