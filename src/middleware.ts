import { NextRequest } from "next/server";
import authMiddleware from "./middlewares/authMiddleware";
import { i18nMiddleware } from "./middlewares/i18nMiddleware";
import { routing } from "./i18n/routing";

const AUTH_PATHS = ["/app", "/onboarding", "/auth"];

export async function middleware(request: NextRequest) {
  // i18n xử lý đầu tiên
  const i18nResponse = i18nMiddleware(request);
  if (i18nResponse) return i18nResponse;

  const pathname = request.nextUrl.pathname;

  const localePrefix = routing.locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  const cleanPathname = localePrefix
    ? pathname.replace(`/${localePrefix}`, "") || "/"
    : pathname;

  const shouldApplyAuth = AUTH_PATHS.some(
    (path) => cleanPathname === path || cleanPathname.startsWith(`${path}/`)
  );

  if (shouldApplyAuth) {
    return await authMiddleware(request);
  }

  // Không cần auth → tiếp tục
  return new Response(null, { status: 200 });
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
