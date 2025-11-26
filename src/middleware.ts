// middleware.ts
import { NextRequest } from "next/server";
import authMiddleware from "./middlewares/authMiddleware";
import { i18nMiddleware } from "./middlewares/i18nMiddleware";
import { routing } from "./i18n/routing";

const AUTH_PATHS = ["/app", "/onboarding", "/auth", "/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const i18nResponse = i18nMiddleware(request);

  const locale =
    i18nResponse.headers.get("x-middleware-request-x-next-intl-locale") ||
    routing.defaultLocale;

  const cleanPath = pathname.replace(new RegExp(`^/${locale}`), "") || "/";

  const needAuth = AUTH_PATHS.some(
    (p) => cleanPath === p || cleanPath.startsWith(`${p}/`)
  );

  if (needAuth) {
    return await authMiddleware(request, locale, i18nResponse);
  }

  return i18nResponse;
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
