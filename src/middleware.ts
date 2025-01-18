import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { JWT_SECRET } from "./config";

const publicRoutes = [
  "/sign-in",
  "/sign-up",
  "/blogs",
  "/terms",
  "/privacy-policy",
];

const isProtectedRoute = (pathname: string) =>
  !publicRoutes.includes(pathname) &&
  !pathname.startsWith("/api/") &&
  !pathname.includes("/_next/") &&
  !pathname.includes("/favicon.ico");

const redirectTo = (url: string, req: NextRequest) =>
  NextResponse.redirect(new URL(url, req.url));

const verifyToken = async (token: string | undefined) => {
  if (!token) throw new Error("No token provided");
  const secret = new TextEncoder().encode(JWT_SECRET);
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
    try {
      const token = req.cookies.get("JIRA_CLONE_AUTH_COOKIE")?.value;
      await verifyToken(token);
    } catch {
      return redirectTo("/sign-in", req);
    }
  }

  return NextResponse.next();
}
