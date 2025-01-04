import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { deleteCookie } from "hono/cookie";

import { loginSchema, signupSchema } from "@/validators/auth";
import { sessionMiddleware } from "@/lib/session-middleware";

const app = new Hono()
  .get("/current", sessionMiddleware, async (c) => {
    return c.json({ data: "Current user" });
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");
    return c.json({ email, password });
  })
  .post("/register", zValidator("json", signupSchema), async (c) => {
    const { name, email, confirm_password, password } = c.req.valid("json");
    return c.json({ name, email, confirm_password, password });
  })
  .post("/logout", sessionMiddleware, async (c) => {
    deleteCookie(c, "AUTH_COOKIE");
    return c.json({ message: "Logged out successfully" });
  });
export default app;
