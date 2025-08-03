import { NextResponse } from "next/server";

export async function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|global.css).*)"],
};
