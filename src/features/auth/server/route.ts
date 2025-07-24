import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { deleteCookie, setCookie } from "hono/cookie";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { sessionMiddleware } from "@/lib/session-middleware";
import { AUTH_COOKIE } from "../constants/constant";
import {
  insertUserSchema,
  loginUserSchema,
  selectUserSchema,
  updateUserSchema,
} from "@/zod-schemas/users-schema";
import { startDate, user } from "@/db/schema/schema";
import { auth } from "@/lib/auth";
import z, { string } from "zod";

const app = new Hono()
  .post("/sign-up/email", zValidator("json", insertUserSchema), async (c) => {
    const { name, email, password, confirmPassword } = c.req.valid("json");
    if (password !== confirmPassword) {
      return c.json(
        { error: "BadRequest", message: "Passwords do not match" },
        400
      );
    }
    try {
      const response = await auth.api.signUpEmail({
        body: {
          name,
          email,
          password,
        },
        asResponse: false,
      });
      return c.json({ data: response.user }, 201);
    } catch (error) {
      return c.json(
        {
          error: "InternalServerError",
          message:
            typeof error === "object" && error !== null && "message" in error
              ? (error as { message?: string }).message ||
                "Internal Server Error"
              : "Internal Server Error",
        },
        500
      );
    }
  })
  .post("/sign-in/email", zValidator("json", loginUserSchema), async (c) => {
    const { email, password } = c.req.valid("json");
    if (!email || !password) {
      return c.json(
        { error: "BadRequest", message: "Email and password are required" },
        400
      );
    }
    try {
      const response = await auth.api.signInEmail({
        body: { email, password, callbackURL: "/", rememberMe: true },
      });
      return c.json({ data: response.user }, 200);
    } catch (error) {
      return c.json(
        {
          error: "InternalServerError",
          message:
            typeof error === "object" && error !== null && "message" in error
              ? (error as { message?: string }).message ||
                "Internal Server Error"
              : "Internal Server Error",
        },
        500
      );
    }
  })
  .get("/get-user", sessionMiddleware, async (c) => {
    try {
      const currUser = c.get("user") as typeof auth.$Infer.Session.user | null;
      if (!currUser?.id) {
        return c.json({ data: [] });
      }
      const userFound = await db
        .select()
        .from(user)
        .where(eq(user.id, currUser.id));
      if (userFound.length === 0) {
        return c.json({ data: [] });
      }
      return c.json({ data: userFound });
    } catch (error) {
      return c.json(
        {
          error: "InternalServerError",
          message:
            typeof error === "object" && error !== null && "message" in error
              ? (error as { message?: string }).message ||
                "Internal Server Error"
              : "Internal Server Error",
        },
        500
      );
    }
  })
  .patch(
    "/update-user",
    sessionMiddleware,
    zValidator("json", updateUserSchema),
    async (c) => {
      const userFrom = c.get("user") as typeof auth.$Infer.Session.user | null;
      if (!userFrom?.id) {
        return c.json(
          { error: "Unauthorized", message: "User not found" },
          401
        );
      }
      try {
        const { name, email, image, phoneNumber } = c.req.valid("json");
        const updatedUser = await db
          .update(user)
          .set({ name, email, image, phoneNumber })
          .where(eq(user.id, userFrom.id))
          .returning();
        return c.json({ data: updatedUser[0] });
      } catch (error) {
        return c.json(
          {
            error: "InternalServerError",
            message:
              typeof error === "object" && error !== null && "message" in error
                ? (error as { message?: string }).message ||
                  "Internal Server Error"
                : "Internal Server Error",
          },
          500
        );
      }
    }
  )
  .get("/current", sessionMiddleware, async (c) => {
    try {
      const userFrom = c.get("user") as typeof auth.$Infer.Session.user | null;
      if (!userFrom?.id) {
        return c.json({ data: [] });
      }
      const userFound = await db
        .select()
        .from(user)
        .where(eq(user.id, userFrom.id));
      if (userFound.length === 0) {
        return c.json({ data: [] });
      }
      return c.json({ data: userFound[0] });
    } catch (error) {
      return c.json(
        {
          error: "InternalServerError",
          message:
            typeof error === "object" && error !== null && "message" in error
              ? (error as { message?: string }).message ||
                "Internal Server Error"
              : "Internal Server Error",
        },
        500
      );
    }
  })
  .get(
    "/get-start-date",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: string() })),
    async (c) => {
      console.log("Fetching in server", c.req.valid("query").workspaceId);
      try {
        const userFound = c.get("user") as
          | typeof auth.$Infer.Session.user
          | null;
        if (!userFound?.id) {
          return c.json(
            {
              error: "Unauthorized",
              message: "User not found or not authenticated",
            },
            401
          );
        }
        const { workspaceId } = c.req.valid("query");
        console.log("date for workspaceId:", workspaceId);
        if (!workspaceId) {
          return c.json(
            {
              error: "BadRequest",
              message: "Workspace ID is required",
            },
            400
          );
        }
        const startDateFound = await db
          .select()
          .from(startDate)
          .where(
            and(
              eq(startDate.workspaceId, workspaceId),
              eq(startDate.userId, userFound.id)
            )
          );
        return c.json(
          {
            data: startDateFound.length > 0 ? startDateFound[0] : null,
          },
          200
        );
      } catch (error) {
        return c.json(
          {
            error: "InternalServerError",
            message:
              typeof error === "object" && error !== null && "message" in error
                ? (error as { message?: string }).message ||
                  "Internal Server Error"
                : "Internal Server Error",
          },
          500
        );
      }
    }
  )
  .post(
    "/create-start-date",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        workspaceId: string(),
        startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
          message: "Invalid date format",
        }),
      })
    ),
    async (c) => {
      try {
        const userFound = c.get("user") as
          | typeof auth.$Infer.Session.user
          | null;
        if (!userFound?.id) {
          return c.json(
            {
              error: "Unauthorized",
              message: "User not found or not authenticated",
            },
            401
          );
        }
        const { workspaceId, startDate: startDateValue } = c.req.valid("json");
        if (!workspaceId || !startDateValue) {
          return c.json(
            {
              error: "BadRequest",
              message: "Workspace ID and start date are required",
            },
            400
          );
        }
        const newStartDate = await db
          .insert(startDate)
          .values({
            id: crypto.randomUUID(),
            workspaceId,
            userId: userFound.id,
            startDate: new Date(startDateValue),
          })
          .returning();
        return c.json({ data: newStartDate });
      } catch (error) {
        return c.json(
          {
            error: "InternalServerError",
            message:
              typeof error === "object" && error !== null && "message" in error
                ? (error as { message?: string }).message ||
                  "Internal Server Error"
                : "Internal Server Error",
          },
          500
        );
      }
    }
  )
  .post("/login", zValidator("json", selectUserSchema), async (c) => {
    const { email, password } = c.req.valid("json");
    try {
      const userFound = await db
        .select()
        .from(user)
        .where(eq(user.email, email));
      if (userFound.length === 0) {
        return c.json(
          { error: "Unauthorized", message: "User not found" },
          401
        );
      }
      const isPasswordValid = await bcrypt.compare(
        password!,
        userFound[0].password
      );
      if (!isPasswordValid) {
        return c.json(
          { error: "Unauthorized", message: "Incorrect password" },
          401
        );
      }
      const token = jwt.sign(
        { email, id: userFound[0].id },
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
    } catch (error) {
      return c.json(
        {
          error: "InternalServerError",
          message:
            typeof error === "object" && error !== null && "message" in error
              ? (error as { message?: string }).message ||
                "Internal Server Error"
              : "Internal Server Error",
        },
        500
      );
    }
  })
  .post("/logout", sessionMiddleware, async (c) => {
    try {
      deleteCookie(c, AUTH_COOKIE);
      return c.json({ message: "Logged out successfully" });
    } catch (error) {
      return c.json(
        {
          error: "InternalServerError",
          message:
            typeof error === "object" && error !== null && "message" in error
              ? (error as { message?: string }).message ||
                "Internal Server Error"
              : "Internal Server Error",
        },
        500
      );
    }
  });
export default app;
