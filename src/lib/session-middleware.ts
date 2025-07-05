import "server-only";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { AUTH_COOKIE } from "@/features/auth/constants/constant";

import type { Env } from "hono";
import { auth } from "./auth";

// Extend the Env type to include userId in the context
interface CustomEnv extends Env {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}

export const sessionMiddleware = createMiddleware<CustomEnv>(
  async (c, next) => {
    const token = getCookie(c, AUTH_COOKIE);
    console.log("Token from cookie:", token);
    if (!token) {
      return c.json(
        { error: "Unauthorized", message: "No token provided" },
        401
      );
    }

    try {
      const session = await auth.api.getSession({ headers: c.req.raw.headers });
      if (!session) {
        c.set("user", null);
        c.set("session", null);
        return next();
      }

      // Attach the userId to the context
      c.set("user", session.user);
      c.set("session", session.session);
      return next();

      // Proceed to the next middleware or handler
      await next();
    } catch (error) {
      console.error("Token validation failed:", error);
      return c.json(
        { error: "Unauthorized", message: "Invalid or expired token" },
        401
      );
    }
  }
);
