import { NextResponse, NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const publicRoutes = [
  "/sign-in",
  "/sign-up",
  "/blogs",
  "/terms",
  "/privacy-policy",
  "/:path*/opengraph-image",
  "/:path*/twitter-image",
];

const isSocialMediaCrawler = (req: NextRequest) => {
  const userAgent = req.headers.get("user-agent") || "";
  return /facebookexternalhit|Twitterbot|LinkedInBot|Slackbot|WhatsApp|Pinterest/.test(
    userAgent
  );
};

const isProtectedRoute = (pathname: string) => {
  const isProtected = !publicRoutes.some((route) => {
    if (route.includes(":path*")) {
      const regexPattern = `^/[^/]+/opengraph-image(?:-[a-z0-9]+)?\\.(?:png|jpg|jpeg|gif)(?:\\?.*)?$`;
      const matches = pathname.match(new RegExp(regexPattern));
      return matches;
    }
    return pathname === route;
  });
  return isProtected;
};

const redirectTo = (url: string, req: NextRequest) =>
  NextResponse.redirect(new URL(url, req.url));

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isSocialMediaCrawler(req)) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    try {
      const sessionCookie = getSessionCookie(req);
      if (!sessionCookie) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
    } catch {
      return redirectTo("/sign-in", req);
    }
  }

  if (isProtectedRoute(pathname)) {
    const redirectUrl = req.url.split(`${process.env.NEXT_PUBLIC_APP_URL}`)[1];
    try {
      getSessionCookie(req);
    } catch {
      return redirectTo(`/sign-in?redirectTo=${redirectUrl}`, req);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|global.css).*)"],
};
