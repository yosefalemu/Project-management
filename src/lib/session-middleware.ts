import "server-only";

import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { AUTH_COOKIE } from "@/features/auth/constants/constant";

export const sessionMiddleware = createMiddleware(async (c, next) => {
  const session = getCookie(c, AUTH_COOKIE);
  if (!session) {
    return c.json({ error: "Unauthorizes" }, 401);
  }
  await next();
});
