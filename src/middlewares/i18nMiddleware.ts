// middleware/i18nMiddleware.ts
import createMiddleware from "next-intl/middleware";
import { routing } from "../i18n/routing";
import { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

// Bọc lại để xử lý NextRequest
export function i18nMiddleware(request: NextRequest) {
  return intlMiddleware(request);
}
