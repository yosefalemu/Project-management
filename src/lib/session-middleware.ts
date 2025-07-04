import "server-only";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { verifyToken } from "@/lib/verify-token";
import { AUTH_COOKIE } from "@/features/auth/constants/constant";

import type { Env } from "hono";

// Extend the Env type to include userId in the context
interface CustomEnv extends Env {
  Variables: {
    userId?: string;
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
      console.log("Validating token:", token);
      // Validate the token and extract the userId
      const userId = await verifyToken(token, process.env.JWT_SECRET!);

      // Attach the userId to the context
      c.set("userId", userId);

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
