import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { deleteCookie } from "hono/cookie";
import bcrypt from "bcrypt";

import { db } from "@/db";
import { sessionMiddleware } from "@/lib/session-middleware";
import { insertUserSchema, selectUserSchema } from "@/zod-schemas/users";
import { users } from "@/db/schema/user";

const app = new Hono()
  .get("/current", sessionMiddleware, async (c) => {
    return c.json({ data: "Current user" });
  })
  .post("/login", zValidator("json", selectUserSchema), async (c) => {
    const { email, password } = c.req.valid("json");
    return c.json({ email, password });
  })
  .post("/register", zValidator("json", insertUserSchema), async (c) => {
    const { name, email, password } = c.req.valid("json");
    const hashedPassword = await bcrypt.hash(password, 10);
    const [createdUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning();
    return c.json({ data: createdUser });
  })
  .post("/logout", sessionMiddleware, async (c) => {
    deleteCookie(c, "AUTH_COOKIE");
    return c.json({ message: "Logged out successfully" });
  });
export default app;
