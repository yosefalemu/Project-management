// middleware.ts
import { NextResponse } from "next/server";

export async function middleware(request: Request) {
  const url = request.url;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-url", url);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/join/:path*",
    "/protected/:path*",
    "/((?!api|_next|favicon.ico|global.css).*)",
  ],
};
