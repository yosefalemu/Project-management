import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { deleteCookie, setCookie } from "hono/cookie";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NeonDbError } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { sessionMiddleware } from "@/lib/session-middleware";
import { users } from "@/db/schema/user";
import { AUTH_COOKIE } from "../constants/constant";
import { insertUserSchema, selectUserSchema } from "@/zod-schemas/users-schema";

const app = new Hono()
  .get("/current", sessionMiddleware, async (c) => {
    const userId = c.get("userId") as string;
    const user = await db.select().from(users).where(eq(users.id, userId));
    if (user.length === 0) {
      return c.json({ data: [] });
    }
    return c.json({ data: user });
  })
  .post("/login", zValidator("json", selectUserSchema), async (c) => {
    const { email, password } = c.req.valid("json");
    try {
      const user = await db.select().from(users).where(eq(users.email, email));
      if (user.length === 0) {
        return c.json(
          { error: "Unauthorized", message: "User not found" },
          401
        );
      }
      const isPasswordValid = await bcrypt.compare(password!, user[0].password);
      if (!isPasswordValid) {
        return c.json(
          { error: "Unauthorized", message: "Incorrect password" },
          401
        );
      }
      const token = jwt.sign(
        { email, id: user[0].id },
        process.env.JWT_SECRET! as string,
        {
          expiresIn: "7d",
        }
      );
      setCookie(c, "JIRA_CLONE_AUTH_COOKIE", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
        sameSite: "Strict",
      });
      return c.json({ email, password });
    } catch (err) {
      console.log("Error while login", err);
      return c.json(
        { error: "InternalServerError", message: "Internal Server Error" },
        500
      );
    }
  })
  .post("/register", zValidator("json", insertUserSchema), async (c) => {
    const { name, email, password } = c.req.valid("json");
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const [createdUser] = await db
        .insert(users)
        .values({ name, email, password: hashedPassword })
        .returning();
      return c.json({ data: createdUser });
    } catch (err) {
      if (err instanceof NeonDbError && err.code === "23505") {
        return c.json(
          {
            error: "ConflictError",
            message: "Email already exists.",
          },
          409
        );
      }
      return c.json(
        { error: "InternalServerError", message: "Internal Server Error" },
        500
      );
    }
  })
  .post("/logout", sessionMiddleware, async (c) => {
    try {
      deleteCookie(c, AUTH_COOKIE);
      return c.json({ message: "Logged out successfully" });
    } catch (err) {
      console.log("Error while logout", err);
      return c.json(
        { error: "InternalServerError", message: "Internal Server Error" },
        500
      );
    }
  });
export default app;
