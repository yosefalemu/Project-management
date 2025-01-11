import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// List of routes to protect
const publisRoutes = [
  "/",
  "/sign-in",
  "/sign-up",
  "/blogs",
  "/terms",
  "/privacy-policy",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }
  if (pathname.includes("/_next/") || pathname.includes("/favicon.ico")) {
    return NextResponse.next();
  }
  const isRoutePublic = publisRoutes.includes(pathname);
  console.log("PATH NAME", pathname);
  // Check if the route is protected
  if (!isRoutePublic) {
    const token = req.cookies.get("JIRA_CLONE_AUTH_COOKIE")?.value;

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    try {
      // Verify JWT
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
    } catch (err) {
      console.error("Invalid token", err);
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  return NextResponse.next();
}
