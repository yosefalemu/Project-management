import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const publicRoutes = [
  "/sign-in",
  "/sign-up",
  "/blogs",
  "/terms",
  "/privacy-policy",
];

const isProtectedRoute = (pathname: string) => !publicRoutes.includes(pathname);

const redirectTo = (url: string, req: NextRequest) =>
  NextResponse.redirect(new URL(url, req.url));

const verifyToken = async (token: string | undefined) => {
  if (!token) throw new Error("No token provided");
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  await jwtVerify(token, secret);
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/") {
    try {
      const token = req.cookies.get("JIRA_CLONE_AUTH_COOKIE")?.value;
      await verifyToken(token);
    } catch {
      return redirectTo("/sign-in", req);
    }
  }

  if (isProtectedRoute(pathname)) {
    const redirectUrl = req.url.split(`${process.env.NEXT_PUBLIC_APP_URL}`)[1];
    try {
      const token = req.cookies.get("JIRA_CLONE_AUTH_COOKIE")?.value;
      await verifyToken(token);
    } catch {
      return redirectTo(`/sign-in?redirectTo=${redirectUrl}`, req);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|global.css).*)"],
};
