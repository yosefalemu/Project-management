import { NextResponse, NextRequest } from "next/server";

const publicRoutes = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/confirm-signup/:email",
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

const isImageRequest = (pathname: string) => {
  return (
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".gif")
  );
};

const isProtectedRoute = (pathname: string) => {
  return !publicRoutes.some((route) => {
    // Handle dynamic routes with :path* (e.g., opengraph-image, twitter-image)
    if (route.includes(":path*")) {
      const regexPattern = `^/[^/]+/opengraph-image(?:-[a-z0-9]+)?\\.(?:png|jpg|jpeg|gif)(?:\\?.*)?$`;
      return pathname.match(new RegExp(regexPattern));
    }
    // Handle dynamic route /confirm-signup/:email
    if (route === "/confirm-signup/:email") {
      const regexPattern = `^/confirm-signup/[^/]+(?:\\?.*)?$`;
      return pathname.match(new RegExp(regexPattern));
    }
    // Handle static routes
    return pathname === route;
  });
};

const redirectTo = (url: string, req: NextRequest) =>
  NextResponse.redirect(new URL(url, req.url));

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isSocialMediaCrawler(req)) {
    return NextResponse.next();
  }
  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }
  if (isImageRequest(pathname)) {
    return NextResponse.next();
  }

  if (isProtectedRoute(pathname)) {
    let redirectUrl = null;
    if (pathname !== "/") {
      redirectUrl = req.url.split(`${process.env.NEXT_PUBLIC_APP_URL}`)[1];
      const sessionCookie = req.cookies.get("better-auth.session_token")?.value;
      if (!sessionCookie) {
        if (redirectUrl) {
          return redirectTo(`/sign-in?redirects=${redirectUrl}`, req);
        } else {
          return redirectTo("/sign-in", req);
        }
      }
    } else if (pathname === "/") {
      const notRememberMe = req.cookies.get("better-auth.dont_remember")?.value;
      console.log("Not Remember Me:", notRememberMe);
      const sessionCookie = req.cookies.get("better-auth.session_token")?.value;
      console.log("Session Cookie:", sessionCookie);
      if (!sessionCookie) {
        return redirectTo("/sign-in", req);
      } else if (sessionCookie && !notRememberMe) {
        return redirectTo("/dashboard", req);
      } else if (sessionCookie && notRememberMe) {
        return redirectTo("/sign-in", req);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|global.css).*)"],
};
