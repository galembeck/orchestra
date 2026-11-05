import { AUTH_COOKIE_PREFIX } from "@orchestra/shared/constants/auth";
import {
  SIGN_IN_LINK,
  SIGN_UP_LINK,
} from "@orchestra/shared/constants/navigation";
import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

const GUEST_ONLY_PATHS = new Set<string>([
  SIGN_IN_LINK.href,
  SIGN_UP_LINK.href,
]);

const splitLocale = (pathname: string) => {
  for (const locale of routing.locales) {
    const prefix = `/${locale}`;

    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return { locale, path: pathname.slice(prefix.length) || "/" };
    }
  }

  return { locale: routing.defaultLocale, path: pathname };
};

export default function proxy(request: NextRequest) {
  const { locale, path } = splitLocale(request.nextUrl.pathname);
  const isSignedIn =
    getSessionCookie(request, { cookiePrefix: AUTH_COOKIE_PREFIX }) !== null;

  if (isSignedIn && GUEST_ONLY_PATHS.has(path)) {
    return NextResponse.redirect(
      new URL(getPathname({ href: "/", locale }), request.url)
    );
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
