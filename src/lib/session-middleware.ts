import "server-only";
import { createMiddleware } from "hono/factory";

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
    } catch (error) {
      console.error("Token validation failed:", error);
      return c.json(
        { error: "Unauthorized", message: "Invalid or expired token" },
        401
      );
    }
  }
);
